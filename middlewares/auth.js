const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Неправильная авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key'}`);
    req.user = payload;
  } catch (err) {
    throw new AuthError('Неправильная авторизация');
  }
  next();
};
