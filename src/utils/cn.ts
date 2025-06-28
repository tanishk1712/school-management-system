/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const getAnnouncementStyles = (type: string) => {
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


export const getCurrentMonth = () => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[new Date().getMonth()];
};

export const today = new Date();
export const currentDay = today.getDate();
export const currentMonth = today.getMonth(); // 0-indexed
export const currentYear = today.getFullYear();
export const holidays = [5, 15, 26]; // Example: add holiday dates here

export const toppers = [
  { name: 'Emma Johnson', grade: '10th', score: 98, avatar: '👩‍🎓', subject: 'Mathematics' },
  { name: 'Alex Chen', grade: '9th', score: 96, avatar: '👨‍🎓', subject: 'Science' },
  { name: 'Sofia Rodriguez', grade: '11th', score: 95, avatar: '👩‍🎓', subject: 'English' }
];

export const performanceData = [
  { month: 'Jan', score: 75 },
  { month: 'Feb', score: 80 },
  { month: 'Mar', score: 85 },
  { month: 'Apr', score: 82 },
  { month: 'May', score: 88 },
  { month: 'Jun', score: 92 }
];


export const getPlanBadgeColor = (plan: string) => {
  switch (plan) {
    case "Premium": return "bg-purple-500";
    case "Standard": return "bg-blue-500";
    case "Enterprise": return "bg-yellow-500";
    default: return "bg-transparent";
  }
};


export const monthlyFinancialData = [
  { month: 'Jan', income: 450000, expenses: 320000 },
  { month: 'Feb', income: 470000, expenses: 335000 },
  { month: 'Mar', income: 465000, expenses: 340000 },
  { month: 'Apr', income: 485000, expenses: 355000 },
  { month: 'May', income: 492000, expenses: 368000 },
  { month: 'Jun', income: 508000, expenses: 375000 }
];

export const sixMonthFinancialData = [
  { period: 'H1 2023', income: 2450000, expenses: 1820000 },
  { period: 'H2 2023', income: 2680000, expenses: 1950000 },
  { period: 'H1 2024', income: 2870000, expenses: 2093000 }
];

export const yearlyFinancialData = [
  { year: '2022', income: 4850000, expenses: 3650000 },
  { year: '2023', income: 5130000, expenses: 3770000 },
  { year: '2024', income: 5680000, expenses: 4186000 }
];

export const financialComparisons = {
  currentMonth: {
    income: 508000,
    expenses: 375000,
    profit: 133000
  },
  previousMonth: {
    income: 492000,
    expenses: 368000,
    profit: 124000
  },
  current6Months: {
    income: 2870000,
    expenses: 2093000,
    profit: 777000
  },
  previous6Months: {
    income: 2680000,
    expenses: 1950000,
    profit: 730000
  },
  currentYear: {
    income: 5680000,
    expenses: 4186000,
    profit: 1494000
  },
  previousYear: {
    income: 5130000,
    expenses: 3770000,
    profit: 1360000
  }
};

// Helper functions for calculations
export const calculatePercentageChange = (current: any, previous: any) => {
  return ((current - previous) / previous * 100).toFixed(1);
};

export const formatCurrency = (amount: any) => {
  return `₹${(amount / 1000).toFixed(0)}K`;
};
