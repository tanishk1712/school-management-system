import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import School from '../models/School.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { adminName, schoolName, schoolEmail, password } = req.body;

        // Validate input
        if (!adminName || !schoolName || !schoolEmail || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if school name already exists
        const existingSchool = await School.findOne({
            $or: [
                { schoolName: schoolName },
                { schoolEmail: schoolEmail }
            ]
        });

        if (existingSchool) {
            if (existingSchool.schoolName === schoolName) {
                return res.status(400).json({ message: 'School name already exists' });
            }
            if (existingSchool.schoolEmail === schoolEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new school
        const newSchool = new School({
            adminName,
            schoolName,
            schoolEmail,
            password: hashedPassword
        });

        const savedSchool = await newSchool.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: savedSchool._id, schoolName: savedSchool.schoolName },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Send response without password
        const schoolData = savedSchool.toObject();
        delete schoolData.password;

        res.status(201).json(schoolData);
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { schoolName, password } = req.body;

        if (!schoolName || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const school = await School.findOne({ schoolName });

        if (!school) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, school.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: school._id, schoolName: school.schoolName },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000
        });

        // Send response without password
        const schoolData = school.toObject();
        delete schoolData.password;

        res.json(schoolData);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const school = await School.findById(req.user.id).select('-password');

        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        res.json(school);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;