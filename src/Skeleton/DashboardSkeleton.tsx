import React from 'react';

const DashboardSkeleton = () => {
    return (
        <div className="animate-pulse p-6 bg-gray-50 min-h-screen">
            {/* Top Section with Learn how to launch text and buttons */}
            <div className="mb-8 flex  justify-between items-center">
                <div>
                    <div className="h-4 bg-gray-300 rounded w-48 mb-1"></div>
                    <div className="h-4 bg-gray-300 rounded w-80"></div>
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-32 bg-gray-300 rounded"></div>
                    <div className="h-10 w-32 bg-gray-300 rounded"></div>
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Welcome Card - Takes 2 columns */}
                <div className="lg:col-span-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl p-6 h-64">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                            {/* Logo circle */}
                            <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
                            <div>
                                {/* School name */}
                                <div className="h-6 bg-gray-400 rounded w-64 mb-2"></div>
                                {/* Excellence text */}
                                <div className="h-4 bg-gray-400 rounded w-48 mb-3"></div>
                                {/* Contact info */}
                                <div className="space-y-1">
                                    <div className="h-3 bg-gray-400 rounded w-32"></div>
                                    <div className="h-3 bg-gray-400 rounded w-28"></div>
                                    <div className="h-3 bg-gray-400 rounded w-36"></div>
                                </div>
                            </div>
                        </div>
                        {/* Subscription plan box */}
                        <div className="bg-gray-400 rounded-lg p-4 w-48 h-20">
                            <div className="h-4 bg-gray-500 rounded w-32 mb-2"></div>
                            <div className="h-6 bg-gray-500 rounded w-20"></div>
                        </div>
                    </div>

                    {/* Stats grid at bottom */}
                    <div className="mt-6 grid grid-cols-4 gap-4">
                        <div className="bg-gray-400 rounded-lg p-3 h-16">
                            <div className="h-6 bg-gray-500 rounded w-8 mb-1"></div>
                            <div className="h-3 bg-gray-500 rounded w-12"></div>
                        </div>
                        <div className="bg-gray-400 rounded-lg p-3 h-16">
                            <div className="h-6 bg-gray-500 rounded w-6 mb-1"></div>
                            <div className="h-3 bg-gray-500 rounded w-14"></div>
                        </div>
                        <div className="bg-gray-400 rounded-lg p-3 h-16">
                            <div className="h-6 bg-gray-500 rounded w-6 mb-1"></div>
                            <div className="h-3 bg-gray-500 rounded w-10"></div>
                        </div>
                        <div className="bg-gray-400 rounded-lg p-3 h-16">
                            <div className="h-6 bg-gray-500 rounded w-6 mb-1"></div>
                            <div className="h-3 bg-gray-500 rounded w-16"></div>
                        </div>
                    </div>
                </div>

                {/* Calendar Card */}
                <div className="bg-gray-300 rounded-xl p-6 h-64">
                    {/* Calendar header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-5 bg-gray-400 rounded w-24"></div>
                        <div className="w-5 h-5 bg-gray-400 rounded"></div>
                    </div>

                    {/* Calendar days header */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {Array.from({ length: 7 }, (_, i) => (
                            <div key={i} className="h-3 bg-gray-400 rounded w-6 mx-auto"></div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 35 }, (_, i) => (
                            <div key={i} className="h-8 bg-gray-400 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Financial Analytics Section */}
            <div className="bg-gray-300 rounded-xl p-6 mb-6">
                {/* Header with buttons */}
                <div className="flex items-center justify-between mb-6">
                    <div className="h-7 bg-gray-400 rounded w-48"></div>
                    <div className="flex space-x-2">
                        <div className="h-10 w-20 bg-gray-400 rounded-lg"></div>
                        <div className="h-10 w-24 bg-gray-400 rounded-lg"></div>
                        <div className="h-10 w-20 bg-gray-400 rounded-lg"></div>
                    </div>
                </div>

                {/* Financial cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Income Card */}
                    <div className="bg-[#DDFCE8] rounded-lg p-6 h-32">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gray-500 rounded"></div>
                                <div className="h-5 bg-gray-500 rounded w-16"></div>
                            </div>
                            <div className="h-6 w-12 bg-gray-500 rounded-full"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="h-4 bg-gray-500 rounded w-12"></div>
                                <div className="h-6 bg-gray-500 rounded w-16"></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="h-4 bg-gray-500 rounded w-14"></div>
                                <div className="h-5 bg-gray-500 rounded w-14"></div>
                            </div>
                        </div>
                    </div>

                    {/* Expenses Card */}
                    <div className="bg-[#FFFFFF] rounded-lg p-6 h-32">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gray-500 rounded"></div>
                                <div className="h-5 bg-gray-500 rounded w-20"></div>
                            </div>
                            <div className="h-6 w-12 bg-gray-500 rounded-full"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="h-4 bg-gray-500 rounded w-12"></div>
                                <div className="h-6 bg-gray-500 rounded w-16"></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="h-4 bg-gray-500 rounded w-14"></div>
                                <div className="h-5 bg-gray-500 rounded w-14"></div>
                            </div>
                        </div>
                    </div>

                    {/* Net Profit Card */}
                    <div className="bg-[#DDFCE8] rounded-lg p-6 h-32">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gray-500 rounded"></div>
                                <div className="h-5 bg-gray-500 rounded w-20"></div>
                            </div>
                            <div className="h-6 w-12 bg-gray-500 rounded-full"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="h-4 bg-gray-500 rounded w-12"></div>
                                <div className="h-6 bg-gray-500 rounded w-16"></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="h-4 bg-gray-500 rounded w-14"></div>
                                <div className="h-5 bg-gray-500 rounded w-14"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid - Performance Chart and Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Academic Performance Chart - Takes 2 columns */}
                <div className="lg:col-span-2 bg-gray-300 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-6 bg-gray-400 rounded w-48"></div>
                        <div className="flex items-center space-x-2">
                            <div className="h-8 bg-gray-400 rounded w-12"></div>
                            <div className="h-4 bg-gray-400 rounded w-8"></div>
                        </div>
                    </div>
                    {/* Chart area */}
                    <div className="h-64 bg-gray-400 rounded-lg"></div>
                </div>

                {/* Top Performers */}
                <div className="bg-gray-300 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-6 bg-gray-400 rounded w-32"></div>
                        <div className="w-5 h-5 bg-gray-400 rounded"></div>
                    </div>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }, (_, i) => (
                            <div key={i} className="flex items-center space-x-3 p-3 bg-gray-400 rounded-lg">
                                <div className="w-12 h-12 bg-gray-500 rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-500 rounded w-24 mb-2"></div>
                                    <div className="h-3 bg-gray-500 rounded w-20"></div>
                                </div>
                                <div className="text-right">
                                    <div className="h-5 bg-gray-500 rounded w-10 mb-1"></div>
                                    <div className="flex space-x-1">
                                        {Array.from({ length: 5 }, (_, j) => (
                                            <div key={j} className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;