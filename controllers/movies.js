const ValidationError = require('../errors/validation-error');
const NotFoundError = require('../errors/not-found-error');
const Forbidden = require('../errors/forbidden-error');
const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.send(movies))
  .catch(next);

module.exports.createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner: req.user._id,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании карточки фильма');
      }
      throw err;
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const movieId = req.params._id;
  return Movie.findById(movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм с указанным _id не найден.');
    })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return Movie.findByIdAndRemove(movieId)
          .then(() => res.send(movie));
      }
      throw new Forbidden('Вы пытаетесь удалить чужую карточку');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Переданы некорректные данные');
      }
      throw err;
    })
    .catch(next);
};
