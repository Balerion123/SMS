import Student from '../models/studentModel.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const test = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working',
  });
};

export const getMyProfile = catchAsync(async (req, res, next) => {
  const user = await Student.findById(req.params.id);
  if (!user) return next(new AppError('Student not found', 401));

  res.status(200).json({
    status: 'success',
    user,
  });
});
