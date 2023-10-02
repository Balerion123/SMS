import Hostel from '../models/hostelModel.js';
import Supervisor from '../models/supervisorModel.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const createHostel = catchAsync(async (req, res, next) => {
  const { name, abbreviatedName } = req.body;
  await Hostel.create({ name, abbreviatedName });

  res
    .status(201)
    .json({ status: 'success', message: 'Hostel created successfully' });
});

export const getAllCleaners = catchAsync(async (req, res, next) => {
  const { hostelName } = req.query;
  if (!hostelName) return next(new AppError('Attach hostelName to query', 400));

  const hostel = await Hostel.findOne({
    abbreviatedName: hostelName,
  }).populate('cleaners');

  res.status(200).json({ status: 'success', hostel });
});

export const getSupervisor = catchAsync(async (req, res, next) => {
  const { hostelName } = req.query;
  if (!hostelName) return next(new AppError('Attach hostelName to query', 400));

  const hostel = Hostel.findOne({
    abbreviatedName: hostelName,
  }).populate('supervisor');

  res.status(200).json({ status: 'success', hostel });
});

export const getAllHostels = catchAsync(async (req, res, next) => {
  const hostels = await Hostel.find();

  res.status(200).json({
    status: 'success',
    hostels,
  });
});
