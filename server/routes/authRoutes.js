import express from 'express';
import {
  registerSchool,
  loginSchool,
  logoutSchool,
  getSchoolProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerSchool);
router.post('/login', loginSchool);
router.post('/logout', logoutSchool);
router.get('/me', protect, getSchoolProfile);

export default router;