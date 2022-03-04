const router = require('express').Router();
const {
  getAnyUser,
  updateUser,
} = require('../controllers/users');
const { userDataValidation } = require('../middlewares/validation');

router.get('/me', getAnyUser);
router.patch('/me', userDataValidation, updateUser);

module.exports = router;
