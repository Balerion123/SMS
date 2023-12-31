import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import Student from '../models/studentModel.js';
import Cleaner from '../models/cleanerModel.js';
import Supervisor from '../models/supervisorModel.js';

// CREATE SIGN TOKEN
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// CREATE TOKEN TO BE SENT TO BE ASSIGNED TO THE USER
export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const newUser = await Student.create({
    name,
    email,
    password,
  });

  createSendToken(newUser, 201, res);
});

export const adminOnly = catchAsync(async (req, res, next) => {
  const user = await Student.findById(req.user.id);
  if (user.isAdmin === true) {
    return next();
  } else {
    res.status(401).json({
      status: 'failed',
      message: 'You are not an admin',
    });
  }
  res.status(401).json({
    status: 'failed',
    message: 'You are not an admin',
    error: err.message,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const studentPromise = Student.findOne({ email }).select('+password');
  const cleanerPromise = Cleaner.findOne({ email }).select('+password');
  const supervisorPromise = Supervisor.findOne({ email }).select('+password');

  const [student, cleaner, supervisor] = await Promise.all([
    studentPromise,
    cleanerPromise,
    supervisorPromise,
  ]);

  if (!student && !cleaner && !supervisor)
    return next(new AppError('No user with this email!', 401));

  let user = '';
  if (student) user = student;
  if (cleaner) user = cleaner;
  if (supervisor) user = supervisor;

  if (user.password !== password) {
    return next(new AppError('Incorrect password!', 401));
  }

  createSendToken(user, 200, res);
});

export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res
    .status(200)
    .json({ status: 'success', message: 'Successfully Logged Out' });
};

// ROUTE TO CHECK WHETHER THE USER IS LOGGED IN
export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  let currentUser = '';

  const student = await Student.findById(decoded.id);
  const cleaner = await Cleaner.findById(decoded.id);
  const supervisor = await Supervisor.findById(decoded.id);

  // 3) Check if user still exists
  if (!student && !cleaner && !supervisor) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exists',
        401
      )
    );
  }

  if (student) currentUser = student;
  if (cleaner) currentUser = cleaner;
  if (supervisor) currentUser = supervisor;

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

export const restrictToStudents = catchAsync(async (req, res, next) => {
  const userID = req.user.id;

  const student = await Student.findById(userID);

  if (!student) return next(new AppError('Not a student!', 403));
  next();
});

export const restrictToCleaners = catchAsync(async (req, res, next) => {
  const userID = req.user.id;

  const cleaner = await Cleaner.findById(userID);

  if (!cleaner) return next(new AppError('Not a cleaner!', 403));
  next();
});

export const restrictToSupervisors = catchAsync(async (req, res, next) => {
  const userID = req.user.id;

  const supervisor = await Supervisor.findById(userID);

  if (!supervisor) return next(new AppError('Not a supervisor!', 403));
  next();
});

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
