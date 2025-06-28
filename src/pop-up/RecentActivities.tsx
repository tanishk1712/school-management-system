/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { recentActivities } from '../services/Dashboard'
import { Activity } from '../types/Dashboard';
import { Calendar, Clock8, FileText, UserRound, Users } from 'lucide-react';
import { formatDate } from '../utils/cn';
import Loader from '../pages/dashboard/Loader';

export default function RecentActivities() {
    const [showPopup, setShowPopup] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);



    const togglePopup = () => {
        setShowPopup(prev => {
            const newState = !prev;
            if (newState) {
                setLoading(true);
                recentActivities(setActivities, setLoading)
            }
            return newState;
        });
    };

    return (
        <div className="relative inline-block">
            <div onClick={togglePopup} className="cursor-pointer text-[#152259]">
                <Clock8 />
            </div>
            {showPopup && (
                <div className='absolute top-10 right-0 z-50 w-96  bg-white shadow-lg p-2 rounded-lg border border-gray-200'>
                    <div className="px-1 py-2 mb-4 sm:px-2 border-b border-gray-200">
                        <h3 className="text-lg font-medium  leading-6 text-gray-900">Recent Activities</h3>
                    </div>
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="overflow-auto px-3  max-h-[500px]">

                            {activities.length > 0 ? (
                                activities.map((activity: any) => (
                                    <div key={activity._id} className="flex items-start mb-2">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                                {(activity.type === "STUDENT_CREATED" || activity.type === "STUDENT_UPDATED") && (
                                                    <UserRound className="h-5 w-5 text-primary-600" />
                                                )}
                                                {(activity.type === "TEACHER_CREATED" || activity.type === "TEACHER_UPDATED") && (
                                                    <Users className="h-5 w-5 text-primary-600" />
                                                )}
                                                {(activity.type === "EXAM_CREATED" || activity.type === "EXAM_UPDATED") && (
                                                    <FileText className="h-5 w-5 text-primary-600" />
                                                )}
                                                {(activity.type === "TIMETABLE_CREATED" || activity.type === "TIMETABLE_UPDATED" || activity.type === "TIMETABLE_ENTRY_ADDED") && (
                                                    <Calendar className="h-5 w-5 text-primary-600" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                                            <p className=" text-sm text-gray-500">{activity.description}</p>
                                            <p className=" text-xs text-gray-400">{formatDate(activity.timestamp)}</p>
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No recent activities</p>
                            )}
                        </div>

                    )}
                </div>
            )}
        </div>
    );
}
