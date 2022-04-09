const ValidationError = require('../errors/validation-error');
const NotFoundError = require('../errors/not-found-error');
const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({owner: req.user._id})
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Вы не правильно заполнили обязательные поля'));
      }
      return next(err);
    });
};
module.exports.createMovies = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Вы не правильно заполнили обязательные поля'));
      }
      return next(err);
    })
    .catch(next);
};
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильма с указанным _id не найдена.');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ValidationError('Переданы некорректные данные.');
      }

      Movie.findByIdAndDelete(req.params.movieId).select('-owner')
        .then((deletedMovie) => res.status(200).send(deletedMovie))
        .catch((err) => {
          if (err.kind === 'ObjectId') {
            next(new ValidationError('Невалидный id'));
          }
          return next(err);
        });
    });
};
module.exports.deleteMoviesAll = (req, res, next) => {
  Movie.deleteMany({});
};
