const userRouter = require('express').Router();
const {
  getAnyUser,
  updateUser,
} = require('../controllers/users');
const { userDataValidation } = require('../middlewares/validation');

userRouter.get('/me', getAnyUser);
userRouter.patch('/me', userDataValidation, updateUser);

module.exports = userRouter;
