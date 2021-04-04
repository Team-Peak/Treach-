const express = require('express');
const app = express();
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');
const userRouter = require('./routes/userRoute');
const viewRouter = require('./routes/viewsRoute');
const postRouter = require('./routes/postRoute');
const path = require('path');
const pug = require('pug');
const cookieparser = require('cookie-parser');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cors = require('cors');
const resourceRouter = require('./routes/resourcesRoute');
//Global middelwares

const limiter = rateLimiter({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this Ip ,Try again in an hour',
});

//compression
app.use(compression());

app.use(limiter);

//implementing cors
app.use(cors());
app.options('*', cors());

//set security http headers
app.use(helmet());

//Data sanitizatiion from against NoSql query injection
app.use(mongoSanitize());

//Data sanitization from xss attack
app.use(xss());

//prevent parameter polution
app.use(hpp());

//ac)cessing req.body
app.use(express.json({ limit: '10kb' }));

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
app.use('/api/v1/resources', resourceRouter);
app.use('/api/v1/posts', postRouter);

//handle undefined route
app.all('*', (req, res, next) => {
  return next(
    new AppError(`This route ${req.originalUrl} is not our server`, 404)
  );
});

//handle global error
app.use(globalErrorHandler);

module.exports = app;
