import Cleaner from '../models/cleanerModel';
import Hostel from '../models/hostelModel.js';
import { createSendToken } from './authController.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const cleanerSignup = catchAsync(async (req, res, next) => {
  const { name, email, phoneNumber, hostelName, password, confirmPassword } =
    req.body;

  if (password !== confirmPassword)
    return next(new AppError('Passwords do not match', 400));

  const hostel = await Hostel.findOne({
    abbreviatedName: hostelName,
  });

  if (!hostel)
    return next(
      new AppError('Could not find the hostel you were looking for', 400)
    );

  const newCleaner = await Cleaner.create({
    name,
    email,
    phoneNumber,
    hostel: hostel._id,
    password,
  });

  createSendToken(newCleaner, 201, res);
});

export const getMyProfile = catchAsync(async (req, res, next) => {
  const user = await Student.findById(req.params.id);
  if (!user) return next(new AppError('Student not found', 401));

  res.status(200).json({
    status: 'success',
    user,
  });
});
