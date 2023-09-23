import express from 'express';
import { getMyProfile, test } from '../controllers/userController.js';
import { protect, getMe } from './../controllers/authController.js';

const router = express.Router();

router.get('/test', test);

// USER MUST BE LOGGED IN TO ACCESS THE FOLLOWING ROUTES
router.use(protect);

router.get('/getMyProfile', getMe, getMyProfile);

export default router;
