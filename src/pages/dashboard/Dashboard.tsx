/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../hooks/useAuth';
import { Calendar, Award, Star, TrendingUp, DollarSign, } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, } from 'recharts';
import SchoolLogo from '../../assets/schoolLogo.png'
// import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../services/authService';
import RecentActivities from '../../pop-up/RecentActivities';
import Announcements from '../../pop-up/Announcements';
import { calculatePercentageChange, currentDay, currentMonth, currentYear, financialComparisons, formatCurrency, formatDate, getCurrentMonth, getPlanBadgeColor, holidays, monthlyFinancialData, performanceData, sixMonthFinancialData, toppers, yearlyFinancialData } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';
import DashboardSkeleton from '../../Skeleton/DashboardSkeleton';

type CountData = {
  exams: number;
  students: number;
  teachers: number;
  timetable: number;
};

const Dashboard = () => {
  const { user } = useAuth();
  console.log(user, 'user')
  const schoolID = localStorage.getItem("School ID");

  const [countData, setCountData] = useState<CountData>({
    exams: 0,
    students: 0,
    teachers: 0,
    timetable: 0
  });

  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [shimmerUI, setShimmerUI] = useState(true)

  // const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  // const [newAnnouncement, setNewAnnouncement] = useState({
  //   title: '',
  //   content: '',
  //   type: 'INFO' as 'INFO' | 'WARNING' | 'URGENT'
  // });

  useEffect(() => {
    fetchExams();
    fetchStudents();
    fetchTeachers();
    fetchTimetable();
  }, []);

  useEffect(() => {
    // Simulate 1-second loading
    const timer = setTimeout(() => setShimmerUI(false), 1000);
    return () => clearTimeout(timer);
  }, []);


  // const handleAddAnnouncement = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     if (!newAnnouncement.title || !newAnnouncement.content) {
  //       toast.error('Please fill in all required fields');
  //       return;
  //     }

  //     const announcementData = {
  //       schoolId: schoolID,
  //       title: newAnnouncement.title,
  //       content: newAnnouncement.content,
  //       type: newAnnouncement.type,
  //       timestamp: new Date()
  //     };

  //     const response = await fetch(`${BASE_URL}/api/announcements`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${schoolID}`,
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify(announcementData),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to add announcement');
  //     }

  //     const savedAnnouncement = await response.json();
  //     setAnnouncements([...announcements, savedAnnouncement]);
  //     toast.success('Announcement added successfully');

  //     // Reset form and close modal
  //     setNewAnnouncement({
  //       title: '',
  //       content: '',
  //       type: 'INFO'
  //     });
  //     setShowAnnouncementModal(false);

  //   } catch (error) {
  //     console.error('Error adding announcement:', error);
  //     toast.error('Failed to add announcement');
  //   }
  // };

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

  const getComparisonData = () => {
    switch (selectedPeriod) {
      case 'month':
        return {
          current: financialComparisons.currentMonth,
          previous: financialComparisons.previousMonth,
          label: 'This Month vs Last Month',
          chartData: monthlyFinancialData
        };
      case '6months':
        return {
          current: financialComparisons.current6Months,
          previous: financialComparisons.previous6Months,
          label: 'This 6 Months vs Previous 6 Months',
          chartData: sixMonthFinancialData
        };
      case 'year':
        return {
          current: financialComparisons.currentYear,
          previous: financialComparisons.previousYear,
          label: 'This Year vs Last Year',
          chartData: yearlyFinancialData
        };
      default:
        return {
          current: financialComparisons.currentMonth,
          previous: financialComparisons.previousMonth,
          label: 'This Month vs Last Month',
          chartData: monthlyFinancialData
        };
    }
  };

  const comparisonData = getComparisonData();



  if (shimmerUI) {
    return <DashboardSkeleton />;
  }


  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <p className="mt-1 text-gray-500">
          Learn  how to launch faster <br />
          watch our webinar for tips from our experts and get a limited time offer.
        </p>
        <div className='flex justify-between  gap-3'>
          <RecentActivities />
          <Announcements />
        </div>
      </div>
      {/* <div className='w-full mb-4 flex justify-between items-center '>
        <h2 className=" text-left text-3xl font-extrabold text-gray-700">
          Welcome to your dashboard, {user?.adminName}
        </h2>
        <button onClick={handleFeaturePopup} className='text-[#152259]' >{openFeatureModal ? <PanelTopClose /> : <PanelBottomClose />}</button>
      </div>

      {openFeatureModal && (
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
      )} */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Welcome Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-[#152259] to-purple-600 rounded-xl p-6 text-white">
          <div className='flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 flex-wrap'>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl shrink-0">
                <img src={SchoolLogo} alt='Logo' className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Welcome, {user?.schoolName}</h2>
                <p className="text-blue-100 mt-1 text-sm sm:text-base">
                  Excellence in Education Since {formatDate(user?.createdAt)}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-1 sm:gap-4 mt-3 text-sm">
                  <span className='whitespace-nowrap'>📍 123 Education Street</span>
                  <span className='whitespace-nowrap'>📞 (555) 123-4567</span>
                  <span className='whitespace-nowrap'>✉️ {user?.schoolEmail}</span>
                </div>
              </div>
            </div>

            <div className="sm:text-right w-full sm:w-auto">
              <div className="bg-white/10 px-4 py-2 rounded-lg text-sm inline-block w-full sm:w-auto">
                <div className="text-xl sm:text-2xl text-blue-100 whitespace-nowrap">Current Subscription Plan</div>
                <div className={`inline-block px-2 py-1 mt-2 rounded-full text-base sm:text-[20px] text-white ${getPlanBadgeColor('Basic')}`}>
                  Basic <span className="text-sm text-blue-200">No Expiry</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{countData?.teachers}</div>
              <div className="text-sm text-blue-100">Teachers</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{countData?.students}</div>
              <div className="text-sm text-blue-100">Students</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{countData?.exams}</div>
              <div className="text-sm text-blue-100">Exams</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{countData?.timetable}</div>
              <div className="text-sm text-blue-100">Timetables</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{getCurrentMonth()} {currentYear}</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="font-medium text-gray-500 p-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 5;
              const date = new Date(currentYear, currentMonth, day);
              const isToday = day === currentDay;
              const isHoliday = holidays.includes(day);
              const isSunday = date.getDay() === 0;

              const cellClass = day < 1 || day > 30
                ? 'text-gray-300'
                : isToday
                  ? 'bg-[#152259] text-white font-bold'
                  : isHoliday
                    ? 'bg-red-100 text-red-600 font-medium'
                    : isSunday
                      ? 'text-red-500 font-medium'
                      : 'text-gray-700 hover:bg-gray-100';

              return (
                <div key={i} className={`p-2 rounded-lg ${cellClass}`}>
                  {day > 0 && day <= 30 ? day : ''}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
          <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedPeriod === 'month'
                ? 'bg-[#152259] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPeriod('6months')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedPeriod === '6months'
                ? 'bg-[#152259] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedPeriod === 'year'
                ? 'bg-[#152259] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Period Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Income Comparison */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-gray-900">Income</h3>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${parseFloat(calculatePercentageChange(comparisonData.current.income, comparisonData.previous.income)) >= 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {parseFloat(calculatePercentageChange(comparisonData.current.income, comparisonData.previous.income)) >= 0 ? '+' : ''}
                {calculatePercentageChange(comparisonData.current.income, comparisonData.previous.income)}%
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current</span>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(comparisonData.current.income)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Previous</span>
                <span className="text-lg text-gray-600">{formatCurrency(comparisonData.previous.income)}</span>
              </div>
            </div>
          </div>

          {/* Expenses Comparison */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-red-600" />
                <h3 className="font-semibold text-gray-900">Expenses</h3>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${parseFloat(calculatePercentageChange(comparisonData.current.expenses, comparisonData.previous.expenses)) <= 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {parseFloat(calculatePercentageChange(comparisonData.current.expenses, comparisonData.previous.expenses)) >= 0 ? '+' : ''}
                {calculatePercentageChange(comparisonData.current.expenses, comparisonData.previous.expenses)}%
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current</span>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(comparisonData.current.expenses)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Previous</span>
                <span className="text-lg text-gray-600">{formatCurrency(comparisonData.previous.expenses)}</span>
              </div>
            </div>
          </div>

          {/* Profit Comparison */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Net Profit</h3>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${parseFloat(calculatePercentageChange(comparisonData.current.profit, comparisonData.previous.profit)) >= 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}>
                {parseFloat(calculatePercentageChange(comparisonData.current.profit, comparisonData.previous.profit)) >= 0 ? '+' : ''}
                {calculatePercentageChange(comparisonData.current.profit, comparisonData.previous.profit)}%
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current</span>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(comparisonData.current.profit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Previous</span>
                <span className="text-lg text-gray-600">{formatCurrency(comparisonData.previous.profit)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Academic Performance</h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">85%</span>
              <span className="text-green-600 text-sm">↑ 5%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-4">
            {toppers.map((student, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{student.avatar}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{student.name}</div>
                  <div className="text-sm text-gray-600">{student.grade} • {student.subject}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{student.score}%</div>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Announcements */}
      {/* <button
              onClick={() => setShowAnnouncementModal(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Bell className="h-4 w-4 mr-1" /> Add Announcement
            </button> */}

      {/* Announcement Modal */}
      {/* {showAnnouncementModal && (
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
          )} */}
    </div >
  );
};

export default Dashboard;