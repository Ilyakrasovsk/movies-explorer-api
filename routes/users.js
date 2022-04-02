const router = require('express').Router();
const {
  getAnyUser,
  updateUser,
} = require('../controllers/users');
const { userDataValidation } = require('../middlewares/validation');

router.get('/users/me', getAnyUser);
router.patch('/users/me', userDataValidation, updateUser);

module.exports = router;
