const JSend = require('jsend');

const jsendMiddleware = (req, res, next) => {
  res.success = (data) => {
    res.status(200).jsend.success(data);
  };

  res.fail = (data) => {
    res.status(400).jsend.fail(data);
  };

  res.error = (message, code, statusCode = 500, data = null) => {
    const errorResponse = { message };
    if (code) errorResponse.code = code;
    if (data) errorResponse.data = data;
    res.status(statusCode).jsend.error(errorResponse);
  };

  next();
};

module.exports = jsendMiddleware;
