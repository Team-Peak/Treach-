const express = require('express');
const app = express();
const morgan = require('morgan');

//middelwares
//for http logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

module.exports = app;
