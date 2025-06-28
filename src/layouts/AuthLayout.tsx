import React from 'react';
import { Outlet } from 'react-router-dom';
import Logo from '../assets/schoolLogo.png'


const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-screen-lg text-center">

        <img src={Logo} alt='Logo' className="mx-auto w-20 h-20" />

        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#152259]">
          Welcome to the My Compus.
        </h2>
        <h5 className='text-[#152259] mt-2'>
          It is our great pleasure to have you on board!
        </h5>
      </div>
      <div className="flex items-center justify-center space-x-2 mt-2">
        <div className="w-3 h-3 rounded-full bg-[#152259] " />
        <div className="w-3 h-3 rounded-full bg-[#152259] " />
        <div className="w-3 h-3 rounded-full bg-[#152259] " />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[40%]">
        <div className=" py-8 px-4 sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;