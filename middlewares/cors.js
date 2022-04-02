const allowedCors = [
  'http://localhost:3000',
  'https://localhost:3000',
  'https://api.diplom.ilkras.nomoredomains.work/',
  'http://api.diplom.ilkras.nomoredomains.work/',
  'https://diplom.ilkras.nomoredomains.work/',
  'http://diplom.ilkras.nomoredomains.work/',
];

const cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
    return
  }

  return next();
};

module.exports = cors;
