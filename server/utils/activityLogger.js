import mongoose from 'mongoose';
import Activity from '../models/Activity.js';

export const createActivity = async (schoolId, type, description) => {
    try {
        // Convert to ObjectId if needed
        const schoolObjectId = mongoose.Types.ObjectId.isValid(schoolId)
            ? new mongoose.Types.ObjectId(schoolId)
            : schoolId;

        const activity = new Activity({
            schoolId: schoolObjectId,
            type,
            description,
            timestamp: new Date()
        });

        return await activity.save();
    } catch (error) {
        console.error('Error creating activity:', error);
        // Handle error as needed, but don't let it break the main functionality
    }
};