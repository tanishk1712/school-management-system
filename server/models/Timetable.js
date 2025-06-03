import mongoose from 'mongoose';

const TimetableEntrySchema = new mongoose.Schema({
    day: {
        type: String,
        required: true
    },
    slotId: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    teacher: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TimetableSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    effectiveFrom: {
        type: Date,
        required: true
    },
    entries: [TimetableEntrySchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

export default mongoose.model('Timetable', TimetableSchema);