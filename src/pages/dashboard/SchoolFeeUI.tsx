/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Calendar, DollarSign, Users, AlertCircle, Download, FileText, MessageSquare } from 'lucide-react';
import Nodata from './Nodata';
import { BASE_URL } from '../../services/authService';
import Loader from './Loader';

type FeeStatus = 'PENDING' | 'PAID' | 'OVERDUE';
type FeeType = 'TUITION' | 'TRANSPORT' | 'LIBRARY' | 'LABORATORY' | 'SPORTS' | 'OTHER';

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

interface Fee {
    _id: string;
    studentId: Student;
    amount: number;
    type: FeeType;
    month: string;
    year: number;
    dueDate: string;
    description?: string;
    status: FeeStatus;
    paidDate?: string;
    createdAt: string;
}

const SchoolFeeManagement: React.FC = () => {
    const [fees, setFees] = useState<Fee[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<FeeStatus | 'ALL'>('ALL');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [newFee, setNewFee] = useState({
        studentId: '',
        amount: '',
        type: 'TUITION' as FeeType,
        month: '',
        year: new Date().getFullYear(),
        dueDate: '',
        description: ''
    });

    const schoolID = localStorage.getItem("School ID");

    const fetchStudents = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/students`, {
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
            setError('Failed to fetch students');
        }
    }, [schoolID]);

    const fetchFees = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/fees`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${schoolID}`,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch fees');
            }

            const data = await response.json();
            setFees(data);
        } catch (error) {
            console.error('Error fetching fees:', error);
            setError('Failed to fetch fees');
        }
    }, [schoolID]);

    useEffect(() => {
        const loadData = async () => {
            if (!schoolID) {
                setError('School ID not found');
                return;
            }

            setIsLoading(true);
            setError('');

            try {
                await Promise.all([fetchStudents(), fetchFees()]);
            } catch (error) {
                console.error('Error loading data:', error);
                setError('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [schoolID, fetchStudents, fetchFees]);

    const filteredFees = fees.filter(fee => {
        if (!fee.studentId) return false;

        const matchesSearch = fee.studentId.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fee.studentId.rollNumber?.includes(searchTerm);
        const matchesStatus = statusFilter === 'ALL' || fee.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalCollected = fees.filter(f => f.status === 'PAID').reduce((sum, f) => sum + f.amount, 0);
    const totalPending = fees.filter(f => f.status === 'PENDING').reduce((sum, f) => sum + f.amount, 0);
    const totalOverdue = fees.filter(f => f.status === 'OVERDUE').reduce((sum, f) => sum + f.amount, 0);

    const resetForm = () => {
        setNewFee({
            studentId: '',
            amount: '',
            type: 'TUITION',
            month: '',
            year: new Date().getFullYear(),
            dueDate: '',
            description: ''
        });
    };

    const handleCreateFee = async () => {
        if (!newFee.studentId || !newFee.amount || !newFee.month || !newFee.dueDate) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${BASE_URL}/api/fees`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${schoolID}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    studentId: newFee.studentId,
                    amount: parseFloat(newFee.amount),
                    type: newFee.type,
                    month: newFee.month,
                    year: newFee.year,
                    dueDate: newFee.dueDate,
                    description: newFee.description,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create fee record');
            }

            setShowAddModal(false);
            resetForm();

            await fetchFees();

        } catch (error) {
            console.error('Error creating fee:', error);
            setError('Failed to create fee record');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStatus = async (feeId: string, status: FeeStatus) => {
        try {
            const response = await fetch(`${BASE_URL}/api/fees/${feeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${schoolID}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    status,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update fee status');
            }

            // Refresh fees data
            await fetchFees();

        } catch (error) {
            console.error('Error updating fee status:', error);
            setError('Failed to update fee status');
        }
    };

    // Handle delete fee with API call
    const handleDeleteFee = async (feeId: string) => {
        if (!window.confirm('Are you sure you want to delete this fee record?')) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/fees/${feeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${schoolID}`,
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete fee record');
            }

            // Refresh fees data
            await fetchFees();

        } catch (error) {
            console.error('Error deleting fee:', error);
            setError('Failed to delete fee record');
        }
    };

    const generatePDF = (fee: Fee) => {
        // Create PDF content
        const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Fee Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .school-name { font-size: 24px; font-weight: bold; color: #333; }
          .receipt-title { font-size: 18px; margin-top: 10px; }
          .receipt-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .student-info, .fee-info { width: 48%; }
          .info-row { margin-bottom: 10px; }
          .label { font-weight: bold; display: inline-block; width: 120px; }
          .amount-section { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .total-amount { font-size: 24px; font-weight: bold; text-align: center; color: #28a745; }
          .status-badge { padding: 8px 16px; border-radius: 20px; font-weight: bold; text-align: center; margin: 10px 0; }
          .status-paid { background: #d4edda; color: #155724; }
          .status-pending { background: #fff3cd; color: #856404; }
          .status-overdue { background: #f8d7da; color: #721c24; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
          .signature { margin-top: 40px; text-align: right; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school-name">Bright Future School</div>
          <div class="receipt-title">Fee Receipt</div>
        </div>
        
        <div class="receipt-info">
          <div class="student-info">
            <h3>Student Information</h3>
            <div class="info-row">
              <span class="label">Name:</span>
              <span>${fee.studentId.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Roll Number:</span>
              <span>${fee.studentId.rollNumber}</span>
            </div>
            <div class="info-row">
              <span class="label">Class:</span>
              <span>${fee.studentId.class} - ${fee.studentId.section}</span>
            </div>
          </div>
          
          <div class="fee-info">
            <h3>Fee Information</h3>
            <div class="info-row">
              <span class="label">Receipt No:</span>
              <span>RCP-${fee._id.slice(-6).toUpperCase()}</span>
            </div>
            <div class="info-row">
              <span class="label">Date:</span>
              <span>${new Date().toLocaleDateString()}</span>
            </div>
            <div class="info-row">
              <span class="label">Period:</span>
              <span>${fee.month} ${fee.year}</span>
            </div>
          </div>
        </div>
        
        <div class="amount-section">
          <div class="info-row">
            <span class="label">Fee Type:</span>
            <span>${fee.type}</span>
          </div>
          <div class="info-row">
            <span class="label">Amount:</span>
            <span>₹${fee.amount.toLocaleString()}</span>
          </div>
          <div class="info-row">
            <span class="label">Due Date:</span>
            <span>${new Date(fee.dueDate).toLocaleDateString()}</span>
          </div>
          ${fee.description ? `<div class="info-row"><span class="label">Description:</span><span>${fee.description}</span></div>` : ''}
          ${fee.paidDate ? `<div class="info-row"><span class="label">Paid Date:</span><span>${new Date(fee.paidDate).toLocaleDateString()}</span></div>` : ''}
          
          <div class="status-badge status-${fee.status.toLowerCase()}">
            Status: ${fee.status}
          </div>
          
          <div class="total-amount">
            Total Amount: ₹${fee.amount.toLocaleString()}
          </div>
        </div>
        
        <div class="signature">
          <div style="border-top: 1px solid #333; width: 200px; margin-left: auto; padding-top: 10px;">
            Authorized Signature
          </div>
        </div>
        
        <div class="footer">
          <p>This is a computer-generated receipt. For queries, contact the school office.</p>
          <p>School Address: 123 Education Street, Knowledge City | Phone: +91-XXXXXXXXXX</p>
        </div>
      </body>
      </html>
    `;

        // Create a new window and print
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(pdfContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    const generateMessage = (fee: Fee): string => {
        const studentName = fee.studentId?.name || 'Student';
        const amount = fee.amount.toLocaleString();
        const dueDate = new Date(fee.dueDate).toLocaleDateString();
        const period = `${fee.month} ${fee.year}`;

        switch (fee.status) {
            case 'PAID':
                return `Dear Parent/Guardian,

We acknowledge the receipt of fee payment for ${studentName}.

Payment Details:
- Student: ${studentName} (${fee.studentId?.class}-${fee.studentId?.section})
- Fee Type: ${fee.type}
- Amount: ₹${amount}
- Period: ${period}
- Payment Date: ${fee.paidDate ? new Date(fee.paidDate).toLocaleDateString() : 'N/A'}

Thank you for your timely payment. Your child's education continues uninterrupted.

Best regards,
Bright Future School
Contact: +91-XXXXXXXXXX`;

            case 'PENDING':
                return `Dear Parent/Guardian,

This is a gentle reminder regarding the pending fee payment for ${studentName}.

Payment Details:
- Student: ${studentName} (${fee.studentId?.class}-${fee.studentId?.section})
- Fee Type: ${fee.type}
- Amount: ₹${amount}
- Period: ${period}
- Due Date: ${dueDate}

Please ensure timely payment to avoid any inconvenience. You can pay online or visit the school office during working hours.

For any queries, please contact the school office.

Best regards,
Bright Future School
Contact: +91-XXXXXXXXXX`;

            case 'OVERDUE':
                return `Dear Parent/Guardian,

URGENT: Fee payment is overdue for ${studentName}.

Payment Details:
- Student: ${studentName} (${fee.studentId?.class}-${fee.studentId?.section})
- Fee Type: ${fee.type}
- Amount: ₹${amount}
- Period: ${period}
- Due Date: ${dueDate} (OVERDUE)

Immediate payment is required to avoid any disruption in your child's academic activities. Please contact the school office immediately to resolve this matter.

Late fees may apply for overdue payments.

Urgent regards,
Bright Future School
Contact: +91-XXXXXXXXXX`;

            default:
                return `Dear Parent/Guardian,

Fee notification for ${studentName}.

Payment Details:
- Student: ${studentName} (${fee.studentId?.class}-${fee.studentId?.section})
- Fee Type: ${fee.type}
- Amount: ₹${amount}
- Period: ${period}

Please contact the school office for more information.

Best regards,
Bright Future School`;
        }
    };

    const handleShowMessage = (fee: Fee) => {
        setSelectedFee(fee);
        setShowMessageModal(true);
    };

    const copyMessageToClipboard = (message: string) => {
        navigator.clipboard.writeText(message).then(() => {
            alert('Message copied to clipboard!');
        });
    };

    const getStatusColor = (status: FeeStatus) => {
        switch (status) {
            case 'PAID': return 'bg-green-100 text-green-800 border-green-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'OVERDUE': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto space-y-6">
                <div className="">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 className="font-medium text-gray-500 text-[25px]">Fee Management</h1>
                            <p className="mt-1 font-medium text-gray-500 text-[18px]">Manage student fees and payments</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="border p-3 rounded-lg text-[#152259] hover:bg-[#152259] hover:text-gray-200 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Add Fee
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Collected</p>
                                <p className="text-2xl font-bold text-green-600">₹{totalCollected.toLocaleString()}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <DollarSign className="text-green-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Fees</p>
                                <p className="text-2xl font-bold text-yellow-600">₹{totalPending.toLocaleString()}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <Calendar className="text-yellow-600" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Overdue Fees</p>
                                <p className="text-2xl font-bold text-red-600">₹{totalOverdue.toLocaleString()}</p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-full">
                                <AlertCircle className="text-red-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="px-1 py-3">
                    <div className="flex flex-col justify-between sm:flex-row gap-4 items-center">
                        <div className="font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start h-full bg-white w-full gap-2 p-2">
                            <div className="flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by student name or roll number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="focus:ring-primary-500 focus:border-primary-500 w-full sm:text-sm border-gray-300 rounded-md outline-none"
                                disabled={isLoading}
                            />
                        </div>
                        <div className='font-medium text-gray-500 text-[18px] rounded-md shadow-sm flex justify-start bg-white max-w-lg min-w-fit gap-2 p-2'>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as FeeStatus | 'ALL')}
                                className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm bg-white outline-none"
                                disabled={isLoading}
                            >
                                <option value="ALL">All Status</option>
                                <option value="PAID">Paid</option>
                                <option value="PENDING">Pending</option>
                                <option value="OVERDUE">Overdue</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Fee Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-40 px-6">
                                            <Loader />
                                        </td>
                                    </tr>
                                ) : filteredFees.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                            <Nodata name="Student's fees" />
                                        </td>
                                    </tr>
                                ) : (
                                    filteredFees.map((fee) => (
                                        <tr key={fee._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{fee.studentId?.name || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{fee.studentId?.class} - {fee.studentId?.section} | Roll: {fee.studentId?.rollNumber}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{fee.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fee.month} {fee.year}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(fee.dueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={fee.status}
                                                    onChange={(e) => handleUpdateStatus(fee._id, e.target.value as FeeStatus)}
                                                    className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(fee.status)}`}
                                                    disabled={isLoading}
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PAID">Paid</option>
                                                    <option value="OVERDUE">Overdue</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => generatePDF(fee)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors flex items-center gap-1"
                                                        title="Download Receipt"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleShowMessage(fee)}
                                                        className="text-green-600 hover:text-green-900 transition-colors flex items-center gap-1"
                                                        title="View Message"
                                                    >
                                                        <MessageSquare size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteFee(fee._id)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                        title="Delete Fee"
                                                        disabled={isLoading}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Fee Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Add New Fee</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                                    <select
                                        value={newFee.studentId}
                                        onChange={(e) => setNewFee({ ...newFee, studentId: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={isSubmitting}
                                    >
                                        <option value="">Select Student</option>
                                        {students.map(student => (
                                            <option key={student._id} value={student._id}>
                                                {student.name} - {student.class} {student.section}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                                    <select
                                        value={newFee.type}
                                        onChange={(e) => setNewFee({ ...newFee, type: e.target.value as FeeType })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={isSubmitting}
                                    >
                                        <option value="TUITION">Tuition</option>
                                        <option value="TRANSPORT">Transport</option>
                                        <option value="LIBRARY">Library</option>
                                        <option value="LABORATORY">Laboratory</option>
                                        <option value="SPORTS">Sports</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={newFee.amount}
                                        onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter amount"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                                        <input
                                            type="text"
                                            value={newFee.month}
                                            onChange={(e) => setNewFee({ ...newFee, month: e.target.value })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., June"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                        <input
                                            type="number"
                                            value={newFee.year}
                                            onChange={(e) => setNewFee({ ...newFee, year: parseInt(e.target.value) })}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={newFee.dueDate}
                                        onChange={(e) => setNewFee({ ...newFee, dueDate: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                    <textarea
                                        value={newFee.description}
                                        onChange={(e) => setNewFee({ ...newFee, description: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="Additional notes..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateFee}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Create Fee
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Message Modal */}
                {showMessageModal && selectedFee && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Fee Message - {selectedFee.studentId.name}</h2>
                                <button
                                    onClick={() => setShowMessageModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText size={16} className="text-blue-600" />
                                    <span className="font-medium">Fee Status: </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedFee.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                        selectedFee.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {selectedFee.status}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Amount: ₹{selectedFee.amount.toLocaleString()} | Period: {selectedFee.month} {selectedFee.year}
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                                    {generateMessage(selectedFee)}
                                </pre>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowMessageModal(false)}
                                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => copyMessageToClipboard(generateMessage(selectedFee))}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Copy Message
                                </button>
                                <button
                                    onClick={() => generatePDF(selectedFee)}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download size={16} />
                                    Download Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchoolFeeManagement;