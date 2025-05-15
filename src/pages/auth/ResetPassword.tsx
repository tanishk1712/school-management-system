/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Eye, Loader2 } from 'lucide-react';

const ResetPassword = () => {
  // State variables
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [tokenpass, setToken] = useState('');
  
  const navigate = useNavigate();
  
  // Extract reset token from URL query parameters
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    if (token) {
      setToken(token);
      console.log(token,'iopiopipp')
    } else {
      toast.error('Invalid or missing reset token');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [token, navigate]);
  
  
  // Toggle password visibility
  const handleViewPassword = () => {
    setViewPassword((prev) => !prev);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
      
      toast.success('Password reset successful');
      // Redirect to login page after success
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reset Your Password</h2>
        <p className="text-gray-600 mt-2">Please enter your new password below</p>
      </div>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="mt-1 relative">
            <input
              id="newPassword"
              name="newPassword"
              type={viewPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              disabled={isSubmitting}
            />
            <Eye
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={handleViewPassword}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="mt-1 relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={viewPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              disabled={isSubmitting}
            />
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Updating password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => navigate('/login')}
          className="text-sm text-primary-600 hover:text-primary-500"
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;