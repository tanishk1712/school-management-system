import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Loader2, Save, School, Mail, User, Lock } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  
  const [schoolInfo, setSchoolInfo] = useState({
    adminName: user?.adminName || '',
    schoolName: user?.schoolName || '',
    schoolEmail: user?.schoolEmail || '',
  });
  
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchoolInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSavingProfile(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Profile information updated successfully');
      setIsSavingProfile(false);
    }, 1000);
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordInfo.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    
    setIsSavingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Password changed successfully');
      setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsSavingPassword(false);
    }, 1000);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-500">
          Manage your account and school information
        </p>
      </div>
      
      <div className="space-y-8">
        {/* School Information */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <School className="h-5 w-5 text-primary-500 mr-2" />
              School Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update your school and administrator details
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">
                    Administrator Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="adminName"
                      id="adminName"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={schoolInfo.adminName}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700">
                    School Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <School className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="schoolName"
                      id="schoolName"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={schoolInfo.schoolName}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="schoolEmail" className="block text-sm font-medium text-gray-700">
                    School Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="schoolEmail"
                      id="schoolEmail"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={schoolInfo.schoolEmail}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Change Password */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Lock className="h-5 w-5 text-primary-500 mr-2" />
              Change Password
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update your account password
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={passwordInfo.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={passwordInfo.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={passwordInfo.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingPassword ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Updating...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* System Preferences */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              System Preferences
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Configure system-wide settings
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">Notifications</legend>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailNotifications"
                      name="emailNotifications"
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      defaultChecked
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-gray-500">
                      Receive email notifications for important events like exam schedules and announcements.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="smsNotifications"
                      name="smsNotifications"
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="smsNotifications" className="font-medium text-gray-700">
                      SMS Notifications
                    </label>
                    <p className="text-gray-500">
                      Receive SMS alerts for critical updates (additional charges may apply).
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
            
            <fieldset className="mt-6">
              <legend className="text-base font-medium text-gray-900">System Display</legend>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="theme-light"
                    name="theme"
                    type="radio"
                    defaultChecked
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                  />
                  <label htmlFor="theme-light" className="ml-3 block text-sm font-medium text-gray-700">
                    Light Mode
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="theme-dark"
                    name="theme"
                    type="radio"
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                  />
                  <label htmlFor="theme-dark" className="ml-3 block text-sm font-medium text-gray-700">
                    Dark Mode
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="theme-system"
                    name="theme"
                    type="radio"
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                  />
                  <label htmlFor="theme-system" className="ml-3 block text-sm font-medium text-gray-700">
                    System Default
                  </label>
                </div>
              </div>
            </fieldset>
            
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;