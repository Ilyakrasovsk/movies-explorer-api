require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-error');
const errorHandler = require('./middlewares/errorHadler');
const router = require('./routes/index');
const DB_ADDRES = require('./utils/config');
const cors = require('./middlewares/cors');

const app = express();
const { PORT = 3000, DB_URL, NODE_ENV } = process.env;

app.use(cors);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(requestLogger);

app.use(router);

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(NODE_ENV === 'production' ? DB_URL : DB_ADDRES, () => {
  console.log('Подключение успешно');
});

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});
