import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['INFO', 'WARNING', 'URGENT'],
        default: 'INFO'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Announcement', AnnouncementSchema);