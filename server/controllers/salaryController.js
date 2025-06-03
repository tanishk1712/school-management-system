import Salary from '../models/Salary.js';

// Create new salary record
export const createSalary = async (req, res) => {
  try {
    const {
      teacherId,
      amount,
      month,
      year,
      bonusAmount,
      deductions,
      description
    } = req.body;

    const newSalary = await Salary.create({
      schoolId: req.user._id,
      teacherId,
      amount,
      month,
      year,
      bonusAmount,
      deductions,
      description
    });

    res.status(201).json(newSalary);
  } catch (error) {
    console.error('Create salary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all salaries for a school
export const getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find({ schoolId: req.user._id })
      .populate('teacherId', 'name email subject')
      .sort({ createdAt: -1 });
    
    res.json(salaries);
  } catch (error) {
    console.error('Get salaries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update salary status
export const updateSalaryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const salary = await Salary.findOne({ 
      _id: req.params.id,
      schoolId: req.user._id
    });

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    salary.status = status;
    if (status === 'PAID') {
      salary.paidDate = new Date();
    }

    await salary.save();
    res.json(salary);
  } catch (error) {
    console.error('Update salary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete salary record
export const deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findOneAndDelete({
      _id: req.params.id,
      schoolId: req.user._id
    });

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.json({ message: 'Salary record deleted successfully' });
  } catch (error) {
    console.error('Delete salary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};