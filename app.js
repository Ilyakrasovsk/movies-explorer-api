require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-error');
const errorHandler = require('./middlewares/errorHadler');
const router = require('./routes/index');
const cors = require('./middlewares/cors');

const DB_ADDRES = require('./utils/config');
const { PORT = 3000, DB_URL, NODE_ENV } = process.env;

const app = express();
mongoose.connect(NODE_ENV === 'production' ? DB_URL : DB_ADDRES, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

console.log(cors);

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


app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${PORT}`);
});
