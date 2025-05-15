import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, Calendar, Clock, Award, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Student Management',
    description: 'Efficiently manage student records, attendance, and academic progress all in one place.'
  },
  {
    icon: BookOpen,
    title: 'Teacher Administration',
    description: 'Handle teacher assignments, schedules, and professional development tracking.'
  },
  {
    icon: Calendar,
    title: 'Exam Planning',
    description: 'Schedule and organize exams, track results, and generate performance reports.'
  },
  {
    icon: Clock,
    title: 'Timetable Management',
    description: 'Create and manage class schedules, teacher assignments, and room allocations.'
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed w-full z-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EduManager</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Register School
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              Transform Your School Management
              <span className="block text-primary-600 mt-2">With Modern Solutions</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500">
              Streamline administrative tasks, enhance communication, and improve educational outcomes
              with our comprehensive school management system.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything You Need to Run Your School
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              Our platform provides all the tools you need to manage your educational institution effectively.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-700 ring-4 ring-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Trusted by Schools Worldwide
            </h2>
            <p className="mt-3 text-xl text-primary-200">
              Join thousands of educational institutions already using our platform
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">
                Schools
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">1000+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">
                Students
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">500K+</dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">
                Teachers
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">50K+</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-700 rounded-lg shadow-xl overflow-hidden">
            <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="block">Ready to get started?</span>
                  <span className="block text-primary-200">Register your school today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-primary-200">
                  Join our platform and experience the future of school management.
                  Get started with a free account today.
                </p>
                <Link
                  to="/register"
                  className="mt-8 bg-white border border-transparent rounded-md shadow px-6 py-3 inline-flex items-center text-base font-medium text-primary-600 hover:bg-primary-50"
                >
                  Register Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EduManager</span>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} EduManager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;