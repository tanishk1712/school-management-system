import React, { useEffect, useState } from 'react';
import {
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Bookmark,
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Nodata from './Nodata';


// Available classes and sections
const availableClasses = ['8', '9', '10', '11', '12'];
const availableSections = ['A', 'B', 'C', 'D'];

// Type for student
interface Student {
  _id?: string;
  id?: string;
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  parentName: string;
  email: string;
  phone: string;
  address: string;
  admissionDate: string;
}

// Form type for adding/editing students
interface StudentForm {
  name: string;
  rollNumber: string;
  class: string;
  section: string;
  parentName: string;
  email: string;
  phone: string;
  address: string;
  admissionDate: string;
}

// Empty form
const emptyForm: StudentForm = {
  name: '',
  rollNumber: '',
  class: '',
  section: '',
  parentName: '',
  email: '',
  phone: '',
  address: '',
  admissionDate: new Date().toISOString().split('T')[0]
};

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('');
  const [filterSection, setFilterSection] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<StudentForm>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const schoolID = localStorage.getItem("School ID")

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/students', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${schoolID}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [schoolID]);


  // Filter students based on search term and filters
  const filteredStudents = students.filter(
    student =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterClass === '' || student.class === filterClass) &&
      (filterSection === '' || student.section === filterSection)
  );

  // Open modal for add/edit
  const openModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setForm({
        name: student.name,
        rollNumber: student.rollNumber,
        class: student.class,
        section: student.section,
        parentName: student.parentName,
        email: student.email,
        phone: student.phone,
        address: student.address,
        admissionDate: student.admissionDate
      });
    } else {
      setEditingStudent(null);
      // Generate a new roll number
      const lastRollNumber = students.length > 0
        ? students.reduce((max, student) => {
          const num = parseInt(student.rollNumber.replace(/\D/g, ''));
          return num > max ? num : max;
        }, 0)
        : 0;
      setForm({
        ...emptyForm,
        rollNumber: `STU${(lastRollNumber + 1).toString().padStart(3, '0')}`
      });
    }
    setIsModalOpen(true);
  };

  // Close modal and reset
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setForm(emptyForm);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.rollNumber || !form.class || !form.section) {
      toast.error('Please fill all required fields');
      return;
    }

    const studentData = {
      schoolId: schoolID,
      name: form.name,
      rollNumber: form.rollNumber,
      class: form.class,
      section: form.section,
      parentName: form.parentName,
      email: form.email,
      phone: form.phone || '',
      address: form.address || '',
      admissionDate: form.admissionDate ? new Date(form.admissionDate) : new Date(),
    };

    try {
      if (editingStudent) {
        // Get the correct ID to use (MongoDB uses _id)
        const studentId = editingStudent._id || editingStudent.id;

        // Update existing student
        const response = await fetch(`http://localhost:5000/api/students/${studentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${schoolID}`,
          },
          credentials: 'include',
          body: JSON.stringify(studentData),
        });

        if (!response.ok) {
          throw new Error('Failed to update student');
        }

        const updatedStudent = await response.json();

        // Update the students state, handling both id and _id cases
        setStudents(prevStudents =>
          prevStudents.map(s => {
            // Check both id and _id for matching
            if ((s.id && s.id === studentId) || (s._id && s._id === studentId)) {
              return updatedStudent;
            }
            return s;
          })
        );

        toast.success('Student updated successfully');
      } else {
        // Add new student
        const response = await fetch('http://localhost:5000/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${schoolID}`,
          },
          credentials: 'include',
          body: JSON.stringify(studentData),
        });

        if (!response.ok) {
          throw new Error('Failed to add student');
        }

        const newStudent = await response.json();
        setStudents([...students, newStudent]);
        toast.success('Student added successfully');
      }

      closeModal();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Delete student
  const deleteStudent = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${schoolID}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete student');
      }

      // Remove from state using either _id or id
      setStudents(students.filter(s => s.id !== id && s._id !== id));
      setDeleteConfirmId(null);
      toast.success('Student removed successfully');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterClass('');
    setFilterSection('');
  };

  // Get student ID (handles both id and _id for MongoDB compatibility)
  const getStudentId = (student: Student): string => {
    return student._id || student.id || '';
  };

  return (
    <div className="animate-fade-in">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="ont-medium text-gray-500 text-[25px]">Students</h1>
          <p className="mt-1 font-medium text-gray-500 text-[18px]">
            Manage student information and records
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="border p-3 rounded-lg text-[#152259] hover:bg-[#152259] hover:text-gray-200"
        >
          Add Student
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
                placeholder="Search students..."
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

          <div className=' font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start bg-white max-w-lg gap-2 p-2'>
            <select
              className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm bg-white outline-none"
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
            >
              <option value="">All Sections</option>
              {availableSections.map(section => (
                <option key={section} value={section}>Section {section}</option>
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
        <div className='font-medium text-gray-500 text-[18px]'>Total students - {students?.length}</div>
      </div>

      {/* Students List */}
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class & Roll No
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admission Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                <Nodata name="Students" />

                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={getStudentId(student)} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Bookmark className="h-4 w-4 text-primary-500 mr-1" />
                        Class {student.class || "--"}-{student.section || "--"}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Roll No: {student.rollNumber || "--"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-1" />
                        {student.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="h-4 w-4 text-gray-400 mr-1" />
                        {student.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.parentName ? student.parentName : "--"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(student.admissionDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {deleteConfirmId === getStudentId(student) ? (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-xs text-gray-500">Confirm?</span>
                        <button
                          onClick={() => deleteStudent(getStudentId(student))}
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
                          onClick={() => openModal(student)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(getStudentId(student))}
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
                        {editingStudent ? 'Edit Student' : 'Add New Student'}
                      </h3>
                      <div className="mt-4 space-y-4">
                        {/* Name */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name <span className="text-red-500">*</span>
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

                        {/* Roll Number */}
                        <div>
                          <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">
                            Roll Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="rollNumber"
                            id="rollNumber"
                            value={form.rollNumber}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
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

                        {/* Parent Name */}
                        <div>
                          <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
                            Parent Name
                          </label>
                          <input
                            type="text"
                            name="parentName"
                            id="parentName"
                            value={form.parentName}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={form.email}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone
                          </label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        {/* Address */}
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                          </label>
                          <textarea
                            name="address"
                            id="address"
                            rows={3}
                            value={form.address}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>

                        {/* Admission Date */}
                        <div>
                          <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700">
                            Admission Date
                          </label>
                          <input
                            type="date"
                            name="admissionDate"
                            id="admissionDate"
                            value={form.admissionDate}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                    {editingStudent ? 'Update' : 'Add'}
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
    </div>
  );
};

export default Students;