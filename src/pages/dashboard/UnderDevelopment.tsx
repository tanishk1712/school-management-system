import React from 'react';
import ElephantImage from '../../assets/underdeveloping.png';

const UnderDevelopment = ({ moduleName = "This module" }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center bg-[#F4F4F4] p-6 min-h-[60vh]">
            <img
                src={ElephantImage}
                alt="Module Under Development"
                className="max-w-[70%] w-full mb-6"
            />
            <h2 className="text-xl font-semibold text-gray-700">
                {moduleName} is Under Development 🛠️
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
                We're currently working hard on this module. It will be available soon. Thank you for your patience!
            </p>
        </div>
    );
};

export default UnderDevelopment;
