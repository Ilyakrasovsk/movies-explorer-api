const moviesRouter = require('express').Router();
const {
  getMovies,
  deleteMovie,
  createMovies,
} = require('../controllers/movies');
const { movieValidation, movieIdValidation } = require('../middlewares/validation');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', movieValidation, createMovies);
moviesRouter.delete('/:movieId', movieIdValidation, deleteMovie);

module.exports = moviesRouter;
