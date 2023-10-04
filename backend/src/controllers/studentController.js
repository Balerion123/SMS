import Student from '../models/studentModel.js';
import Hostel from '../models/hostelModel.js';
import { createSendToken } from './authController.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import Booking from '../models/bookingModel.js';

export const test = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working',
  });
};

export const studentSignup = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    enrollmentNumber,
    phoneNumber,
    hostelName,
    roomNumber,
    password,
    confirmPassword,
  } = req.body;

  if (password !== confirmPassword)
    return next(new AppError('Passwords do not match', 400));

  const hostel = await Hostel.findOne({
    abbreviatedName: hostelName,
  });

  if (!hostel)
    return next(
      new AppError('Could not find the hostel you were looking for', 400)
    );

  const newStudent = await Student.create({
    name,
    email,
    enrollmentNumber,
    hostel: hostel._id,
    phoneNumber,
    roomNumber,
    password,
  });

  createSendToken(newStudent, 201, res);
});

export const createBooking = catchAsync(async (req, res, next) => {
  const { slots } = req.body;

  const student = await Student.findById(req.params.id);

  const newBooking = await Booking.create({
    student: student._id,
    hostel: student.hostel,
    slots,
  });

  res.status(201).json({
    status: 'success',
    message: 'Successfully created booking',
  });
});

export const getMyProfile = catchAsync(async (req, res, next) => {
  const user = await Student.findById(req.params.id);
  if (!user) return next(new AppError('Student not found', 401));

  res.status(200).json({
    status: 'success',
    user,
  });
});
