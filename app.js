require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-error');
const errorHandler = require('./middlewares/errorHadler');
const router = require('./routes/index');
//const cors = require('./middlewares/cors');
const cors = require('cors');

const DB_ADDRES = require('./utils/config');
const { PORT = 3000, DB_URL, NODE_ENV } = process.env;

const app = express();
mongoose.connect(NODE_ENV === 'production' ? DB_URL : DB_ADDRES, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const allowedCors = [
  'http://localhost:3000',
  'http://api.diplom.ilkras.nomoredomains.work/'
  'https://api.diplom.ilkras.nomoredomains.work/'
];
app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', '*');
  }
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }
  next();
});

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
