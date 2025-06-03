import Fee from '../models/Fee.js';

// Create new fee record
export const createFee = async (req, res) => {
  try {
    const {
      studentId,
      amount,
      type,
      month,
      year,
      dueDate,
      description
    } = req.body;

    const newFee = await Fee.create({
      schoolId: req.user._id,
      studentId,
      amount,
      type,
      month,
      year,
      dueDate,
      description
    });

    res.status(201).json(newFee);
  } catch (error) {
    console.error('Create fee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all fees for a school
export const getFees = async (req, res) => {
  try {
    const fees = await Fee.find({ schoolId: req.user._id })
      .populate('studentId', 'name rollNumber class section')
      .sort({ createdAt: -1 });
    
    res.json(fees);
  } catch (error) {
    console.error('Get fees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update fee status
export const updateFeeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const fee = await Fee.findOne({ 
      _id: req.params.id,
      schoolId: req.user._id
    });

    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    fee.status = status;
    if (status === 'PAID') {
      fee.paidDate = new Date();
    }

    await fee.save();
    res.json(fee);
  } catch (error) {
    console.error('Update fee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete fee record
export const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findOneAndDelete({
      _id: req.params.id,
      schoolId: req.user._id
    });

    if (!fee) {
      return res.status(404).json({ message: 'Fee record not found' });
    }

    res.json({ message: 'Fee record deleted successfully' });
  } catch (error) {
    console.error('Delete fee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};