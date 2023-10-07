import express from 'express';
import {
  protect,
  restrictToSupervisors,
} from './../controllers/authController.js';
import {
  createHostel,
  getAllCleaners,
  getSupervisor,
  getAllHostels,
} from '../controllers/hostelController.js';

const router = express.Router();

// USER MUST BE LOGGED IN AND A SUPERVISOR TO ACCESS THE FOLLOWING ROUTES
router.use(protect);
router.use(restrictToSupervisors);

router.post('/createHostel', createHostel);
router.get('/getAllCleaners', getAllCleaners);
router.get('/getSupervisor', getSupervisor);
router.get('/getAllHostels', getAllHostels);

export default router;
