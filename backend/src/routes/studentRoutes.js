import express from 'express';
import {
  getMyProfile,
  studentSignup,
  createBooking,
  test,
  leaveComplain,
} from '../controllers/studentController.js';
import { protect, getMe } from '../controllers/authController.js';
import { getMyBookings } from '../controllers/studentController.js';

const router = express.Router();

router.get('/test', test);
router.post('/signup', studentSignup);

// USER MUST BE LOGGED IN TO ACCESS THE FOLLOWING ROUTES
router.use(protect);

router.get('/getMyProfile', getMe, getMyProfile);
router.get('/getMyBookings', getMe, getMyBookings);
router.post('/createBooking', getMe, createBooking);
router.post('/leaveComplain', getMe, leaveComplain);

export default router;
