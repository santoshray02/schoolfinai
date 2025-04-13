'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, AlertTriangle, CreditCard } from 'lucide-react';
import { schoolConfig } from '@/lib/config';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  contactNumber: string | null;
  email: string | null;
  parentName: string | null;
  parentContact: string | null;
  class: string | null;
  section: string | null;
  admissionDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  feePayments: FeePayment[];
}

interface FeePayment {
  id: string;
  amount: number;
  dueDate: string;
  paymentDate: string | null;
  status: string;
  feeCategory: {
    id: string;
    name: string;
  };
}

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`/api/students/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }
        const data = await response.json();
        setStudent(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudent();
  }, [params.id]);
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/students/${params.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete student');
      }
      
      router.push('/students');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setShowDeleteModal(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href="/students" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Loading Student Details...</h1>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href="/students" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Error</h1>
          </div>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Link 
            href="/students"
            className="text-blue-600 hover:text-blue-800"
          >
            Return to Students List
          </Link>
        </div>
      </div>
    );
  }
  
  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href="/students" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Student Not Found</h1>
          </div>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">The requested student could not be found.</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Link 
            href="/students"
            className="text-blue-600 hover:text-blue-800"
          >
            Return to Students List
          </Link>
        </div>
      </div>
    );
  }
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Calculate age if date of birth is available
  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  // Calculate fee statistics
  const totalFees = student.feePayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidFees = student.feePayments
    .filter(payment => payment.status === 'PAID')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingFees = student.feePayments
    .filter(payment => payment.status === 'PENDING' || payment.status === 'PARTIAL')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const overdueFees = student.feePayments
    .filter(payment => payment.status === 'OVERDUE')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/students" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Student Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/fees/student/${student.id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Manage Fees
          </Link>
          <Link
            href={`/students/${student.id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Edit className="mr-2 h-5 w-5" />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            Delete
          </button>
        </div>
      </div>
      
      {/* Student Status Badge */}
      <div className="mb-6">
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
          ${student.status === 'Active' ? 'bg-green-100 text-green-800' : 
            student.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
            student.status === 'Graduated' ? 'bg-blue-100 text-blue-800' : 
            'bg-yellow-100 text-yellow-800'}`}>
          {student.status}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
          </div>
          <div className="p-6">
            <dl>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">Student ID</dt>
                <dd className="mt-1 text-lg text-gray-900">{student.studentId}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-lg text-gray-900">{student.firstName} {student.lastName}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                <dd className="mt-1 text-lg text-gray-900">{formatDate(student.dateOfBirth)}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd className="mt-1 text-lg text-gray-900">{calculateAge(student.dateOfBirth)}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="mt-1 text-lg text-gray-900">{student.gender || 'N/A'}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-lg text-gray-900">{student.address || 'N/A'}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Academic Information */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Academic Information</h2>
          </div>
          <div className="p-6">
            <dl>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">Class</dt>
                <dd className="mt-1 text-lg text-gray-900">{student.class || 'N/A'}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">Section</dt>
                <dd className="mt-1 text-lg text-gray-900">{student.section || 'N/A'}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">Admission Date</dt>
                <dd className="mt-1 text-lg text-gray-900">{formatDate(student.admissionDate)}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-lg text-gray-900">{student.email || 'N/A'}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                <dd className="mt-1 text-lg text-gray-900">{student.contactNumber || 'N/A'}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Parent/Guardian Information */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Parent/Guardian Information</h2>
          </div>
          <div className="p-6">
            <dl>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">Parent/Guardian Name</dt>
                <dd className="mt-1 text-lg text-gray-900">{student.parentName || 'N/A'}</dd>
              </div>
              <div className="mb-4">
                <dt className="text-sm font-medium text-gray-500">Parent/Guardian Contact</dt>
                <dd className="mt-1 text-lg text-gray-900">{student.parentContact || 'N/A'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      
      {/* Fee Summary */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Fee Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Fees</h3>
            <p className="text-3xl font-bold text-blue-600">${totalFees.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Paid</h3>
            <p className="text-3xl font-bold text-green-600">${paidFees.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">${pendingFees.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Overdue</h3>
            <p className="text-3xl font-bold text-red-600">${overdueFees.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      {/* Recent Fee Payments */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Fee Payments</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {student.feePayments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No fee payments found
                    </td>
                  </tr>
                ) : (
                  student.feePayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.feeCategory.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paymentDate ? formatDate(payment.paymentDate) : 'Not paid'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${payment.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                            payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                            payment.status === 'PARTIAL' ? 'bg-blue-100 text-blue-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Student</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this student? This action cannot be undone.
                        All data associated with this student will be permanently removed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
