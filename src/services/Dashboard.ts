/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from 'react-hot-toast';
import { BASE_URL } from './authService';


export const recentActivities = async (setActivities: any, setLoading: any) => {
    try {
        setLoading(false)

        const response = await fetch(`${BASE_URL}/api/activities`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch activities');
        }


        const data = await response.json();
        setActivities(data);

    } catch (error) {
        console.error('Error fetching activities:', error);
        toast.error('Failed to load activities');
    } finally {
        setLoading(false);
    }
};

export const fetchAnnouncements = async (setAnnouncements: any, setLoading: any) => {
    try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/announcements`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch announcements');
        }

        const data = await response.json();
        setAnnouncements(data);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        toast.error('Failed to load announcements');
    } finally {
        setLoading(false);
    }
};

export const handleDeleteAnnouncement = async (id: string, setIsDeleting: any, setAnnouncements: any, announcements: any) => {
    try {
        setIsDeleting(true);
        const response = await fetch(`${BASE_URL}/api/announcements/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to delete announcement');
        }

        setAnnouncements(announcements.filter((announcement: { _id: string; }) => announcement._id !== id));
        toast.success('Announcement deleted successfully');
    } catch (error) {
        console.error('Error deleting announcement:', error);
        toast.error('Failed to delete announcement');
    } finally {
        setIsDeleting(false);
    }
};