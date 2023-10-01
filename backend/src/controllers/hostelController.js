import Hostel from '../models/hostelModel.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const createHostel = catchAsync(async (req, res, next) => {
  const { name, abbreviatedName } = req.body;
  await Hostel.create({ name, abbreviatedName });

  res
    .status(201)
    .json({ status: 'success', message: 'Hostel created successfully' });
});

export const getAllHostels = catchAsync(async (req, res, next) => {
  const hostels = await Hostel.find();
  console.log(hostels);

  res.status(200).json({
    status: 'success',
    hostels,
  });
});
