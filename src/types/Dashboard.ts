export interface Activity {
    _id: string;
    schoolId: string;
    type: string;
    description: string;
    timestamp: string;
    __v: number;
}

export interface Announcement {
    _id: string;
    schoolId: string;
    title: string;
    content: string;
    type: 'INFO' | 'WARNING' | 'URGENT';
    timestamp: string;
    __v: number;
}