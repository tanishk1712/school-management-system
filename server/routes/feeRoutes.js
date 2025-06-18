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
      description,
      status
    } = req.body;

    if (!amount || !type || !month || !year || !dueDate || !description || !status) {
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
      description,
      status
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

router.put('/status/:id', authenticateToken, async (req, res) => {
  try {
    const feeId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updatedFee = await Fee.findByIdAndUpdate(
      feeId,
      { status },
      { new: true }
    );

    if (!updatedFee) {
      return res.status(404).json({ message: 'Fee not found' });
    }

    res.json(updatedFee);
  } catch (error) {
    console.error('Update fee status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
