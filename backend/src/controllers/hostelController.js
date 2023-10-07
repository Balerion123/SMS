import Cleaner from '../models/cleanerModel.js';
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

  const hostel = await Hostel.findOne({ abbreviatedName: hostelName });
  if (!hostel) return next(new AppError('Hostel not found', 400));
  const cleaners = await Cleaner.find({ hostel: hostel._id });

  res.status(200).json({ status: 'success', cleaners });
});

export const getSupervisor = catchAsync(async (req, res, next) => {
  const { hostelName } = req.query;
  if (!hostelName) return next(new AppError('Attach hostelName to query', 400));

  const hostel = await Hostel.findOne({ abbreviatedName: hostelName });
  if (!hostel) return next(new AppError('Hostel not found', 400));
  const supervisors = await Supervisor.findOne({ hostel: hostel._id });

  res.status(200).json({ status: 'success', supervisors });
});

export const getAllHostels = catchAsync(async (req, res, next) => {
  const hostels = await Hostel.find();

  res.status(200).json({
    status: 'success',
    hostels,
  });
});
