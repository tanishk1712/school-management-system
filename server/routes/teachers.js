import express from 'express';
import Teacher from '../models/Teasher.js';
import { authenticateToken } from '../middleware/auth.js';
import { createActivity } from '../utils/activityLogger.js';
import { ACTIVITY_TYPES } from '../utils/activityTypes.js';
import { sendWelcomeEmail } from '../config/email.js';

const router = express.Router();

router.get('/api/teachers', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const teachers = await Teacher.find({ schoolId });
        res.json(teachers);
    } catch (error) {
        console.error('Get teachers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/api/teachers', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const { name, email, phone, subject, qualification, joinDate } = req.body;

        // Validate input
        if (!name || !email || !subject) {
            return res.status(400).json({ message: 'Name, email, and subject are required' });
        }

        // Create new teacher
        const newTeacher = new Teacher({
            schoolId,
            name,
            email,
            phone: phone || '',
            subject,
            qualification: qualification || '',
            joinDate: joinDate ? new Date(joinDate) : new Date()
        });

        const savedTeacher = await newTeacher.save();

        // Log activity
        await createActivity(
            schoolId,
            ACTIVITY_TYPES.TEACHER_CREATED,
            `New teacher added: ${name} (${subject})`
        );

        // Send welcome email using the utility function
        try {
            await sendWelcomeEmail(email, name, 'Teacher', ` for ${subject}`);
        } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
            // Don't fail the request if email fails
        }

        res.status(201).json(savedTeacher);

    } catch (error) {
        console.error('Create teacher error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/api/teachers/:id', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const teacherId = req.params.id;
        const { name, email, phone, subject, qualification, joinDate } = req.body;

        // Find teacher
        const teacher = await Teacher.findOne({ _id: teacherId, schoolId });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Update teacher
        if (name) teacher.name = name;
        if (email) teacher.email = email;
        if (phone !== undefined) teacher.phone = phone;
        if (subject) teacher.subject = subject;
        if (qualification !== undefined) teacher.qualification = qualification;
        if (joinDate) teacher.joinDate = new Date(joinDate);
        teacher.updatedAt = new Date();

        const updatedTeacher = await teacher.save();

        await createActivity(
            schoolId,
            ACTIVITY_TYPES.TEACHER_UPDATED,
            `${updatedTeacher.name} details were recently updated.`
        );

        res.json(updatedTeacher);
    } catch (error) {
        console.error('Update teacher error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/api/teachers/:id', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const teacherId = req.params.id;

        // Find teacher first to get the name for activity logging
        const teacher = await Teacher.findOne({ _id: teacherId, schoolId });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Remove teacher
        const result = await Teacher.deleteOne({ _id: teacherId, schoolId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        await createActivity(
            schoolId,
            ACTIVITY_TYPES.TEACHER_DELETED,
            `${teacher.name} profile was deleted.`
        );

        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error('Delete teacher error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;