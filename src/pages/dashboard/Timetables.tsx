/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Clock,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Info,
  Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import Nodata from './Nodata';
import { BASE_URL } from '../../services/authService';
import Loader from './Loader';

// Available classes and sections
const availableClasses = ['8', '9', '10', '11', '12'];
const availableSections = ['A', 'B', 'C', 'D'];
const availableSubjects = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Physical Education',
  'Art',
  'Music'
];

// Days of the week
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Time slots
const timeSlots = [
  { id: '1', start: '08:00', end: '08:45' },
  { id: '2', start: '08:45', end: '09:30' },
  { id: '3', start: '09:30', end: '10:15' },
  { id: '4', start: '10:15', end: '11:00' },
  { id: '5', start: '11:00', end: '11:45' },
  { id: '6', start: '11:45', end: '12:30' },
  { id: '7', start: '12:30', end: '13:15' },
  { id: '8', start: '13:15', end: '14:00' }
];

// Mock timetable detail data
// const mockTimetableDetails = {
//   '1': [
//     { day: 'Monday', slotId: '1', subject: 'Mathematics', teacher: 'Sarah Johnson' },
//     { day: 'Monday', slotId: '2', subject: 'English', teacher: 'Emily Chen' },
//     { day: 'Monday', slotId: '3', subject: 'Physics', teacher: 'Michael Rodriguez' },
//     { day: 'Monday', slotId: '4', subject: 'History', teacher: 'David Wilson' },
//     { day: 'Tuesday', slotId: '1', subject: 'English', teacher: 'Emily Chen' },
//     { day: 'Tuesday', slotId: '2', subject: 'Chemistry', teacher: 'Michael Rodriguez' },
//     { day: 'Tuesday', slotId: '3', subject: 'Mathematics', teacher: 'Sarah Johnson' },
//     { day: 'Tuesday', slotId: '4', subject: 'Physical Education', teacher: 'Jessica Taylor' },
//     // Add more entries for other days and slots as needed
//   ],
//   '2': [
//     { day: 'Monday', slotId: '1', subject: 'Science', teacher: 'Michael Rodriguez' },
//     { day: 'Monday', slotId: '2', subject: 'Mathematics', teacher: 'Sarah Johnson' },
//     { day: 'Monday', slotId: '3', subject: 'English', teacher: 'Emily Chen' },
//     { day: 'Monday', slotId: '4', subject: 'History', teacher: 'David Wilson' },
//     // Add more entries for other days and slots as needed
//   ],
//   '3': [
//     { day: 'Monday', slotId: '1', subject: 'Physics', teacher: 'Michael Rodriguez' },
//     { day: 'Monday', slotId: '2', subject: 'Chemistry', teacher: 'Michael Rodriguez' },
//     { day: 'Monday', slotId: '3', subject: 'Mathematics', teacher: 'Sarah Johnson' },
//     { day: 'Monday', slotId: '4', subject: 'English', teacher: 'Emily Chen' },
//     // Add more entries for other days and slots as needed
//   ]
// };

// Type definitions
interface Timetable {
  _id: string;
  id: string;
  name: string;
  class: string;
  section: string;
  effectiveFrom: string;
  createdAt: string;
}

interface TimetableEntry {
  _id: string
  day: string;
  slotId: string;
  subject: string;
  teacher: string;
}

interface TimetableForm {
  name: string;
  class: string;
  section: string;
  effectiveFrom: string;
}

type Teacher = {
  name: string;
};


// Empty form
const emptyForm: TimetableForm = {
  name: '',
  class: '',
  section: '',
  effectiveFrom: new Date().toISOString().split('T')[0]
};

