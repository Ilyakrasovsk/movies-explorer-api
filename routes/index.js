const router = require('express').Router();
const loginRouter = require('./login');
const moviesRouter = require('./movies');
const userRouter = require('./users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

router.use(loginRouter);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', moviesRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Тут ничего нет'));
});

module.exports = router;
