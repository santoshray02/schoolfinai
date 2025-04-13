'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Filter, Download } from 'lucide-react';
import { schoolConfig } from '@/lib/config';

interface FeeCategory {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  frequency: string;
  createdAt: string;
  updatedAt: string;
}

export default function FeesPage() {
  const [feeCategories, setFeeCategories] = useState<FeeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFrequency, setFilterFrequency] = useState('All');

  useEffect(() => {
    // Fetch fee categories
    const fetchFeeCategories = async () => {
      try {
        const response = await fetch('/api/fees/categories');
        if (response.ok) {
          const data = await response.json();
          setFeeCategories(data);
        } else {
          console.error('Failed to fetch fee categories');
        }
      } catch (error) {
        console.error('Error fetching fee categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeCategories();
  }, []);

  // Filter and search fee categories
  const filteredFeeCategories = feeCategories.filter((category) => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterFrequency === 'All' || category.frequency === filterFrequency;
    
    return matchesSearch && matchesFilter;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Fee Management</h1>
        <div className="flex space-x-2">
          <Link 
            href="/fees/categories/add" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Fee Category
          </Link>
          <Link 
            href="/fees/payments/add" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Fee Payment
          </Link>
        </div>
      </div>

      {/* Fee Categories Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Fee Categories</h2>
        
        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search fee categories..."
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterFrequency}
                onChange={(e) => setFilterFrequency(e.target.value)}
              >
                <option value="All">All Frequencies</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
                <option value="One-time">One-time</option>
              </select>
            </div>
            
            <button 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center"
              title="Export Fee Categories"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Fee Categories Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading fee categories...
                    </td>
                  </tr>
                ) : filteredFeeCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No fee categories found. {searchTerm && 'Try a different search term.'}
                    </td>
                  </tr>
                ) : (
                  filteredFeeCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {category.description || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(category.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${category.frequency === 'Monthly' ? 'bg-blue-100 text-blue-800' : 
                            category.frequency === 'Quarterly' ? 'bg-purple-100 text-purple-800' : 
                            category.frequency === 'Annually' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {category.frequency}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/fees/categories/${category.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                          View
                        </Link>
                        <Link href={`/fees/categories/${category.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                          Edit
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

      {/* Recent Fee Payments Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Recent Fee Payments</h2>
          <Link href="/fees/payments" className="text-blue-600 hover:text-blue-800">
            View All Payments
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-center">
            Recent fee payment data will be displayed here.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Fee Categories</h3>
          <p className="text-3xl font-bold text-blue-600">{feeCategories.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Collections</h3>
          <p className="text-3xl font-bold text-green-600">$0.00</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Pending Payments</h3>
          <p className="text-3xl font-bold text-yellow-600">$0.00</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Overdue Payments</h3>
          <p className="text-3xl font-bold text-red-600">$0.00</p>
        </div>
      </div>
    </div>
  );
}
