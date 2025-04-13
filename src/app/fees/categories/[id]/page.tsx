'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { schoolConfig } from '@/lib/config';

interface FeeCategory {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  frequency: string;
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
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
  };
}

export default function FeeCategoryDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [feeCategory, setFeeCategory] = useState<FeeCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  useEffect(() => {
    const fetchFeeCategory = async () => {
      try {
        const response = await fetch(`/api/fees/categories/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch fee category details');
        }
        const data = await response.json();
        setFeeCategory(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeeCategory();
  }, [params.id]);
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/fees/categories/${params.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete fee category');
      }
      
      router.push('/fees');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setShowDeleteModal(false);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href="/fees" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Loading Fee Category Details...</h1>
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
            <Link href="/fees" className="mr-4">
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
            href="/fees"
            className="text-blue-600 hover:text-blue-800"
          >
            Return to Fee Categories
          </Link>
        </div>
      </div>
    );
  }
  
  if (!feeCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href="/fees" className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Fee Category Not Found</h1>
          </div>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">The requested fee category could not be found.</p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Link 
            href="/fees"
            className="text-blue-600 hover:text-blue-800"
          >
            Return to Fee Categories
          </Link>
        </div>
      </div>
    );
  }
  
  // Calculate payment statistics
  const totalPayments = feeCategory.feePayments.length;
  const paidPayments = feeCategory.feePayments.filter(payment => payment.status === 'PAID').length;
  const pendingPayments = feeCategory.feePayments.filter(payment => payment.status === 'PENDING' || payment.status === 'PARTIAL').length;
  const overduePayments = feeCategory.feePayments.filter(payment => payment.status === 'OVERDUE').length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/fees" className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Fee Category Details</h1>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/fees/categories/${feeCategory.id}/edit`}
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
      
      {/* Fee Category Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">Fee Category Information</h2>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-lg text-gray-900">{feeCategory.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Amount</dt>
              <dd className="mt-1 text-lg text-gray-900 font-semibold text-blue-600">{formatCurrency(feeCategory.amount)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Frequency</dt>
              <dd className="mt-1">
                <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                  ${feeCategory.frequency === 'Monthly' ? 'bg-blue-100 text-blue-800' : 
                    feeCategory.frequency === 'Quarterly' ? 'bg-purple-100 text-purple-800' : 
                    feeCategory.frequency === 'Annually' ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {feeCategory.frequency}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-lg text-gray-900">{formatDate(feeCategory.createdAt)}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-lg text-gray-900">{feeCategory.description || 'No description provided.'}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Payments</h3>
          <p className="text-3xl font-bold text-blue-600">{totalPayments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Paid</h3>
          <p className="text-3xl font-bold text-green-600">{paidPayments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingPayments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Overdue</h3>
          <p className="text-3xl font-bold text-red-600">{overduePayments}</p>
        </div>
      </div>
      
      {/* Associated Payments */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Associated Payments</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
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
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feeCategory.feePayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No payments found for this fee category.
                    </td>
                  </tr>
                ) : (
                  feeCategory.feePayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.student.firstName} {payment.student.lastName} ({payment.student.studentId})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(payment.amount)}
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/fees/payments/${payment.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Fee Category</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this fee category? This action cannot be undone.
                        {feeCategory.feePayments.length > 0 && (
                          <span className="block mt-2 font-semibold">
                            Warning: This fee category has {feeCategory.feePayments.length} associated payments.
                            Deleting it may cause data inconsistencies.
                          </span>
                        )}
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
