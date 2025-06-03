import mongoose from 'mongoose';

const SchoolSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true
    },
    schoolName: {
        type: String,
        required: true,
        unique: true
    },
    schoolEmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('School', SchoolSchema);
