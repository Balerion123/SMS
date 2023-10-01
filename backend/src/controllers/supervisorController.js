import Supervisor from '../models/supervisorModel.js';
import Hostel from '../models/hostelModel.js';
import { createSendToken } from './authController.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const supervisorSignup = catchAsync(async (req, res, next) => {
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

  const newSupervisor = await Supervisor.create({
    name,
    email,
    phoneNumber,
    hostel: hostel._id,
    password,
  });

  createSendToken(newSupervisor, 201, res);
});

export const getMyProfile = catchAsync(async (req, res, next) => {
  const user = await Supervisor.findById(req.params.id);
  if (!user) return next(new AppError('Supervisor not found', 401));

  res.status(200).json({
    status: 'success',
    user,
  });
});
