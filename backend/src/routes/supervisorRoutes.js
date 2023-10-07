import express from 'express';
import {
  getComplaints,
  getMyProfile,
  supervisorSignup,
} from '../controllers/supervisorController.js';
import { protect, getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', supervisorSignup);

// USER MUST BE LOGGED IN TO ACCESS THE FOLLOWING ROUTES
router.use(protect);

router.get('/getMyProfile', getMe, getMyProfile);
router.get('/getComplaints', getMe, getComplaints);

export default router;
