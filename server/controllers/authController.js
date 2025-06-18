import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import School from '../models/School.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register School
export const registerSchool = async (req, res) => {
  try {
    const { adminName, schoolName, schoolEmail, password } = req.body;

    if (!adminName || !schoolName || !schoolEmail || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if school exists
    const schoolExists = await School.findOne({
      $or: [
        { schoolName },
        { schoolEmail }
      ]
    });

    if (schoolExists) {
      if (schoolExists.schoolName === schoolName) {
        return res.status(400).json({ message: 'School name already exists' });
      }
      if (schoolExists.schoolEmail === schoolEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create school
    const school = await School.create({
      adminName,
      schoolName,
      schoolEmail,
      password: hashedPassword,
    });

    if (school) {
      const token = generateToken(school._id);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        _id: school._id,
        adminName: school.adminName,
        schoolName: school.schoolName,
        schoolEmail: school.schoolEmail,
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login School
export const loginSchool = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find school by email
    const school = await School.findOne({ schoolEmail: email });

    if (!school) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, school.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(school._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.json({
      _id: school._id,
      adminName: school.adminName,
      schoolName: school.schoolName,
      schoolEmail: school.schoolEmail,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout School
export const logoutSchool = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully' });
};

// Get School Profile
export const getSchoolProfile = async (req, res) => {
  try {
    const school = await School.findById(req.user._id).select('-password');
    res.json(school);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};