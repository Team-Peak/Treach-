const express = require('express');
const app = express();
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');
const userRouter = require('./routes/userRoute');
const viewRouter = require('./routes/viewsRoute');
const path = require('path');
const pug = require('pug');
const cookieparser = require('cookie-parser');
const rateLimiter = require('express-rate-limit')

//Global middelwares

//rate limiter

const limiter = rateLimiter({
  max: 2,
  windowMs: 60 * 60 * 1000,
  message:'Too many requests from this Ip ,Try again in an hour'
});

app.use(limiter);

//accessing req.body
app.use(express.json());

//cookie parser
app.use(cookieparser());
//for http logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//handle static files
app.use(express.static('public'));
//serving dynamic files
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//routes
app.use('/api/v1/users', userRouter);
app.use('/', viewRouter);

//handle undefined route
app.all('*', (req, res, next) => {
  return next(
    new AppError(`This route ${req.originalUrl} is not our server`, 404)
  );
});

//handle global error
app.use(globalErrorHandler);

module.exports = app;
