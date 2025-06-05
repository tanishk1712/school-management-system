import express from 'express';
import {
  createFee,
  getFees,
  updateFeeStatus,
  deleteFee
} from '../controllers/feeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authenticateToken } from '../middleware/auth.js';
import Fee from '../models/Fee.js';

const router = express.Router();

// router.use(protect);

// router.route('/')
//   .get(getFees)
//   .post(createFee);

// router.route('/:id')
//   .put(updateFeeStatus)
//   .delete(deleteFee);

// export const createFee = async (req, res) => {
//   try {
//     const {
//       studentId,
//       amount,
//       type,
//       month,
//       year,
//       dueDate,
//       description
//     } = req.body;

//     const newFee = await Fee.create({
//       schoolId: req.user._id,
//       studentId,
//       amount,
//       type,
//       month,
//       year,
//       dueDate,
//       description
//     });

//     res.status(201).json(newFee);
//   } catch (error) {
//     console.error('Create fee error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

router.post('/', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.id;
    const {
      studentId,
      amount,
      type,
      month,
      year,
      dueDate,
      description
    } = req.body;

    // Validate input
    if (!amount || !type || !month || !year || !dueDate || !description) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const newFee = await Fee.create({
      schoolId,
      studentId,
      amount,
      type,
      month,
      year,
      dueDate,
      description
    });

    const savedFee = await newFee.save();

    res.status(201).json(savedFee);
  } catch (error) {
    console.error('Create fee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const fees = await Fee.find({ schoolId: req.user.id })
      .populate('studentId', 'name rollNumber class section')
      .sort({ createdAt: -1 });

    res.json(fees);
  } catch (error) {
    console.error('Get fees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;