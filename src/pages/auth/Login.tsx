/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Eye, Loader2 } from 'lucide-react';

const Login = () => {
  const [schoolName, setSchoolName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewPassword, setViewPassword] = useState(false);
  const [forgot, setForgot] = useState(false);
  const schoolID = localStorage.getItem("School ID");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!schoolName || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(schoolName, password);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewPassword = () => {
    setViewPassword((prev: any) => !prev);
  };

  // const handleForgotPassword = async () => {

  //   setForgot((prev) => !prev);

  //   // const emailBody = ""
  //   if (forgot) {
  //     const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${schoolID}`,
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify(email),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to sent Email');
  //     }

  //     toast.success('Email sent successfully');
  //   }


  // }
  const toggleForgotPassword = () => {
    setForgot((prev) => !prev);
  };


  // Handle forgot password submission
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your school email');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`,
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process password reset');
      }

      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset request failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">

      {forgot ? (

        <form className="space-y-6" onSubmit={handleForgotSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Enter your school email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="organization"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <div className='text-right text-sm text-blue-500 cursor-pointer' onClick={toggleForgotPassword}>
              login
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Logging in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="schoolName" className="block text-[16px] font-medium text-gray-700">
              School Name
            </label>
            <div className="mt-1">
              <input
                id="schoolName"
                name="schoolName"
                type="text"
                autoComplete="organization"
                placeholder='Enter School Name'
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="appearance-none block w-full px-3 py-2 h-[50px] border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#152259] focus:border-[#152259] sm:text-[18px] text-[#152259] text-xl"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-[16px] font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={viewPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder='Enter Password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 h-[50px] border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#152259] focus:border-[#152259] sm:text-[18px] text-[#152259] text-xl"
                disabled={isSubmitting}
              />
              <Eye
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={handleViewPassword}
              />
            </div>
          </div>


          <div>
            <div className='text-right text-sm text-blue-500 cursor-pointer' onClick={toggleForgotPassword}>
              Forgot Password ?
            </div>
            <div className='flex w-[100%] justify-between items-center mt-2'>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-[45%] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#152259] hover:bg-[#1d2130] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#152259] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
              <Link
                to="/register"
                className="w-[45%] flex justify-center text-nowrap py-2 px-4 border border-[#152259] rounded-md shadow-sm text-sm font-medium text-[#152259] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Register your school
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;