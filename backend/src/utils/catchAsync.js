import AppError from './AppError.js';

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(new AppError(err.message, 400)));
  };
};

export default catchAsync;
