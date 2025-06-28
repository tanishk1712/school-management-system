/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { fetchAnnouncements, handleDeleteAnnouncement } from '../services/Dashboard'
import { Announcement } from '../types/Dashboard';
import { AlertCircle, AlertTriangle, BellDot, Info, Trash2, } from 'lucide-react';
import { formatDate, getAnnouncementStyles } from '../utils/cn';
import Loader from '../pages/dashboard/Loader';

export default function Announcements() {
    const [showPopup, setShowPopup] = useState(false);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePopup = () => {
        setShowPopup(prev => {
            const newState = !prev;
            if (newState) {
                setLoading(true);
                fetchAnnouncements(setAnnouncements, setLoading);
            }
            return newState;
        });
    };
    const getAnnouncementIcon = (type: string) => {
        switch (type) {
            case 'INFO':
                return <Info className="h-5 w-5 text-blue-400" />;
            case 'WARNING':
                return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
            case 'URGENT':
                return <AlertCircle className="h-5 w-5 text-red-400" />;
            default:
                return <Info className="h-5 w-5 text-blue-400" />;
        }
    };

    return (
        <div className="relative inline-block">
            <div onClick={togglePopup} className="cursor-pointer text-[#152259]">
                <BellDot />
            </div>
            {showPopup && (
                <div className='absolute top-10 right-0 z-50 w-96  bg-white shadow-lg p-2 rounded-lg border border-gray-200'>
                    <div className="px-1 py-2 mb-4 sm:px-2 border-b border-gray-200">
                        <h3 className="text-lg font-medium  leading-6 text-gray-900">Recent Announcements</h3>
                    </div>
                    <div className="overflow-auto px-3  max-h-[500px]">

                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-auto">
                                {announcements.length > 0 ? (
                                    announcements.map((announcement: any) => {
                                        const styles = getAnnouncementStyles(announcement.type);
                                        return (
                                            <div key={announcement._id} className={`${styles.bg} ${styles.border} p - 4 relative`}>
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        {getAnnouncementIcon(announcement.type)}
                                                    </div>
                                                    <div className="ml-3 flex-1 pr-8">
                                                        <h3 className={`text - sm font - medium ${styles.textColor}`}>{announcement.title}</h3>
                                                        <div className={`mt - 2 text - sm ${styles.contentColor}`}>
                                                            <p>{announcement.content}</p>
                                                        </div>
                                                        <p className="mt-1 text-xs text-gray-500">{formatDate(announcement.timestamp)}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteAnnouncement(announcement._id, setIsDeleting, setAnnouncements, announcements)}
                                                        disabled={isDeleting}
                                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 focus:outline-none"
                                                        title="Delete announcement"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No announcements</p>
                                )}
                            </div>
                        )}

                        {announcements.length > 5 && (
                            <div className="mt-6">
                                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                                    View all announcements
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
