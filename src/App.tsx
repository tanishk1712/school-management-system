import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import Teachers from './pages/dashboard/Teachers';
import Students from './pages/dashboard/Students';
import Exams from './pages/dashboard/Exams';
import Timetables from './pages/dashboard/Timetables';
import Settings from './pages/dashboard/Settings';
// import Chat from './pages/dashboard/Chat';
import ResetPassword from './pages/auth/ResetPassword';
import LandingPage from './pages/LandingPage';
import SchoolFee from './pages/dashboard/SchoolFeeUI';
import UnderDevelopment from './pages/dashboard/UnderDevelopment';


// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Public Route Component (accessible only when not logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/" element={<PublicRoute><AuthLayout /></PublicRoute>}>
        <Route index element={<Navigate to="/login" />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="students" element={<Students />} />
        <Route path="exams" element={<Exams />} />
        <Route path="timetables" element={<Timetables />} />
        <Route path="settings" element={<Settings />} />
        {/* <Route path="chat" element={<Chat />} /> */}
        <Route path="fees" element={<SchoolFee />} />





        {/* Under Development Route  */}

        <Route path="analytics" element={<UnderDevelopment moduleName='Analytics' />} />
        <Route path="reports" element={<UnderDevelopment moduleName='Reports' />} />
        <Route path="classes" element={<UnderDevelopment moduleName='Classes & Sections' />} />
        <Route path="subjects" element={<UnderDevelopment moduleName='Subjects' />} />
        <Route path="curriculum" element={<UnderDevelopment moduleName='Curriculum' />} />
        <Route path="admissions" element={<UnderDevelopment moduleName='Admissions' />} />
        <Route path="alumni" element={<UnderDevelopment moduleName='Alumni' />} />
        <Route path="question-bank" element={<UnderDevelopment moduleName='Question Bank' />} />
        <Route path="results" element={<UnderDevelopment moduleName='Result Management' />} />
        <Route path="grade-cards" element={<UnderDevelopment moduleName='Grade Cards' />} />
        <Route path="calendar" element={<UnderDevelopment moduleName='Calendar' />} />
        <Route path="attendance" element={<UnderDevelopment moduleName='Attendance' />} />
        <Route path="leave-management" element={<UnderDevelopment moduleName='Leave Management' />} />
        <Route path="financial-reports" element={<UnderDevelopment moduleName='Financial Reports' />} />
        <Route path="accounting" element={<UnderDevelopment moduleName='Accounting' />} />
        <Route path="budget" element={<UnderDevelopment moduleName='Budget Planning' />} />
        <Route path="messages" element={<UnderDevelopment moduleName='Messages' />} />
        <Route path="notifications" element={<UnderDevelopment moduleName='Notifications' />} />
        <Route path="announcements" element={<UnderDevelopment moduleName='Announcements' />} />
        <Route path="parent-portal" element={<UnderDevelopment moduleName='Parent Portal' />} />
        <Route path="campus" element={<UnderDevelopment moduleName='Campus Management' />} />
        <Route path="library" element={<UnderDevelopment moduleName='Library' />} />
        <Route path="transport" element={<UnderDevelopment moduleName='Transport' />} />
        <Route path="hostel" element={<UnderDevelopment moduleName='Hostel' />} />
        <Route path="cafeteria" element={<UnderDevelopment moduleName='cafeteria' />} />
        <Route path="medical" element={<UnderDevelopment moduleName='Medical Center' />} />
        <Route path="events" element={<UnderDevelopment moduleName='Events' />} />
        <Route path="user-management" element={<UnderDevelopment moduleName='SportUser Managements' />} />
        <Route path="roles" element={<UnderDevelopment moduleName='Roles & Permissions' />} />
        <Route path="security" element={<UnderDevelopment moduleName='Backup & Security' />} />

      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;