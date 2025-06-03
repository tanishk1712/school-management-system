import express from 'express';
import {
  createFee,
  getFees,
  updateFeeStatus,
  deleteFee
} from '../controllers/feeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getFees)
  .post(createFee);

router.route('/:id')
  .put(updateFeeStatus)
  .delete(deleteFee);

export default router;