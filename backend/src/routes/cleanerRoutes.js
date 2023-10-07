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
import {
  protect,
  restrictToCleaners,
  getMe,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', cleanerSignup);

// USER MUST BE LOGGED IN AND A CLEANER TO ACCESS THE FOLLOWING ROUTES
router.use(protect);
router.use(restrictToCleaners);

router.get('/getMyProfile', getMe, getMyProfile);
router.get('/getAllBookings', getMe, getAllBookings);
router.get('/getMyBookings', getMe, getMyBookings);
router.get('/acceptBooking', getMe, acceptBooking);
router.get('/completeBookingSuccess', getMe, completeBookingSuccess);
router.post('/completeBookingFailure', getMe, completeBookingFailure);

export default router;
