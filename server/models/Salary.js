import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID'],
    default: 'PENDING'
  },
  paidDate: {
    type: Date
  },
  bonusAmount: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Salary = mongoose.model('Salary', salarySchema);
export default Salary;