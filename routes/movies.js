const router = require('express').Router();
const {
  getMovies,
  deleteMovie,
  createMovies,
} = require('../controllers/movies');
const { movieValidation, movieIdValidation } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', movieValidation, createMovies);
router.delete('/:_id', movieIdValidation, deleteMovie);

module.exports = router;
