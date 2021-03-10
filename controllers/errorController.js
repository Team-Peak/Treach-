const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  //handle our own custom error
  if (err.isOperational) {
    res.status(err, statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  //handle other error with generic message
  console.log(err);
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendProdError(err, res);
  }
};

//FIXME:
//setup error classifier
//handle jwt error //invalid jwt signature //jwt has expired
//handle db error //invalid id cast to err //validation error //duplicate error
