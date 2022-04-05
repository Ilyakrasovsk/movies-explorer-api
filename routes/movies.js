const router = require('express').Router();
const {
  getMovies,
  deleteMovie,
  createMovies,
} = require('../controllers/movies');
const { movieValidation, movieIdValidation } = require('../middlewares/validation');

router.get('/movies', getMovies);
router.post('/movies', movieValidation, createMovies);
router.delete('/movies/:movieId', movieIdValidation, deleteMovie);

module.exports = router;
