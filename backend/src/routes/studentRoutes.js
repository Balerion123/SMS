import express from 'express';
import {
  getMyProfile,
  studentSignup,
  createBooking,
  test,
} from '../controllers/studentController.js';
import { protect, getMe } from '../controllers/authController.js';

const router = express.Router();

router.get('/test', test);
router.post('/signup', studentSignup);

// USER MUST BE LOGGED IN TO ACCESS THE FOLLOWING ROUTES
router.use(protect);

router.get('/getMyProfile', getMe, getMyProfile);
router.post('/createBooking', getMe, createBooking);

export default router;
