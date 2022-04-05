const { JWT_SECRET, NODE_ENV } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ValidationError = require('../errors/validation-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const User = require('../models/user');

// module.exports.createUser = (req, res, next) => {
//   const { name, email, password } = req.body;
//   bcrypt.hash(password, 10)
//     .then((hash) => User.create({
//       name,
//       email,
//       password: hash,
//     }))
//     .then((user) => res.status(201).send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         throw new ValidationError('Переданы некорректные данные при создании пользователя');
//       } else if (err.code === 11000) {
//         throw new ConflictError(`Пользователь с таким email ${email} уже существует`);
//       } else {
//         retutn next(err);
//       }
//     })
//     .catch(next);
// };
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Такой пользователь уже создан');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      email, password: hash, name,
    })
      .then((user) => res.status(200).send({
        user: {
          email: user.email,
          name: user.name,
          _id: user._id,
        },
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new ValidationError('Ошибка сервера');
        }
        return next(err);
      }))
    .catch(next);
};


// module.exports.getAnyUser = (req, res, next) => { User.findById(req.user._id)
//   .orFail(() => {
//     throw new NotFoundError('Пользователь не найден');
//   })
//   .then((user) => res.send({ user }))
//   .catch((err) => {
//     if (err.name === 'NotFoundError') {
//       throw new NotFoundError('Пользователь не найден');
//     } else {
//       next(err);
//     }
//   })
//   .catch(next);
// };
module.exports.getAnyUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Ошибка сервера');
      }
      return next(err);
    })
    .catch(next);
};
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError(`Нет такого пользователя ${id}`);
    })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Вы не правильно заполнили обязательные поля');
      } else if (err.code === 11000) {
        throw new ConflictError('Введите другой email');
      }
      return next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key'}`, { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};
