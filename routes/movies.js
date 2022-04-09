const router = require('express').Router();
const {
  getMovies,
  deleteMovie,
  createMovies,
  deleteMoviesAll,
} = require('../controllers/movies');
const { movieValidation, movieIdValidation } = require('../middlewares/validation');

router.get('/movies', getMovies);
router.post('/movies', movieValidation, createMovies);
router.delete('/movies/:movieId', movieIdValidation, deleteMovie);
router.get('/movies-flush', deleteMoviesAll);

module.exports = router;
