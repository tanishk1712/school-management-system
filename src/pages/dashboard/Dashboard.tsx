/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Users, UserRound, CalendarCheck, Clock, FileText, Calendar, Bell, Info, AlertTriangle, AlertCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../services/authService';

type CountData = {
  exams: number;
  students: number;
  teachers: number;
  timetable: number;
};

interface Activity {
  _id: string;
  schoolId: string;
  type: string;
  description: string;
  timestamp: string;
  __v: number;
}

interface Announcement {
  _id: string;
  schoolId: string;
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'URGENT';
  timestamp: string;
  __v: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const schoolID = localStorage.getItem("School ID");

  const [countData, setCountData] = useState<CountData>({
    exams: 0,
    students: 0,
    teachers: 0,
    timetable: 0
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'INFO' as 'INFO' | 'WARNING' | 'URGENT'
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchExams();
    fetchStudents();
    fetchTeachers();
    fetchTimetable();
    recentActivities();
    fetchAnnouncements();
  }, []);

  const recentActivities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/activities`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      setActivities(data);

    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/announcements`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }

      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newAnnouncement.title || !newAnnouncement.content) {
        toast.error('Please fill in all required fields');
        return;
      }

      const announcementData = {
        schoolId: schoolID,
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        type: newAnnouncement.type,
        timestamp: new Date()
      };

      const response = await fetch(`${BASE_URL}/api/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`,
        },
        credentials: 'include',
        body: JSON.stringify(announcementData),
      });

      if (!response.ok) {
        throw new Error('Failed to add announcement');
      }

      const savedAnnouncement = await response.json();
      setAnnouncements([...announcements, savedAnnouncement]);
      toast.success('Announcement added successfully');

      // Reset form and close modal
      setNewAnnouncement({
        title: '',
        content: '',
        type: 'INFO'
      });
      setShowAnnouncementModal(false);

    } catch (error) {
      console.error('Error adding announcement:', error);
      toast.error('Failed to add announcement');
    }
  };
  const handleDeleteAnnouncement = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`${BASE_URL}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete announcement');
      }

      setAnnouncements(announcements.filter((announcement: { _id: string; }) => announcement._id !== id));
      toast.success('Announcement deleted successfully');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    } finally {
      setIsDeleting(false);
    }
  };
  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'INFO':
        return <Info className="h-5 w-5 text-blue-400" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'URGENT':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };
  const getAnnouncementStyles = (type: string) => {
    switch (type) {
      case 'INFO':
        return {
          bg: 'bg-blue-50',
          border: 'border-l-4 border-blue-400',
          textColor: 'text-blue-800',
          contentColor: 'text-blue-700'
        };
      case 'WARNING':
        return {
          bg: 'bg-yellow-50',
          border: 'border-l-4 border-yellow-400',
          textColor: 'text-yellow-800',
          contentColor: 'text-yellow-700'
        };
      case 'URGENT':
        return {
          bg: 'bg-red-50',
          border: 'border-l-4 border-red-400',
          textColor: 'text-red-800',
          contentColor: 'text-red-700'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-l-4 border-blue-400',
          textColor: 'text-blue-800',
          contentColor: 'text-blue-700'
        };
    }
  };

  const fetchExams = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/exams`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch exams');
      }

      const data = await response.json();
      setCountData((prev: any) => ({
        ...prev,
        exams: data.length
      }));

    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('Failed to load exams');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/students`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setCountData((prev: any) => ({
        ...prev,
        students: data.length
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/teachers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch teachers');
      }

      const data = await response.json();
      setCountData((prev: any) => ({
        ...prev,
        teachers: data.length
      }));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    }
  };

  const fetchTimetable = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/timetables`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch time table');
      }

      const data = await response.json();
      setCountData((prev: any) => ({
        ...prev,
        timetable: data.length
      }));
    } catch (error) {
      console.error('Error fetching time table:', error);
      toast.error('Failed to load timetable');
    }
  };
  const statCards = [
    {
      name: 'Teachers',
      icon: Users,
      count: countData?.teachers,
      link: '/teachers',
      bgColor: 'bg-primary-100',
      iconColor: 'text-primary-600'
    },
    {
      name: 'Students',
      icon: UserRound,
      count: countData?.students,
      link: '/students',
      bgColor: 'bg-secondary-100',
      iconColor: 'text-secondary-600'
    },
    {
      name: 'Exams',
      icon: CalendarCheck,
      count: countData?.exams,
      link: '/exams',
      bgColor: 'bg-accent-100',
      iconColor: 'text-accent-600'
    },
    {
      name: 'Timetables',
      icon: Clock,
      count: countData?.timetable,
      link: '/timetables',
      bgColor: 'bg-success-100',
      iconColor: 'text-success-600'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <p className="mt-1 text-gray-500">
          Learn  how to launch faster <br />
          watch our webinar for tips from our experts and get a limited time offer.
        </p>
        <div><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.0183 24.5C15.8135 24.8539 15.5191 25.1477 15.1649 25.352C14.8106 25.5562 14.4089 25.6637 14 25.6637C13.5911 25.6637 13.1894 25.5562 12.8351 25.352C12.4809 25.1477 12.1865 24.8539 11.9817 24.5M21.1563 12.8334C21.8342 19.1042 24.5 21 24.5 21H3.5C3.5 21 7 18.5115 7 9.80004C7 7.82021 7.73733 5.92087 9.04983 4.52087C10.3635 3.12087 12.145 2.33337 14 2.33337C14.3932 2.33337 14.784 2.36837 15.1667 2.43837L21.1563 12.8334ZM22.1667 9.33337C23.0949 9.33337 23.9852 8.96462 24.6415 8.30825C25.2979 7.65187 25.6667 6.76163 25.6667 5.83337C25.6667 4.90512 25.2979 4.01488 24.6415 3.3585C23.9852 2.70212 23.0949 2.33337 22.1667 2.33337C21.2384 2.33337 20.3482 2.70212 19.6918 3.3585C19.0354 4.01488 18.6667 4.90512 18.6667 5.83337C18.6667 6.76163 19.0354 7.65187 19.6918 8.30825C20.3482 8.96462 21.2384 9.33337 22.1667 9.33337Z" stroke="#282828" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <ellipse cx="6.3" cy="6.3" rx="6.3" ry="6.3" transform="matrix(-1 0 0 1 26.6001 0)" fill="#2D88D4" />
        </svg>
        </div>
      </div>
      <div className='w-full '>
        <h2 className="mt-6 text-left text-3xl font-extrabold text-gray-700">
          Welcome to your dashboard, {user?.adminName}
        </h2>
      </div>
      <div className='bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 my-6'>
        <div className='flex justify-between p-8 items-center '>
          <div className='flex justify-start gap-6 items-start'>
            <div className='mt-[8px]'>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="8" fill="#EFF3FA" />
                <path d="M18 8C15.38 8 13.25 10.13 13.25 12.75C13.25 15.32 15.26 17.4 17.88 17.49C17.96 17.48 18.04 17.48 18.1 17.49C18.12 17.49 18.13 17.49 18.15 17.49C18.16 17.49 18.16 17.49 18.17 17.49C20.73 17.4 22.74 15.32 22.75 12.75C22.75 10.13 20.62 8 18 8Z" fill="#13296A" />
                <path d="M23.08 20.15C20.29 18.29 15.74 18.29 12.93 20.15C11.66 21 10.96 22.15 10.96 23.38C10.96 24.61 11.66 25.75 12.92 26.59C14.32 27.53 16.16 28 18 28C19.84 28 21.68 27.53 23.08 26.59C24.34 25.74 25.04 24.6 25.04 23.36C25.03 22.13 24.34 20.99 23.08 20.15ZM20 24.13H18.75V25.38C18.75 25.79 18.41 26.13 18 26.13C17.59 26.13 17.25 25.79 17.25 25.38V24.13H16C15.59 24.13 15.25 23.79 15.25 23.38C15.25 22.97 15.59 22.63 16 22.63H17.25V21.38C17.25 20.97 17.59 20.63 18 20.63C18.41 20.63 18.75 20.97 18.75 21.38V22.63H20C20.41 22.63 20.75 22.97 20.75 23.38C20.75 23.79 20.41 24.13 20 24.13Z" fill="#13296A" />
              </svg>
            </div>
            <div className='flex flex-col justify-start items-start'>
              <h1 className='font-medium text-gray-500 text-[30px]'>
                Add other admins
              </h1>
              <p className='font-medium text-gray-500 text-[18px]'>
                Create rich course content and coaching products for your students. <br />
                When you give them a pricing plan, they’ll appear on your site!
              </p>
            </div>
          </div>
          <button className='border p-3 rounded-lg text-gray-500 hover:bg-[#152259] hover:text-gray-200'>Add Admin</button>
        </div>
        <hr />
        <div className='flex justify-between p-8 items-center'>
          <div className='flex justify-start gap-6 items-start'>
            <div className='mt-[8px]'>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="8" fill="#EFF3FA" />
                <path d="M18.37 8.15003L27.37 11.75C27.72 11.89 28 12.31 28 12.68V16C28 16.55 27.55 17 27 17H9C8.45 17 8 16.55 8 16V12.68C8 12.31 8.28 11.89 8.63 11.75L17.63 8.15003C17.83 8.07003 18.17 8.07003 18.37 8.15003Z" stroke="#13296A" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M28 28H8V25C8 24.45 8.45 24 9 24H27C27.55 24 28 24.45 28 25V28Z" stroke="#13296A" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10 24V17" stroke="#13296A" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14 24V17" stroke="#13296A" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M18 24V17" stroke="#13296A" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M22 24V17" stroke="#13296A" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M26 24V17" stroke="#13296A" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7 28H29" stroke="#13296A" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            </div>
            <div className='flex flex-col justify-start items-start'>
              <h1 className='font-medium text-gray-500 text-[30px]'>
                Add classes
              </h1>
              <p className='font-medium text-gray-500 text-[18px]'>
                Create rich course content and coaching products for your students. <br />
                When you give them a pricing plan, they’ll appear on your site!
              </p>
            </div>
          </div>
          <button className='border p-3 rounded-lg text-gray-500 hover:bg-[#152259] hover:text-gray-200'>Add Classes</button>
        </div>
        <hr />
        <div className='flex justify-between p-8 items-center'>
          <div className='flex justify-start gap-6 items-start'>
            <div className='mt-[8px]'>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="8" fill="#EFF3FA" />
                <path d="M16.05 8.52997L10.03 12.46C8.10002 13.72 8.10002 16.54 10.03 17.8L16.05 21.73C17.13 22.44 18.91 22.44 19.99 21.73L25.98 17.8C27.9 16.54 27.9 13.73 25.98 12.47L19.99 8.53997C18.91 7.81997 17.13 7.81997 16.05 8.52997Z" stroke="#13296A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M11.6301 19.08L11.6201 23.77C11.6201 25.04 12.6001 26.4 13.8001 26.8L16.9901 27.86C17.5401 28.04 18.4501 28.04 19.0101 27.86L22.2001 26.8C23.4001 26.4 24.3801 25.04 24.3801 23.77V19.13" stroke="#13296A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M27.3999 21V15" stroke="#13296A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            </div>
            <div className='flex flex-col justify-start items-start'>
              <h1 className='font-medium text-gray-500 text-[30px]'>
                Add students
              </h1>
              <p className='font-medium text-gray-500 text-[18px]'>
                Create rich course content and coaching products for your students. <br />
                When you give them a pricing plan, they’ll appear on your site!
              </p>
            </div>
          </div>
          <button className='border p-3 rounded-lg text-gray-500 hover:bg-[#152259] hover:text-gray-200'>Add Students</button>
        </div>

      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.name}
            to={card.link}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex - shrink - 0 p - 3 rounded - md ${card.bgColor}`}>
                  <card.icon className={`h - 6 w - 6 ${card.iconColor}`} aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{card.count}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className={`bg - gray - 50 px - 5 py - 3`}>
              <div className="text-sm">
                <div className="font-medium text-primary-600 hover:text-primary-700">
                  View all
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activities and announcements */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-6 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activities</h3>
          </div>
          <div className="p-4 ">
            <div className="space-y-4 max-h-96 overflow-auto">
              {activities.length > 0 ? (
                activities.map((activity: any) => (
                  <div key={activity._id} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        {(activity.type === "STUDENT_CREATED" || activity.type === "STUDENT_UPDATED") && (
                          <UserRound className="h-5 w-5 text-primary-600" />
                        )}
                        {(activity.type === "TEACHER_CREATED" || activity.type === "TEACHER_UPDATED") && (
                          <Users className="h-5 w-5 text-primary-600" />
                        )}
                        {(activity.type === "EXAM_CREATED" || activity.type === "EXAM_UPDATED") && (
                          <FileText className="h-5 w-5 text-primary-600" />
                        )}
                        {(activity.type === "TIMETABLE_CREATED" || activity.type === "TIMETABLE_UPDATED" || activity.type === "TIMETABLE_ENTRY_ADDED") && (
                          <Calendar className="h-5 w-5 text-primary-600" />
                        )}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                      <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
                      <p className="mt-1 text-xs text-gray-400">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activities</p>
              )}
            </div>
            <div className="mt-6">
              <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                View all activities
              </a>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Announcements</h3>
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Bell className="h-4 w-4 mr-1" /> Add Announcement
            </button>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-auto">
                {announcements.length > 0 ? (
                  announcements.map((announcement: any) => {
                    const styles = getAnnouncementStyles(announcement.type);
                    return (
                      <div key={announcement._id} className={`${styles.bg} ${styles.border} p - 4 relative`}>
                        <div className="flex">
                          <div className="flex-shrink-0">
                            {getAnnouncementIcon(announcement.type)}
                          </div>
                          <div className="ml-3 flex-1 pr-8">
                            <h3 className={`text - sm font - medium ${styles.textColor}`}>{announcement.title}</h3>
                            <div className={`mt - 2 text - sm ${styles.contentColor}`}>
                              <p>{announcement.content}</p>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">{formatDate(announcement.timestamp)}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteAnnouncement(announcement._id)}
                            disabled={isDeleting}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 focus:outline-none"
                            title="Delete announcement"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">No announcements</p>
                )}
              </div>
            )}

            {announcements.length > 5 && (
              <div className="mt-6">
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  View all announcements
                </a>
              </div>
            )}
          </div>

          {/* Announcement Modal */}
          {showAnnouncementModal && (
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <form onSubmit={handleAddAnnouncement}>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Announcement</h3>

                      <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          id="title"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                          id="content"
                          rows={4}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={newAnnouncement.content}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                          required
                        ></textarea>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          id="type"
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={newAnnouncement.type}
                          onChange={(e) => setNewAnnouncement({
                            ...newAnnouncement,
                            type: e.target.value as 'INFO' | 'WARNING' | 'URGENT'
                          })}
                        >
                          <option value="INFO">Info</option>
                          <option value="WARNING">Warning</option>
                          <option value="URGENT">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setShowAnnouncementModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;