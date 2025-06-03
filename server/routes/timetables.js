import express from 'express';
import mongoose from 'mongoose';
import Timetable from '../models/Timetable.js';
import { authenticateToken } from '../middleware/auth.js';
import { createActivity } from '../utils/activityLogger.js';
import { ACTIVITY_TYPES } from '../utils/activityTypes.js';

const router = express.Router();

// Timetable Routes
router.get('/api/timetables', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const timetables = await Timetable.find({ schoolId });
        res.json(timetables);
    } catch (error) {
        console.error('Get timetables error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/api/timetables', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const { name, class: timetableClass, section, effectiveFrom } = req.body;

        // Validate input
        if (!name || !timetableClass || !section || !effectiveFrom) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Create new timetable
        const newTimetable = new Timetable({
            schoolId,
            name,
            class: timetableClass,
            section,
            effectiveFrom: new Date(effectiveFrom),
            entries: []
        });

        const savedTimetable = await newTimetable.save();

        await createActivity(
            schoolId,
            ACTIVITY_TYPES.TIMETABLE_CREATED,
            `New timetable (${name}) has been created for ${timetableClass} (Section ${section})`
        );

        res.status(201).json(savedTimetable);
    } catch (error) {
        console.error('Create timetable error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/api/timetables/:id', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const timetableId = req.params.id;
        const { name, class: timetableClass, section, effectiveFrom } = req.body;

        // Find timetable
        const timetable = await Timetable.findOne({ _id: timetableId, schoolId });

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        // Update timetable
        if (name) timetable.name = name;
        if (timetableClass) timetable.class = timetableClass;
        if (section) timetable.section = section;
        if (effectiveFrom) timetable.effectiveFrom = new Date(effectiveFrom);
        timetable.updatedAt = new Date();

        const updatedTimetable = await timetable.save();

        await createActivity(
            schoolId,
            ACTIVITY_TYPES.TIMETABLE_UPDATED,
            `Timetable (${updatedTimetable.name}) has been updated for ${updatedTimetable.class} (Section ${updatedTimetable.section})`
        );

        res.json(updatedTimetable);
    } catch (error) {
        console.error('Update timetable error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/api/timetables/:id', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const timetableId = req.params.id;

        // Find timetable first to get details for activity logging
        const timetable = await Timetable.findOne({ _id: timetableId, schoolId });

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        // Remove timetable
        const result = await Timetable.deleteOne({ _id: timetableId, schoolId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        await createActivity(
            schoolId,
            ACTIVITY_TYPES.TIMETABLE_DELETED,
            `Timetable (${timetable.name}) for ${timetable.class} (Section ${timetable.section}) has been deleted`
        );

        res.json({ message: 'Timetable deleted successfully' });
    } catch (error) {
        console.error('Delete timetable error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Timetable entries
router.get('/api/timetables/:id/entries', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const timetableId = req.params.id;

        // Find timetable
        const timetable = await Timetable.findOne({ _id: timetableId, schoolId });

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        res.json(timetable.entries || []);
    } catch (error) {
        console.error('Get timetable entries error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/api/timetables/:id/entries', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const timetableId = req.params.id;
        const { day, slotId, subject, teacher } = req.body;

        // Validate input
        if (!day || !slotId || !subject || !teacher) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Find timetable
        const timetable = await Timetable.findOne({ _id: timetableId, schoolId });

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        // Check if slot is already occupied
        const isOccupied = timetable.entries.some(
            entry => entry.day === day && entry.slotId === slotId
        );

        if (isOccupied) {
            return res.status(400).json({ message: 'This time slot is already occupied' });
        }

        // Create new entry
        const newEntry = {
            _id: new mongoose.Types.ObjectId(),
            day,
            slotId,
            subject,
            teacher
        };

        // Add entry
        timetable.entries.push(newEntry);
        await timetable.save();

        await createActivity(
            schoolId,
            ACTIVITY_TYPES.TIMETABLE_ENTRY_ADDED,
            `New timetable entry added: ${subject} (${teacher}) on ${day}`
        );

        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Add timetable entry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/api/timetables/:timetableId/entries/:entryId', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const { timetableId, entryId } = req.params;

        // Find timetable
        const timetable = await Timetable.findOne({ _id: timetableId, schoolId });

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        // Find entry for logging before deletion
        const entryToDelete = timetable.entries.find(
            e => e._id.toString() === entryId
        );

        if (!entryToDelete) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Find entry index
        const entryIndex = timetable.entries.findIndex(
            e => e._id.toString() === entryId
        );

        // Remove entry
        timetable.entries.splice(entryIndex, 1);
        await timetable.save();

        await createActivity(
            schoolId,
            ACTIVITY_TYPES.TIMETABLE_ENTRY_DELETED,
            `Timetable entry removed: ${entryToDelete.subject} (${entryToDelete.teacher}) on ${entryToDelete.day}`
        );

        res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Delete timetable entry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;