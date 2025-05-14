import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-management';

// mongoose.connect(MONGODB_URI)
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.error('MongoDB connection error:', err));

const MONGODB_URI = process.env.MONGODB_URI;

const ConnectDB = () => {
  return mongoose.connect(MONGODB_URI)
}

// Define Mongoose Schemas
const SchoolSchema = new mongoose.Schema({
  adminName: { type: String, required: true },
  schoolName: { type: String, required: true, unique: true },
  schoolEmail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TeacherSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  qualification: { type: String },
  joinDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const StudentSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  parentName: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  admissionDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const ExamSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  totalMarks: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const TimetableEntrySchema = new mongoose.Schema({
  day: { type: String, required: true },
  slotId: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TimetableSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  effectiveFrom: { type: Date, required: true },
  entries: [TimetableEntrySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const ActivitySchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const AnnouncementSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['INFO', 'WARNING', 'URGENT'], default: 'INFO' },
  timestamp: { type: Date, default: Date.now }
});

// Create models
const School = mongoose.model('School', SchoolSchema);
const Teacher = mongoose.model('Teacher', TeacherSchema);
const Student = mongoose.model('Student', StudentSchema);
const Exam = mongoose.model('Exam', ExamSchema);
const Timetable = mongoose.model('Timetable', TimetableSchema);
const Activity = mongoose.model('Activity', ActivitySchema);
const Announcement = mongoose.model('Announcement', AnnouncementSchema);

const ACTIVITY_TYPES = {
  // User activities
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  
  // Teacher activities
  TEACHER_CREATED: 'TEACHER_CREATED',
  TEACHER_UPDATED: 'TEACHER_UPDATED',
  TEACHER_DELETED: 'TEACHER_DELETED',
  
  // Student activities
  STUDENT_CREATED: 'STUDENT_CREATED',
  STUDENT_UPDATED: 'STUDENT_UPDATED',
  STUDENT_DELETED: 'STUDENT_DELETED',
  
  // Exam activities
  EXAM_CREATED: 'EXAM_CREATED',
  EXAM_UPDATED: 'EXAM_UPDATED',
  EXAM_DELETED: 'EXAM_DELETED',
  
  // Timetable activities
  TIMETABLE_CREATED: 'TIMETABLE_CREATED',
  TIMETABLE_UPDATED: 'TIMETABLE_UPDATED',
  TIMETABLE_DELETED: 'TIMETABLE_DELETED',
  TIMETABLE_ENTRY_ADDED: 'TIMETABLE_ENTRY_ADDED',
  TIMETABLE_ENTRY_REMOVED: 'TIMETABLE_ENTRY_REMOVED',
  
  // Announcement activities
  ANNOUNCEMENT_CREATED: 'ANNOUNCEMENT_CREATED',
  ANNOUNCEMENT_REMOVED: 'ANNOUNCEMENT_REMOVED'
};

const createActivity = async (schoolId, type, description) => {
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



// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use an environment variable

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
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

app.post('/api/auth/login', async (req, res) => {
  try {
    const { schoolName, password } = req.body;
    
    // Validate input
    if (!schoolName || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Find school
    const school = await School.findOne({ schoolName });
    
    if (!school) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
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
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
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

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
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

// Teacher Routes
app.get('/api/teachers', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.id;
    const teachers = await Teacher.find({ schoolId });
    res.json(teachers);
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/teachers', authenticateToken, async (req, res) => {
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

    await createActivity(
      schoolId,
      ACTIVITY_TYPES.TEACHER_CREATED,
      `New teacher added: ${name} (${subject})`
    );

    res.status(201).json(savedTeacher);
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/teachers/:id', authenticateToken, async (req, res) => {
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
      `${name} details were recently updated.`
    );

    res.json(updatedTeacher);
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/teachers/:id', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.id;
    const teacherId = req.params.id;
    
    // Find and remove teacher
    const result = await Teacher.deleteOne({ _id: teacherId, schoolId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await createActivity(
      schoolId,
      ACTIVITY_TYPES.TEACHER_DELETED,
      `${name} profile was deleted.`
    );
    
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Student Routes
app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.id;
    const students = await Student.find({ schoolId });
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/students', authenticateToken, async (req, res) => {
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

    await createActivity(
      schoolId,
      ACTIVITY_TYPES.STUDENT_CREATED,
      `${name} has been added to (${studentClass}`
    );

    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/students/:id', authenticateToken, async (req, res) => {
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
      `${name} details were recently updated.`
    );
    

    res.json(updatedStudent);
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.id;
    const studentId = req.params.id;
    
    // Find and remove student
    const result = await Student.deleteOne({ _id: studentId, schoolId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Exam Routes
app.get('/api/exams', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.id;
    const exams = await Exam.find({ schoolId });
    res.json(exams);
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/exams', authenticateToken, async (req, res) => {
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
    await createActivity(
      schoolId,
      ACTIVITY_TYPES.EXAM_CREATED,
      `${name} exam has been added to (${examClass}`
    );
    res.status(201).json(savedExam);
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/exams/:id', authenticateToken, async (req, res) => {
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
      `${name} exam has been updated to (${examClass}`
    );
    res.json(updatedExam);
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/exams/:id', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.id;
    const examId = req.params.id;
    
    // Find and remove exam
    const result = await Exam.deleteOne({ _id: examId, schoolId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Timetable Routes
app.get('/api/timetables', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.id;
    const timetables = await Timetable.find({ schoolId });
    res.json(timetables);
  } catch (error) {
    console.error('Get timetables error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/timetables', authenticateToken, async (req, res) => {
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
      `New Time table (${name}) has been added to ${timetableClass}`
    );

    res.status(201).json(savedTimetable);
  } catch (error) {
    console.error('Create timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/timetables/:id', authenticateToken, async (req, res) => {
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
      `Time table (${name}) has been updated to ${timetableClass}`
    );

    res.json(updatedTimetable);
  } catch (error) {
    console.error('Update timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/timetables/:id', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.id;
    const timetableId = req.params.id;
    
    // Find and remove timetable
    const result = await Timetable.deleteOne({ _id: timetableId, schoolId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    
    res.json({ message: 'Timetable deleted successfully' });
  } catch (error) {
    console.error('Delete timetable error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Timetable entries
app.get('/api/timetables/:id/entries', authenticateToken, async (req, res) => {
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

app.post('/api/timetables/:id/entries', authenticateToken, async (req, res) => {
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
      `New Time table entrie (${newEntry.subject}). Teacher ${newEntry.teacher}`
    );
    
    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Add timetable entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/timetables/:timetableId/entries/:entryId', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.user.id;
    const { timetableId, entryId } = req.params;
    
    // Find timetable
    const timetable = await Timetable.findOne({ _id: timetableId, schoolId });
    
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    
    // Find entry index
    const entryIndex = timetable.entries.findIndex(
      e => e._id.toString() === entryId
    );
    
    if (entryIndex === -1) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    
    // Remove entry
    timetable.entries.splice(entryIndex, 1);
    await timetable.save();
    
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Delete timetable entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/activities', authenticateToken, async (req, res) => {
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

// Replace the existing Announcements API with these:
app.get('/api/announcements', authenticateToken, async (req, res) => {
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

app.post('/api/announcements', authenticateToken, async (req, res) => {
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

    // Add activity
    const activity = new Activity({
      schoolId: schoolObjectId,
      type: 'ANNOUNCEMENT_CREATED',
      description: `New announcement: ${title}`,
      timestamp: new Date()
    });
    await activity.save();

    await createActivity(
      schoolId,
      ACTIVITY_TYPES.ANNOUNCEMENT_CREATED,
      `New announcement ${newAnnouncement.title}`
    );

    res.status(201).json(savedAnnouncement);
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/announcements/:id', authenticateToken, async (req, res) => {
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

    // Add activity
    const activity = new Activity({
      schoolId: schoolObjectId,
      type: 'ANNOUNCEMENT_REMOVED',
      description: `Announcement removed: ${announcement.title}`,
      timestamp: new Date()
    });
    await activity.save();

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const start = async() => {
  await ConnectDB()
  console.log("DB connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();