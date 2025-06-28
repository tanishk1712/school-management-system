import React, { useState, useEffect } from 'react';
import {
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  ClipboardList,
  Calendar,
  Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import Nodata from './Nodata'
import { BASE_URL } from '../../services/authService';
import Loader from './Loader';

// Type for exam
interface Exam {
  id?: string;
  examID?: string;
  _id?: string;
  name: string;
  subject: string;
  class: string;
  section: string;
  date: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
}

// Form type for adding/editing exams
interface ExamForm {
  name: string;
  subject: string;
  class: string;
  section: string;
  date: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
}

// Available classes, sections and subjects
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
  'Computer Science'
];



// Empty form
const emptyForm: ExamForm = {
  name: '',
  subject: '',
  class: '',
  section: '',
  date: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '11:00',
  totalMarks: 100
};

const Exams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('');
  const [filterSubject, setFilterSubject] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [form, setForm] = useState<ExamForm>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const schoolID = localStorage.getItem("School ID");

  // Fetch exams on component mount
  useEffect(() => {
    fetchExams();
  }, []);

  // Fetch all exams from API
  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/exams`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch exams');
      }

      const data = await response.json();
      setExams(data);
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('Failed to load exams. Using mock data instead.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter exams based on search term and filters
  const filteredExams = exams.filter(
    exam =>
      (exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterClass === '' || exam.class === filterClass) &&
      (filterSubject === '' || exam.subject === filterSubject)
  );

  // Open modal for add/edit
  const openModal = (exam?: Exam) => {
    if (exam) {
      setEditingExam(exam);
      setForm({
        name: exam.name,
        subject: exam.subject,
        class: exam.class,
        section: exam.section,
        date: exam.date,
        startTime: exam.startTime,
        endTime: exam.endTime,
        totalMarks: exam.totalMarks
      });
    } else {
      setEditingExam(null);
      setForm(emptyForm);
    }
    setIsModalOpen(true);
  };

  // Close modal and reset
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExam(null);
    setForm(emptyForm);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'totalMarks' ? parseInt(value) : value
    }));
  };

  // Get exam ID for API calls
  const getExamId = (exam: Exam) => {
    return exam.examID || exam._id || exam.id;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.subject || !form.class || !form.section || !form.date || !form.startTime || !form.endTime) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setIsLoading(true);

      const examData = {
        name: form.name,
        subject: form.subject,
        class: form.class,
        section: form.section,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        totalMarks: form.totalMarks
      };

      if (editingExam) {
        // Update existing exam
        const examId = getExamId(editingExam);
        const response = await fetch(`${BASE_URL}/api/exams/${examId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${schoolID}`,
          },
          credentials: 'include',
          body: JSON.stringify(examData),
        });

        if (!response.ok) {
          throw new Error('Failed to update exam');
        }

        const updatedExam = await response.json();

        // Update exams state with updated exam
        setExams(exams.map(e =>
          (e.id === examId || e._id === examId || e.examID === examId)
            ? { ...e, ...updatedExam }
            : e
        ));

        toast.success('Exam updated successfully');
      } else {
        // Add new exam
        const response = await fetch('http://localhost:5000/api/exams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${schoolID}`,
          },
          credentials: 'include',
          body: JSON.stringify(examData),
        });

        if (!response.ok) {
          throw new Error('Failed to add exam');
        }

        const savedExam = await response.json();
        setExams([...exams, savedExam]);
        toast.success('Exam added successfully');
      }
    } catch (error) {
      console.error('Error saving exam:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      closeModal();
    }
  };

  // Delete exam
  const deleteExam = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}/api/exams/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete exam');
      }

      // Remove from state
      setExams(exams.filter(e => e.id !== id && e._id !== id && e.examID !== id));
      setDeleteConfirmId(null);
      toast.success('Exam removed successfully');
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterClass('');
    setFilterSubject('');
  };

  return (
    <div className="animate-fade-in">

      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="font-medium text-gray-500 text-[25px]">Exams</h1>
          <p className="mt-1 font-medium text-gray-500 text-[18px]">
            Schedule and manage exams for different classes
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="border p-3 rounded-lg text-[#152259] hover:bg-[#152259] hover:text-gray-200"
          disabled={isLoading}
        >
          Schedule Exam
        </button>
      </div>

      {/* Search and filters */}
      <div className="mb-6 flex gap-4 justify-between items-center">
        <div className='flex justify-start gap-4'>
          <div className="flex flex-col justify-between items-center">
            <div className="font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start h-full bg-white max-w-lg gap-2 p-2">
              <div className="flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-primary-500 focus:border-primary-500 w-full sm:text-sm border-gray-300 rounded-md outline-none"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className='font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start bg-white max-w-lg gap-2 p-2'>
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

          <div className='font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start bg-white max-w-lg gap-2 p-2'>
            <select
              className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm bg-white outline-none"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {availableSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={resetFilters}
              className="border p-2 rounded-lg text-[#152259] hover:bg-[#152259] hover:text-gray-200"
              disabled={isLoading}
            >
              Reset
            </button>
          </div>
        </div>
        <div className='font-medium text-gray-500 text-[18px]'>Total exams - {exams?.length}</div>
      </div>
      {/* Exams List */}
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exam Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject & Class
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Marks
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
            ) : filteredExams.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  <Nodata name="Exams" />
                </td>
              </tr>
            ) : (
              filteredExams.map((exam) => (
                <tr key={exam.id || exam._id || exam.examID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ClipboardList className="h-5 w-5 text-primary-500 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{exam.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{exam.subject}</div>
                    <div className="text-sm text-gray-500">Class {exam.class}-{exam.section}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      {formatDate(exam.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      {exam.startTime} - {exam.endTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{exam.totalMarks} marks</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {deleteConfirmId === getExamId(exam) ? (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-xs text-gray-500">Confirm?</span>
                        <button
                          onClick={() => deleteExam(getExamId(exam))}
                          className="text-white bg-red-600 hover:bg-red-700 p-1 rounded"
                          title="Confirm delete"
                          disabled={isLoading}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded bg-gray-200 hover:bg-gray-300"
                          title="Cancel"
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal(exam)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                          disabled={isLoading}
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(getExamId(exam))}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          disabled={isLoading}
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

      {/* Add/Edit Modal */}
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
                        {editingExam ? 'Edit Exam' : 'Schedule New Exam'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        {/* Exam Name */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Exam Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={form.name}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>

                        {/* Subject */}
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="subject"
                            id="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          >
                            {availableSubjects.map(subject => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
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

                        {/* Date */}
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="date"
                            id="date"
                            value={form.date}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>

                        {/* Start and End Time */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                              Start Time <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="time"
                              name="startTime"
                              id="startTime"
                              value={form.startTime}
                              onChange={handleChange}
                              className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                              End Time <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="time"
                              name="endTime"
                              id="endTime"
                              value={form.endTime}
                              onChange={handleChange}
                              className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              required
                            />
                          </div>
                        </div>

                        {/* Total Marks */}
                        <div>
                          <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700">
                            Total Marks <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="totalMarks"
                            id="totalMarks"
                            min="0"
                            value={form.totalMarks}
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
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : (editingExam ? 'Update' : 'Schedule')}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeModal}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;