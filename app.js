require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const errorHandler = require('./middlewares/errorHadler');
const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const { loginValidation, userValidation } = require('./middlewares/validation');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(requestLogger);

app.post('/signup', userValidation, createUser);
app.post('/signin', loginValidation, login);

app.use(auth);

app.use('/users', userRouter);
app.use('/movies', moviesRouter);

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/bitfilmsbd', () => {
  console.log('Подключение успешно');
});

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});
