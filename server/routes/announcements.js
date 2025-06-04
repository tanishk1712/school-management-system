import express from 'express';
import mongoose from 'mongoose';
import Announcement from '../models/Announcement.js';
import Activity from '../models/Activity.js';
import { authenticateToken } from '../middleware/auth.js';
import { createActivity } from '../utils/activityLogger.js';
import { ACTIVITY_TYPES } from '../utils/activityTypes.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        // Convert string ID to MongoDB ObjectId if needed
        const schoolObjectId = mongoose.Types.ObjectId.isValid(schoolId)
            ? new mongoose.Types.ObjectId(schoolId)
            : schoolId;

        const announcements = await Announcement.find({ schoolId: schoolObjectId })
            .sort({ timestamp: -1 });

        console.log('Retrieved announcements:', announcements);
        res.json(announcements);
    } catch (error) {
        console.error('Get announcements error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const { title, content, type = 'INFO' } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        // Convert string ID to MongoDB ObjectId if needed
        const schoolObjectId = mongoose.Types.ObjectId.isValid(schoolId)
            ? new mongoose.Types.ObjectId(schoolId)
            : schoolId;

        const newAnnouncement = new Announcement({
            schoolId: schoolObjectId,
            title,
            content,
            type, // INFO, WARNING, or URGENT
            timestamp: new Date()
        });

        const savedAnnouncement = await newAnnouncement.save();

        // Use the activity logger utility (removes duplicate activity creation)
        await createActivity(
            schoolId,
            ACTIVITY_TYPES.ANNOUNCEMENT_CREATED,
            `New announcement: ${newAnnouncement.title}`
        );

        res.status(201).json(savedAnnouncement);
    } catch (error) {
        console.error('Create announcement error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const announcementId = req.params.id;

        // Convert IDs to MongoDB ObjectIds if needed
        const schoolObjectId = mongoose.Types.ObjectId.isValid(schoolId)
            ? new mongoose.Types.ObjectId(schoolId)
            : schoolId;

        const announcementObjectId = mongoose.Types.ObjectId.isValid(announcementId)
            ? new mongoose.Types.ObjectId(announcementId)
            : announcementId;

        // Find announcement
        const announcement = await Announcement.findOne({
            _id: announcementObjectId,
            schoolId: schoolObjectId
        });

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        // Remove announcement
        await Announcement.deleteOne({ _id: announcementObjectId });

        // Use the activity logger utility for consistency
        await createActivity(
            schoolId,
            ACTIVITY_TYPES.ANNOUNCEMENT_DELETED,
            `Announcement removed: ${announcement.title}`
        );

        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('Delete announcement error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;