import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  adminName: {
    type: String,
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
    unique: true,
  },
  schoolEmail: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const School = mongoose.model('School', schoolSchema);

export default School;