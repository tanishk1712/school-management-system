import express from 'express';
import Exam from '../models/Exam.js';
import { authenticateToken } from '../middleware/auth.js';
import { createActivity } from '../utils/activityLogger.js';
import { ACTIVITY_TYPES } from '../utils/activityTypes.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const exams = await Exam.find({ schoolId });
        res.json(exams);
    } catch (error) {
        console.error('Get exams error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const {
            name, subject, class: examClass, section,
            date, startTime, endTime, totalMarks
        } = req.body;

        // Validate input
        if (!name || !subject || !examClass || !section || !date || !startTime || !endTime) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Create new exam
        const newExam = new Exam({
            schoolId,
            name,
            subject,
            class: examClass,
            section,
            date: new Date(date),
            startTime,
            endTime,
            totalMarks: totalMarks || 100
        });

        const savedExam = await newExam.save();

        // Log activity
        await createActivity(
            schoolId,
            ACTIVITY_TYPES.EXAM_CREATED,
            `${name} exam has been scheduled for ${examClass} (Section ${section}) - ${subject}`
        );

        res.status(201).json(savedExam);
    } catch (error) {
        console.error('Create exam error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const examId = req.params.id;
        const {
            name, subject, class: examClass, section,
            date, startTime, endTime, totalMarks
        } = req.body;

        // Find exam
        const exam = await Exam.findOne({ _id: examId, schoolId });

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Update exam
        if (name) exam.name = name;
        if (subject) exam.subject = subject;
        if (examClass) exam.class = examClass;
        if (section) exam.section = section;
        if (date) exam.date = new Date(date);
        if (startTime) exam.startTime = startTime;
        if (endTime) exam.endTime = endTime;
        if (totalMarks !== undefined) exam.totalMarks = totalMarks;
        exam.updatedAt = new Date();

        const updatedExam = await exam.save();

        await createActivity(
            schoolId,
            ACTIVITY_TYPES.EXAM_UPDATED,
            `${updatedExam.name} exam details have been updated for ${updatedExam.class} (Section ${updatedExam.section})`
        );

        res.json(updatedExam);
    } catch (error) {
        console.error('Update exam error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const examId = req.params.id;

        // Find exam first to get details for activity logging
        const exam = await Exam.findOne({ _id: examId, schoolId });

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Remove exam
        const result = await Exam.deleteOne({ _id: examId, schoolId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        await createActivity(
            schoolId,
            ACTIVITY_TYPES.EXAM_DELETED,
            `${exam.name} exam for ${exam.class} (Section ${exam.section}) has been cancelled`
        );

        res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
        console.error('Delete exam error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;