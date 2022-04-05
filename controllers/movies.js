const ValidationError = require('../errors/validation-error');
const NotFoundError = require('../errors/not-found-error');
const Forbidden = require('../errors/forbidden-error');
const Movie = require('../models/movie');

// module.exports.getMovies = (req, res, next) => Movie.find({})
//   .then((movies) => res.send(movies))
//   .catch(next);
odule.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Вы не правильно заполнили обязательные поля'));
      }
      return next(err);
    });
};
module.exports.createMovie = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Вы не правильно заполнили обязательные поля'));
      }
      return next(err);
    })
    .catch(next);
};
// module.exports.createMovies = (req, res, next) => {
//   const {
//     country,
//     director,
//     duration,
//     year,
//     description,
//     image,
//     trailerLink,
//     thumbnail,
//     movieId,
//     nameRU,
//     nameEN,
//   } = req.body;
//    Movie.create({
//     country,
//     director,
//     duration,
//     year,
//     description,
//     image,
//     trailerLink,
//     thumbnail,
//     movieId,
//     owner: req.user._id,
//     nameRU,
//     nameEN,
//   })
//     .then((movie) => res.send(movie))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         throw new ValidationError('Переданы некорректные данные при создании карточки фильма');
//       }
//       throw err;
//     })
//     .catch(next);
// };
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильма с указанным _id не найдена.');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new BadRequestError('Переданы некорректные данные.');
      }

      Movie.findByIdAndDelete(req.params.movieId).select('-owner')
        .then((deletedMovie) => res.status(200).send(deletedMovie))
        .catch((err) => {
          if (err.kind === 'ObjectId') {
            next(new BadRequestError('Невалидный id'));
          }
          return next(err);
        });
    });
// module.exports.deleteMovie = (req, res, next) => {
//   const movieId = req.params._id;
//   return Movie.findById(movieId)
//     .orFail(() => {
//       throw new NotFoundError('Фильм с указанным _id не найден.');
//     })
//     .then((movie) => {
//       if (movie.owner.toString() === req.user._id) {
//         return Movie.findByIdAndRemove(movieId)
//           .then(() => res.send(movie));
//       }
//       throw new Forbidden('Вы пытаетесь удалить чужую карточку');
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         throw new ValidationError('Переданы некорректные данные');
//       }
//       throw err;
//     })
//     .catch(next);
// };
