module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err,
    stack: err.stack,
  });
};


//FIXME:
//setup error classifier
//handle jwt error //invalid jwt signature //jwt has expired
//handle db error //invalid id cast to err //validation error //duplicate error