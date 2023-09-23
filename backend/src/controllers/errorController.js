import AppError from '../utils/AppError.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const textBetweenQuotes = /(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/g;
  const value = err.message.match(textBetweenQuotes);
  const message = `Duplicate field value: ${value}. Please use another value`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational trusted errors
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error
  } else {
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.message.startsWith('Cast to')) err = handleCastErrorDB(err);
    if (err.message.startsWith('E11000')) err = handleDuplicateFieldsDB(err);

    sendErrorProd(err, res);
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Environment is neither development not production',
    });
  }
};

export default errorHandler;
