import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/auth.js';
import teacherRoutes from './routes/teachers.js';
import studentRoutes from './routes/students.js';
import examRoutes from './routes/exams.js';
import timetableRoutes from './routes/timetables.js';
import activityRoutes from './routes/activities.js';
import announcementRoutes from './routes/announcements.js';
import feeRoutes from './routes/feeRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes - Remove /api prefix from here since it's in the route files
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/fees', feeRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.get('/', (req, res) => {
    res.send('Welcome to the School Management System API');
});

// 404 handler - This should be the last middleware
app.use((req, res) => {
    console.log(`Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: 'Route not found' });
});

export default app;