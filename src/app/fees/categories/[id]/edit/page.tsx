'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X } from 'lucide-react';
import { schoolConfig } from '@/lib/config';

export default function EditFeeCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    frequency: 'Monthly'
  });

  // Fetch fee category data
  useEffect(() => {
    const fetchFeeCategory = async () => {
      try {
        const response = await fetch(`/api/fees/categories/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch fee category details');
        }
        
        const feeCategory = await response.json();
        
        setFormData({
          name: feeCategory.name,
          description: feeCategory.description || '',
          amount: feeCategory.amount.toString(),
          frequency: feeCategory.frequency
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeeCategory();
  }, [params.id]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      // Validate required fields
      if (!formData.name || !formData.amount || !formData.frequency) {
        throw new Error('Name, Amount, and Frequency are required');
      }
      
      // Validate amount is a valid number
      if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
        throw new Error('Amount must be a positive number');
      }
      
      // Submit data to API
      const response = await fetch(`/api/fees/categories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update fee category');
      }
      
      // Redirect to fee category details page on success
      router.push(`/fees/categories/${params.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href={`/fees/categories/${params.id}`} className="mr-4">
              <ArrowLeft className="h-6 w-6 text-gray-500 hover:text-gray-700" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Loading Fee Category...</h1>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href={`/fees/categories/${params.id}`} className="mr-4">
            <ArrowLeft className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Edit Fee Category</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fee Category Name */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Fee Category Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Tuition Fee, Library Fee, etc."
              />
            </div>

            {/* Amount */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-7 rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Frequency */}
            <div className="col-span-2 md:col-span-1">
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                Frequency*
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
                <option value="One-time">One-time</option>
              </select>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide a description of this fee category..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <Link
              href={`/fees/categories/${params.id}`}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            >
              {saving ? 'Saving...' : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
