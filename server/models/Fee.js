import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['TUITION', 'TRANSPORT', 'LIBRARY', 'LABORATORY', 'SPORTS', 'OTHER']
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
    enum: ['PENDING', 'PAID', 'OVERDUE'],
    default: 'PENDING'
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Fee = mongoose.model('Fee', feeSchema);
export default Fee;