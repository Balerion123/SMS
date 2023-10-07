import express from 'express';
import {
  getMyProfile,
  studentSignup,
  createBooking,
  leaveComplain,
  test,
} from '../controllers/studentController.js';
import {
  protect,
  restrictToStudents,
  getMe,
} from '../controllers/authController.js';
import { getMyBookings } from '../controllers/studentController.js';

const router = express.Router();

router.get('/test', test);
router.post('/signup', studentSignup);

// USER MUST BE LOGGED IN AND A STUDENT TO ACCESS THE FOLLOWING ROUTES
router.use(protect);
router.use(restrictToStudents);

router.get('/getMyProfile', getMe, getMyProfile);
router.get('/getMyBookings', getMe, getMyBookings);
router.post('/createBooking', getMe, createBooking);
router.post('/leaveComplain', getMe, leaveComplain);

export default router;
