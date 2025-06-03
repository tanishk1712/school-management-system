import express from 'express';
import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/api/activities', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        // Convert string ID to MongoDB ObjectId if needed
        const schoolObjectId = mongoose.Types.ObjectId.isValid(schoolId)
            ? new mongoose.Types.ObjectId(schoolId)
            : schoolId;

        const activities = await Activity.find({ schoolId: schoolObjectId })
            .sort({ timestamp: -1 })
            .limit(20); // Get last 20 activities

        console.log('Retrieved activities:', activities);
        res.json(activities);
    } catch (error) {
        console.error('Get activities error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;