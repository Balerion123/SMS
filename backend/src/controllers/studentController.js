import Student from '../models/studentModel.js';
import Hostel from '../models/hostelModel.js';
import { createSendToken } from './authController.js';
import mongoose from 'mongoose';
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
    bookingTime: Date.now(),
    slots,
  });

  res.status(201).json({
    status: 'success',
    message: 'Successfully created booking',
    newBooking,
  });
});

export const getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ student: req.params.id });

  res.status(200).json({ status: 'success', bookings });
});

export const leaveComplain = catchAsync(async (req, res, next) => {
  const { bookingID } = req.query;
  const { complaint } = req.body;

  const booking = await Booking.findById(bookingID);
  const studentID = req.params.id;

  if (!booking) return next(new AppError('Booking id is not valid', 400));
  if (studentID !== req.params.id)
    return next(new AppError('You are not associated with this booking', 403));

  booking.complaint = complaint;
  await booking.save();

  res.status(200).json({
    status: 'success',
    message: 'complaint has been sent successfully',
  });
});

export const rateBooking = catchAsync(async (req, res, next) => {
  const { bookingID } = req.query;
  const { rating } = req.body;

  if (!rating) return next(new AppError('Rating is required', 400));
  const booking = await Booking.findById(bookingID).populate('cleaner');
  if (!booking) return next(new AppError('Booking id is not valid', 400));

  if (booking.student.toString() !== req.params.id)
    return next(new AppError('You are not associated with this booking', 403));

  if (booking.status !== 'Completed')
    return next(new AppError('Booking is not completed yet', 403));

  const cleaner = booking.cleaner;
  const { reviewsCount, stars } = cleaner.rating;
  const newStars = (stars * reviewsCount + rating) / (reviewsCount + 1);
  cleaner.rating = {
    reviewsCount: reviewsCount + 1,
    stars: newStars,
  };
  await cleaner.save();

  booking.rating = rating;
  await booking.save();

  res.status(200).json({
    status: 'success',
    message: 'booking has been rated successfully',
  });
});

export const getMyProfile = catchAsync(async (req, res, next) => {
  const user = await Student.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    user,
  });
});