const Timetables = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [timetableDetails, setTimetableDetails] = useState<{ [key: string]: TimetableEntry[] }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [form, setForm] = useState<TimetableForm>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState<Partial<TimetableEntry>>({ day: 'Monday', slotId: '1', subject: '', teacher: '' });
  const [teachersName, setTeacherName] = useState<Teacher[]>([])
  const [isLoading, setLoading] = useState(false);
  const schoolID = localStorage.getItem("School ID")

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${BASE_URL}/api/timetables`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${schoolID}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch time table');
        }

        const data = await response.json();
        setTimetables(data);
      } catch (error) {
        console.error('Error fetching time table:', error);
      } finally {
        setLoading(false)
      }
    };

    fetchTimetable();
  }, [schoolID]);

  useEffect(() => {
    const fetchEntries = async () => {
      if (!selectedTimetable?._id) return;

      try {
        const response = await fetch(`${BASE_URL}/api/timetables/${selectedTimetable._id}/entries`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${schoolID}` // Replace as needed
          },
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch timetable entries');
        }

        setTimetableDetails(prev => ({
          ...prev,
          [selectedTimetable.id]: data
        }));
      } catch (error) {
        console.error('Failed to fetch Entries', error);
        toast.error('Failed to fetch Entries');
      }
    };

    fetchEntries();
  }, [schoolID, selectedTimetable]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/teachers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${schoolID}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch teachers');
        }

        const data = await response.json();
        setTeacherName(data.map((cata: any) => cata?.name))
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, [schoolID]);


  // Filter timetables based on search term and filters
  const filteredTimetables = timetables.filter(
    timetable =>
      (timetable.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterClass === '' || timetable.class === filterClass)
  );

  // Open modal for add/edit timetable
  const openModal = (timetable?: Timetable) => {
    if (timetable) {
      setEditingTimetable(timetable);
      setForm({
        name: timetable.name,
        class: timetable.class,
        section: timetable.section,
        effectiveFrom: timetable.effectiveFrom
      });
    } else {
      setEditingTimetable(null);
      setForm(emptyForm);
    }
    setIsModalOpen(true);
  };

  // Close modal and reset
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTimetable(null);
    setForm(emptyForm);
  };

  // Open detail modal to view and edit timetable entries
  const openDetailModal = (timetable: Timetable) => {
    setSelectedTimetable(timetable);

    // Initialize timetable details if not exist
    if (!timetableDetails[timetable.id]) {
      setTimetableDetails({
        ...timetableDetails,
        [timetable.id]: []
      });
    }

    setIsDetailModalOpen(true);
  };

  // Close detail modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTimetable(null);
    setNewEntry({ day: 'Monday', slotId: '1', subject: '', teacher: '' });
  };

  // Handle timetable form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle new entry form input changes
  const handleEntryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: value }));
  };

  // Handle timetable form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.class || !form.section || !form.effectiveFrom) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingTimetable) {
      // Update existing timetable
      setTimetables(timetables.map(t =>
        t.id === editingTimetable.id
          ? {
            ...t,
            ...form,
            createdAt: t.createdAt // preserve original creation date
          }
          : t
      ));
      toast.success('Timetable updated successfully');


      const updatedTimetable = {
        schoolId: schoolID,
        name: form.name,
        class: form.class,
        section: form.section,

        effectiveFrom: form.effectiveFrom,
        entries: [],
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(`${BASE_URL}/api/timetables/${editingTimetable._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`, // if using Authorization header
        },
        body: JSON.stringify(updatedTimetable),
        credentials: 'include',
      });


      if (!response.ok) {
        throw new Error('Failed to update Time table');
      }

      const savedTimetable = await response.json();
      setTimetables(timetables.map(t => t.id === savedTimetable.id ? savedTimetable : t));
      toast.success('Time table updated successfully');
    } else {
      // Add new timetable
      const newTimeTable = {
        schoolId: schoolID,
        name: form.name,
        class: form.class,
        section: form.section,

        effectiveFrom: form.effectiveFrom,
        entries: [],
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(`${BASE_URL}/api/timetables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newTimeTable),
      });

      if (!response.ok) {
        throw new Error('Failed to add teacher');
      }

      const saveTimeTable = await response.json();
      setTimetables([...timetables, saveTimeTable]);
      toast.success('Time tabled successfully');
    }

    closeModal();
  };

  const addEntry = async () => {
    if (!selectedTimetable) return;

    if (!newEntry.subject || !newEntry.teacher) {
      toast.error('Please select a subject and teacher');
      return;
    }

    // Check if the slot is already occupied locally
    const isOccupied = timetableDetails[selectedTimetable.id]?.some(
      entry => entry.day === newEntry.day && entry.slotId === newEntry.slotId
    );

    if (isOccupied) {
      toast.error('This time slot is already occupied. Please remove the existing entry first.');
      return;
    }

    const entry = {
      day: newEntry.day || 'Monday',
      slotId: newEntry.slotId || '1',
      subject: newEntry.subject || '',
      teacher: newEntry.teacher || ''
    };

    try {

      const response = await fetch(`${BASE_URL}/api/timetables/${selectedTimetable._id}/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}` // Include the token in the Authorization header
        },
        credentials: 'include',
        body: JSON.stringify(entry)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add entry');
      }

      const savedEntry = await response.json();

      // Update local state with the saved entry
      setTimetableDetails(prev => ({
        ...prev,
        [selectedTimetable.id]: [...(prev[selectedTimetable.id] || []), savedEntry]
      }));

      setNewEntry({ day: 'Monday', slotId: '1', subject: '', teacher: '' });
      toast.success('Entry added to timetable');
    } catch (error) {
      console.error(' error:', error);
      toast.error('Failed to add entries');
    }
  };


  // Remove an entry from the timetable
  // Remove an entry from the timetable
  const removeEntry = async (day: string, slotId: string) => {
    if (!selectedTimetable) return;

    const currentEntries = timetableDetails[selectedTimetable.id] || [];

    // Find the entry to delete (based on day and slotId)
    const entryToDelete = currentEntries.find(
      entry => entry.day === day && entry.slotId === slotId
    );

    if (!entryToDelete || !entryToDelete._id) {
      toast.error('Entry not found or missing ID');
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/timetables/${selectedTimetable._id}/entries/${entryToDelete._id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${schoolID}`
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete entry');
      }

      const result = await response.json();

      // Update local state
      setTimetableDetails({
        ...timetableDetails,
        [selectedTimetable.id]: currentEntries.filter(
          entry => entry._id !== entryToDelete._id
        )
      });
      toast.success(result?.message)

    } catch (error) {
      toast.error("Failed to delete entry");
      console.error('Delete error:', error);
    }
  };


  // Delete timetable
  const deleteTimetable = async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/timetables/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`, // if using token auth
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete teacher');
      }

      // Update local state after successful deletion
      setTimetables(timetables.filter(t => t._id !== id));
      setDeleteConfirmId(null);
      toast.success('time table removed successfully');
    } catch (error) {
      console.error('Delete time table error:', error);
      toast.error('Failed to delete time table');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  // Get time slot display
  // const getTimeSlotDisplay = (slotId: string) => {
  //   const slot = timeSlots.find(slot => slot.id === slotId);
  //   return slot ? `${slot.start} - ${slot.end}` : '';
  // };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterClass('');
  };

  return (
    <div className="animate-fade-in">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="ont-medium text-gray-500 text-[25px]">Timetables</h1>
          <p className="mt-1 font-medium text-gray-500 text-[18px]">
            Create and manage class schedules
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="border p-3 rounded-lg text-[#152259] hover:bg-[#152259] hover:text-gray-200"
        >
          Create Timetable
        </button>
      </div>

      {/* Search and filters */}
      <div className="mb-6 flex gap-4 justify-between items-center">
        <div className='flex justify-start gap-4'>
          <div className=" flex flex-col justify-between items-center">
            <div className=" font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start h-full bg-white max-w-lg gap-2 p-2">
              <div className="flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-primary-500 focus:border-primary-500  w-full  sm:text-sm border-gray-300 rounded-md outline-none"
                placeholder="Search time table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className=' font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start bg-white max-w-lg gap-2 p-2'>
            <select
              className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm bg-white outline-none"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {availableClasses.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={resetFilters}
              className="border p-2 rounded-lg text-[#152259] hover:bg-[#152259] hover:text-gray-200"
            >
              Reset
            </button>
          </div>
        </div>
        <div className='font-medium text-gray-500 text-[18px]'>Total students - {timetables?.length}</div>
      </div>

      {/* Timetables List */}
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timetable Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Effective From
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-40 px-6">
                  <Loader />
                </td>
              </tr>
            ) : filteredTimetables.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  <Nodata name='Time Table' />
                </td>
              </tr>
            ) : (
              filteredTimetables.map((timetable) => (
                <tr key={timetable.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-secondary-500 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{timetable.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Class {timetable.class}-{timetable.section}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      {formatDate(timetable.effectiveFrom)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(timetable.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {deleteConfirmId === timetable._id ? (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-xs text-gray-500">Confirm?</span>
                        <button
                          onClick={() => deleteTimetable(timetable._id)}
                          className="text-white bg-red-600 hover:bg-red-700 p-1 rounded"
                          title="Confirm delete"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded bg-gray-200 hover:bg-gray-300"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openDetailModal(timetable)}
                          className="text-secondary-600 hover:text-secondary-900"
                          title="View/Edit Timetable"
                        >
                          <Info className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal(timetable)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit Details"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(timetable._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Timetable Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {editingTimetable ? 'Edit Timetable' : 'Create New Timetable'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        {/* Timetable Name */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Timetable Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={form.name}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                            placeholder="e.g. Class 10-A Weekly Schedule"
                          />
                        </div>

                        {/* Class and Section */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                              Class <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="class"
                              id="class"
                              value={form.class}
                              onChange={handleChange}
                              className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              required
                            >
                              {availableClasses.map(cls => (
                                <option key={cls} value={cls}>{cls}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                              Section <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="section"
                              id="section"
                              value={form.section}
                              onChange={handleChange}
                              className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              required
                            >
                              {availableSections.map(section => (
                                <option key={section} value={section}>{section}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Effective From */}
                        <div>
                          <label htmlFor="effectiveFrom" className="block text-sm font-medium text-gray-700">
                            Effective From <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="effectiveFrom"
                            id="effectiveFrom"
                            value={form.effectiveFrom}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingTimetable ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Detail Modal */}
      {isDetailModalOpen && selectedTimetable && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:px-6  sm:pb-4">
                <div className='flex justify-end items-end'>
                  <button
                    type="button"
                    className="border p-2 rounded-lg text-[#152259] hover:bg-[#152259] hover:text-gray-200"
                    onClick={closeDetailModal}
                  >
                    Close
                  </button>
                </div>

                <div className="sm:flex sm:items-start mb-4">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                      <Clock className="h-5 w-5 text-secondary-500 mr-2" />
                      {selectedTimetable.name}
                      <span className="ml-3 text-sm font-normal text-gray-500">
                        (Class {selectedTimetable.class}-{selectedTimetable.section})
                      </span>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Effective from {formatDate(selectedTimetable.effectiveFrom)}
                    </p>
                  </div>
                </div>

                {/* Timetable Grid */}
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100 w-24">
                          Time
                        </th>
                        {days.map(day => (
                          <th key={day} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {timeSlots.map(slot => (
                        <tr key={slot.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-500 bg-gray-50 border-r">
                            {slot.start} - {slot.end}
                          </td>
                          {days.map(day => {
                            const entry = timetableDetails[selectedTimetable.id]?.find(
                              e => e.day === day && e.slotId === slot.id
                            );

                            return (
                              <td key={`${day}-${slot.id}`} className="px-3 py-2 whitespace-nowrap text-xs border-r border-b">
                                {entry ? (
                                  <div className="flex flex-col">
                                    <div className="font-medium text-gray-900">{entry.subject}</div>
                                    <div className="text-gray-500">{entry.teacher}</div>
                                    <button
                                      onClick={() => removeEntry(day, slot.id)}
                                      className="mt-1 text-red-500 hover:text-red-700 text-xs"
                                    >
                                      <X className="h-3 w-3 inline" /> Remove
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-gray-400 text-xs">Empty</div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add New Entry Form */}
                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Add Class to Timetable</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label htmlFor="day" className="ml-1 mb-1 block text-sm font-medium text-gray-700">
                        Day
                      </label>
                      <div className='font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start bg-white max-w-lg gap-2 p-2'>
                        <select
                          name="day"
                          id="day"
                          value={newEntry.day}
                          onChange={handleEntryChange}
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm bg-white outline-none"
                        >
                          {days.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="slotId" className="ml-1 mb-1 block text-sm font-medium text-gray-700">
                        Time Slot
                      </label>
                      <div className='font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start bg-white max-w-lg gap-2 p-2'>

                        <select
                          name="slotId"
                          id="slotId"
                          value={newEntry.slotId}
                          onChange={handleEntryChange}
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm bg-white outline-none"
                        >
                          {timeSlots.map(slot => (
                            <option key={slot.id} value={slot.id}>
                              {slot.start} - {slot.end}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="ml-1 mb-1 block text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <div className='font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start bg-white max-w-lg gap-2 p-2'>

                        <select
                          name="subject"
                          id="subject"
                          value={newEntry.subject}
                          onChange={handleEntryChange}
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm bg-white outline-none"
                        >
                          <option value="">Select Subject</option>
                          {availableSubjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="ml-1 mb-1 block text-sm font-medium text-gray-700">
                        Teacher
                      </label>
                      <div className='font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start bg-white max-w-lg gap-2 p-2'>

                        <select
                          name="teacher"
                          id="teacher"
                          value={newEntry.teacher}
                          onChange={handleEntryChange}
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm bg-white outline-none"
                        >
                          <option value="">Select Teacher</option>
                          {teachersName.map(name => (
                            <option value={name}>{name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="teacher" className="ml-1 mb-1 block text-sm font-medium text-gray-700">
                        Teacher
                      </label>
                      <div className=" font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start  bg-white max-w-lg gap-2 p-2">

                        <input
                          type="text"
                          name="teacher"
                          id="teacher"
                          value={newEntry.teacher}
                          onChange={handleEntryChange}
                          className="focus:ring-primary-500 focus:border-primary-500  w-full  sm:text-sm border-gray-300 rounded-md outline-none"
                          placeholder="Teacher name"
                        />
                      </div>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={addEntry}
                        className="border p-2 rounded-lg text-[#152259] hover:bg-[#152259] hover:text-gray-200"
                      >
                        Add to Timetable
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetables;