const express = require('express');
const app = express();
const morgan = require('morgan');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');
const userRouter = require('./routes/userRoute');

//middelwares

//accessing req.body
app.use(express.json());
//for http logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//handle static files
app.use(express.static('public'));

//routes
app.use('/api/v1/users', userRouter);

//handle undefined route
app.all('*', (req, res, next) => {
  return next(
    new AppError(`This route ${req.originalUrl} is not our server`, 404)
  );
});

//handle global error
app.use(globalErrorHandler);

module.exports = app;
