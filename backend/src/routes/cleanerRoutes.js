import express from 'express';
import {
  getMyProfile,
  cleanerSignup,
  getAllBookings,
  acceptBooking,
  getMyBookings,
  completeBookingSuccess,
  completeBookingFailure,
} from '../controllers/cleanerController.js';
import { protect, getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', cleanerSignup);

// USER MUST BE LOGGED IN TO ACCESS THE FOLLOWING ROUTES
router.use(protect);

router.get('/getMyProfile', getMe, getMyProfile);
router.get('/getAllBookings', getMe, getAllBookings);
router.get('/getMyBookings', getMe, getMyBookings);
router.get('/acceptBooking', getMe, acceptBooking);
router.get('/completeBookingSuccess', getMe, completeBookingSuccess);
router.post('/completeBookingFailure', getMe, completeBookingFailure);

export default router;
