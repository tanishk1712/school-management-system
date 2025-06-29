import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserRound,
  CalendarCheck,
  Clock,
  Settings,
  Menu,
  X,
  LogOut,
  MessageSquare,
  ReceiptIndianRupee,
  BadgeIndianRupee,
  LineChart,
  Calendar,
  BookOpen,
  GraduationCap,
  Building,
  UserCheck,
  FileText,
  TrendingUp,
  Shield,
  Bell,
  ClipboardList,
  MapPin,
  Bus,
  Utensils,
  Heart,
  BookMarked,
  Trophy,
  Camera,
  Megaphone,
  UserCog,
  Archive,
  ChevronDown,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../utils/cn';
import schoolLogo from '../assets/schoolLogo.png';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavigationSection {
  name: string;
  items: NavigationItem[];
}

interface ExpandedSections {
  [key: string]: boolean;
}

interface User {
  schoolName?: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
}

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({});
  const { user, logout } = useAuth() as AuthContextType;
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate('/login');
  };

  const openSidebar = (): void => {
    setSidebarOpen(true);
  };

  const closeSidebar = (): void => {
    setSidebarOpen(false);
  };

  const toggleSection = (sectionName: string): void => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const navigationSections: NavigationSection[] = [
    {
      name: 'Overview',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', href: '/analytics', icon: TrendingUp },
        { name: 'Reports', href: '/reports', icon: FileText },
      ]
    },
    {
      name: 'Academic Management',
      items: [
        { name: 'Students', href: '/students', icon: UserRound },
        { name: 'Teachers', href: '/teachers', icon: Users },
        { name: 'Classes & Sections', href: '/classes', icon: Building },
        { name: 'Subjects', href: '/subjects', icon: BookOpen },
        { name: 'Curriculum', href: '/curriculum', icon: BookMarked },
        { name: 'Admissions', href: '/admissions', icon: UserCheck },
        { name: 'Alumni', href: '/alumni', icon: GraduationCap },
      ]
    },
    {
      name: 'Examination & Assessment',
      items: [
        { name: 'Exams', href: '/exams', icon: CalendarCheck },
        { name: 'Question Bank', href: '/question-bank', icon: ClipboardList },
        { name: 'Result Management', href: '/results', icon: Trophy },
        { name: 'Grade Cards', href: '/grade-cards', icon: FileText },
      ]
    },
    {
      name: 'Scheduling & Attendance',
      items: [
        { name: 'Timetables', href: '/timetables', icon: Clock },
        { name: 'Calendar', href: '/calendar', icon: Calendar },
        { name: 'Attendance', href: '/attendance', icon: UserCheck },
        { name: 'Leave Management', href: '/leave-management', icon: CalendarCheck },
      ]
    },
    {
      name: 'Financial Management',
      items: [
        { name: 'Fee Management', href: '/fees', icon: ReceiptIndianRupee },
        { name: 'Salary Management', href: '/salary', icon: BadgeIndianRupee },
        { name: 'Financial Reports', href: '/financial-reports', icon: LineChart },
        { name: 'Accounting', href: '/accounting', icon: Archive },
        { name: 'Budget Planning', href: '/budget', icon: TrendingUp },
      ]
    },
    {
      name: 'Communication',
      items: [
        { name: 'Messages', href: '/messages', icon: MessageSquare },
        { name: 'Notifications', href: '/notifications', icon: Bell },
        { name: 'Announcements', href: '/announcements', icon: Megaphone },
        { name: 'Parent Portal', href: '/parent-portal', icon: Users },
      ]
    },
    {
      name: 'Infrastructure & Resources',
      items: [
        { name: 'Campus Management', href: '/campus', icon: Building },
        { name: 'Library', href: '/library', icon: BookOpen },
        { name: 'Transport', href: '/transport', icon: Bus },
        { name: 'Hostel', href: '/hostel', icon: MapPin },
        { name: 'Cafeteria', href: '/cafeteria', icon: Utensils },
        { name: 'Medical Center', href: '/medical', icon: Heart },
      ]
    },
    {
      name: 'Events & Activities',
      items: [
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Sports', href: '/sports', icon: Trophy },
        { name: 'Gallery', href: '/gallery', icon: Camera },
        { name: 'Competitions', href: '/competitions', icon: Trophy },
      ]
    },
    {
      name: 'Administration',
      items: [
        { name: 'User Management', href: '/user-management', icon: UserCog },
        { name: 'Roles & Permissions', href: '/roles', icon: Shield },
        { name: 'System Settings', href: '/settings', icon: Settings },
        { name: 'Backup & Security', href: '/security', icon: Shield },
      ]
    }
  ];

  interface NavSectionProps {
    section: NavigationSection;
    isMobile?: boolean;
  }

  const NavSection: React.FC<NavSectionProps> = ({ section, isMobile = false }) => {
    const isExpanded = expandedSections[section.name];

    return (
      <div key={section.name} className="mb-2">
        <button
          onClick={() => toggleSection(section.name)}
          className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-primary-300 uppercase tracking-wider hover:text-white transition-colors"
        >
          <span>{section.name}</span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {isExpanded && (
          <div className="ml-2 space-y-1">
            {section.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  isActive
                    ? 'bg-primary-900 text-white border-r-2 border-white'
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white',
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150'
                )}
                onClick={() => isMobile && closeSidebar()}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 flex z-40 md:hidden transition-all duration-300 ease-in-out",
        sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}>
        {/* Background overlay */}
        <div
          className={cn(
            "fixed inset-0 bg-gray-600 transition-opacity duration-300 ease-in-out",
            sidebarOpen ? "bg-opacity-75" : "bg-opacity-0"
          )}
          onClick={closeSidebar}
        />

        {/* Sidebar */}
        <div className={cn(
          "relative flex-1 flex flex-col h-full w-full bg-[#152259] pt-5 pb-4 transition-transform duration-300 ease-in-out transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="absolute top-0 right-14 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-200 hover:bg-white hover:bg-opacity-10"
              onClick={closeSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-shrink-0 flex flex-col items-center px-4">
            <img src={schoolLogo} alt='school' className="h-12 w-12" />
            <span className="text-white text-lg font-bold ml-2 text-center">
              {user?.schoolName || 'My Campus'}
            </span>
          </div>

          {/* Navigation */}
          <div
            className="mt-5 flex-1 overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#4338ca #1e1b4b'
            }}
          >
            <style>
              {`
                .mobile-nav-scroll::-webkit-scrollbar {
                  width: 6px;
                }
                .mobile-nav-scroll::-webkit-scrollbar-track {
                  background: #1e1b4b;
                  border-radius: 3px;
                }
                .mobile-nav-scroll::-webkit-scrollbar-thumb {
                  background: #4338ca;
                  border-radius: 3px;
                }
                .mobile-nav-scroll::-webkit-scrollbar-thumb:hover {
                  background: #3730a3;
                }
              `}
            </style>
            <nav className="px-2 space-y-1 mobile-nav-scroll">
              {navigationSections.map((section) => (
                <NavSection key={section.name} section={section} isMobile={true} />
              ))}
            </nav>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 m-3">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Current Subscription Plan
            </h3>
            <div className="mt-1 text-lg font-bold text-gray-800 dark:text-white">
              Basic Plan
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Upgrade to access more features.
            </p>
            <button className="mt-4 w-full bg-[#152259] hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition">
              Upgrade Plan
            </button>
          </div>

          {/* Logout button - Mobile */}
          <div className="flex-shrink-0 flex border-t border-primary-700 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 group block w-full"
            >
              <div className="flex items-center">
                <div className="ml-3">
                  <div className="flex items-center text-primary-200 text-sm font-medium hover:text-white transition-colors">
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-80">
          <div className="flex flex-col h-0 flex-1 bg-[#152259]">
            <div className="flex-1 flex flex-col pb-4">
              <div className="flex items-center flex-col flex-shrink-0 py-6 gap-3">
                <img src={schoolLogo} alt='school' className="h-16 w-16" />
                <span className="text-white text-xl font-bold text-center">
                  My Campus
                </span>
                <div className='w-full h-[1px] bg-[#bdbdbdc0]'></div>
              </div>

              {/* Navigation - This is where you want the scrollbar */}
              <div
                className="flex-1 max-h-[34rem] overflow-y-scroll custom-scrollbar"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4338ca #1e1b4b'
                }}
              >
                <style>
                  {`
                    .custom-scrollbar::-webkit-scrollbar {
                      width: 8px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                      background: #1e1b4b;
                      border-radius: 4px;
                      margin: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background: #4338ca;
                      border-radius: 4px;
                      border: 1px solid #1e1b4b;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: #3730a3;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:active {
                      background: #312e81;
                    }
                  `}
                </style>
                <nav className="">
                  {navigationSections.map((section) => (
                    <NavSection key={section.name} section={section} />
                  ))}
                </nav>
              </div>
            </div>

            <div className='w-full h-[1px] bg-[#bdbdbdc0]'></div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4 m-3">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Current Subscription Plan
              </h3>
              <div className="mt-1 text-lg font-bold text-gray-800 dark:text-white">
                Basic Plan
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Upgrade to access more features.
              </p>
              <button className="mt-4 w-full bg-[#152259] hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition">
                Upgrade Plan
              </button>
            </div>

            {/* Logout button - Desktop */}
            <div className="flex-shrink-0 flex border-t border-primary-700 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 group block w-full"
              >
                <div className="flex items-center">
                  <div className="ml-3">
                    <div className="flex items-center text-primary-200 text-sm font-medium hover:text-white transition-colors">
                      <LogOut className="mr-2 h-5 w-5" />
                      Logout
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-200 hover:bg-gray-100"
            onClick={openSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;