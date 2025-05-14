import React, { useEffect, useState } from 'react';
import { 
  Search,  
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Mail,
  Phone
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Nodata from './Nodata';


// Type for teacher
interface Teacher {
  _id:string;
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  joinDate: string;
}

// Form type for adding/editing teachers
interface TeacherForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  qualification: string;
  joinDate: string;
}

// Empty form
const emptyForm: TeacherForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  qualification: '',
  joinDate: ''
};

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [form, setForm] = useState<TeacherForm>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const schoolID = localStorage.getItem("School ID")

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/teachers', {
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
        setTeachers(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
  
    fetchTeachers();
  }, [schoolID]);
  

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter(
    teacher => 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open modal for add/edit
  const openModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setForm({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        subject: teacher.subject,
        qualification: teacher.qualification,
        joinDate: teacher.joinDate
      });
    } else {
      setEditingTeacher(null);
      setForm(emptyForm);
    }
    setIsModalOpen(true);
  };

  // Close modal and reset
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
    setForm(emptyForm);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!form.name || !form.email || !form.subject) {
      toast.error('Please fill all required fields');
      return;
    }
  
    try {
      if (editingTeacher) {
        // Update existing teacher via PUT request
        const updatedTeacher = {
          schoolId: schoolID, // or get from token if backend sets it
          name: form.name,
          email: form.email,
          phone: form.phone || '',
          subject: form.subject,
          qualification: form.qualification || '',
          joinDate: form.joinDate || new Date().toISOString().split('T')[0],
        };
      
        const response = await fetch(`http://localhost:5000/api/teachers/${editingTeacher.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${schoolID}`, // if using Authorization header
          },
          body: JSON.stringify(updatedTeacher),
          credentials: 'include',
        });

      
        if (!response.ok) {
          throw new Error('Failed to update teacher');
        }
      
        const savedTeacher = await response.json();
        setTeachers(teachers.map(t => t.id === savedTeacher.id ? savedTeacher : t));
        toast.success('Teacher updated successfully');
      }
      else {
        // Add new teacher via API
        const newTeacher = {
          schoolId: schoolID,
          name: form.name,
          email: form.email,
          phone: form.phone || '',
          subject: form.subject,
          qualification: form.qualification || '',
          joinDate: form.joinDate || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
        };
  
        const response = await fetch('http://localhost:5000/api/teachers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(newTeacher),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add teacher');
        }
  
        const savedTeacher = await response.json();
        setTeachers([...teachers, savedTeacher]);
        toast.success('Teacher added successfully');
      }
  
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };
  

  // Delete teacher
  const deleteTeacher = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teachers/${id}`, {
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
      setTeachers(teachers.filter(t => t.id !== id));
      setDeleteConfirmId(null);
      toast.success('Teacher removed successfully');
    } catch (error) {
      console.error('Delete teacher error:', error);
      toast.error('Failed to delete teacher');
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

  return (
    <div className="animate-fade-in">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="ont-medium text-gray-500 text-[25px]">Teachers</h1>
          <p className="mt-1 font-medium text-gray-500 text-[18px]">
            Manage teacher information and details
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="border p-3 rounded-lg text-[#152259] hover:bg-[#152259] hover:text-gray-200"
        >
          Add Teacher
        </button>
      </div>

      {/* Search and filter */}
      <div className="mb-6 flex justify-between items-center">
        <div className=" font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start bg-white max-w-lg gap-2 p-2 w-[40%]">
          <div className="flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-primary-500 focus:border-primary-500  w-full  sm:text-sm border-gray-300 rounded-md outline-none"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> 
        <div className='font-medium text-gray-500 text-[18px]'>Total teachers - {teachers?.length}</div>
      </div>

      {/* Teachers List */}
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qualification
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                <Nodata name="Teachers" />

                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-1" />
                        {teacher.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="h-4 w-4 text-gray-400 mr-1" />
                        {teacher.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{teacher.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{teacher.qualification}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(teacher.joinDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {deleteConfirmId === teacher._id ? (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-xs text-gray-500">Confirm?</span>
                        <button
                          onClick={() => deleteTeacher(teacher._id)}
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
                          onClick={() => openModal(teacher)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(teacher._id)}
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
                        {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
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
                        
                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={form.email}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        
                        {/* Phone */}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
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
                        
                        {/* Subject */}
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="subject"
                            id="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        
                        {/* Qualification */}
                        <div>
                          <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                            Qualification
                          </label>
                          <input
                            type="text"
                            name="qualification"
                            id="qualification"
                            value={form.qualification}
                            onChange={handleChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        {/* Join Date */}
                        <div>
                          <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
                            Join Date
                          </label>
                          <input
                            type="date"
                            name="joinDate"
                            id="joinDate"
                            value={form.joinDate}
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
                    {editingTeacher ? 'Update' : 'Add'}
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

export default Teachers;