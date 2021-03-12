const sendDevError = (err, req, res) => {
  //handles api
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      err,
      stack: err.stack,
    });
  }

  //rendered website
 return res.status(err.statusCode).render('error', {
    title: 'error',
    message: err.message,
  });
};

const sendProdError = (err, req, res) => {
  //handles api
  if (req.originalUrl.startsWith('/api')) {
    //handle our own custom error
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    //handle other error with generic message
    console.log(err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
  //for rendered 
  //handle our own custom error
  if (err.isOperational) {
    return res.status(err.statusCode).render({
      title: 'Something went very wrong',
      message: err.message,
    });
  }

  //handle other error with generic message
  console.log(err);
  return res.status(err.statusCode).render('error', {
    title: 'something went very wrong',
    message:'Please try again later'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendProdError(err, req, res);
  }
};

//FIXME:
//setup error classifier
//handle jwt error //invalid jwt signature //jwt has expired
//handle db error //invalid id cast to err //validation error //duplicate error
