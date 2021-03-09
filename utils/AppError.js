class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
    this.isOperational = true;  //to check if it's my custom error 
    Error.captureStackTrace(this);
  }
}

module.exports = AppError;
