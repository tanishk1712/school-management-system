import express from 'express';
import Student from '../models/Students.js';
import { authenticateToken } from '../middleware/auth.js';
import { createActivity } from '../utils/activityLogger.js';
import { ACTIVITY_TYPES } from '../utils/activityTypes.js';
import { sendWelcomeEmail } from '../config/email.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const students = await Student.find({ schoolId });
        res.json(students);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const {
            name, rollNumber, class: studentClass, section,
            parentName, email, phone, address, admissionDate
        } = req.body;

        // Validate input
        if (!name || !rollNumber || !studentClass || !section) {
            return res.status(400).json({ message: 'Name, roll number, class, and section are required' });
        }

        // Create new student
        const newStudent = new Student({
            schoolId,
            name,
            rollNumber,
            class: studentClass,
            section,
            parentName: parentName || '',
            email: email || '',
            phone: phone || '',
            address: address || '',
            admissionDate: admissionDate ? new Date(admissionDate) : new Date()
        });

        const savedStudent = await newStudent.save();

        // Log activity
        await createActivity(
            schoolId,
            ACTIVITY_TYPES.STUDENT_CREATED,
            `${name} has been added to ${studentClass} (Section ${section})`
        );

        // Send welcome email if email is provided
        if (email) {
            try {
                await sendWelcomeEmail(
                    email,
                    name,
                    'Student',
                    ` to ${studentClass} class (Section ${section})`
                );
            } catch (emailError) {
                console.error('Error sending welcome email:', emailError);
                // Don't fail the request if email fails
            }
        }

        res.status(201).json(savedStudent);
    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const studentId = req.params.id;
        const {
            name, rollNumber, class: studentClass, section,
            parentName, email, phone, address, admissionDate
        } = req.body;

        // Find student
        const student = await Student.findOne({ _id: studentId, schoolId });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update student
        if (name) student.name = name;
        if (rollNumber) student.rollNumber = rollNumber;
        if (studentClass) student.class = studentClass;
        if (section) student.section = section;
        if (parentName !== undefined) student.parentName = parentName;
        if (email !== undefined) student.email = email;
        if (phone !== undefined) student.phone = phone;
        if (address !== undefined) student.address = address;
        if (admissionDate) student.admissionDate = new Date(admissionDate);
        student.updatedAt = new Date();

        const updatedStudent = await student.save();

        await createActivity(
            schoolId,
            ACTIVITY_TYPES.STUDENT_UPDATED,
            `${updatedStudent.name} details were recently updated.`
        );

        res.json(updatedStudent);
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const schoolId = req.user.id;
        const studentId = req.params.id;

        // Find student first to get the name for activity logging
        const student = await Student.findOne({ _id: studentId, schoolId });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Remove student
        const result = await Student.deleteOne({ _id: studentId, schoolId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await createActivity(
            schoolId,
            ACTIVITY_TYPES.STUDENT_DELETED,
            `${student.name} profile was deleted.`
        );

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;