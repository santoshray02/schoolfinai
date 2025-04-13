'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { schoolConfig } from '@/lib/config';

export default function SchoolSettingsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logoUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Load current school configuration
    setFormData({
      name: schoolConfig.name,
      tagline: schoolConfig.tagline,
      address: schoolConfig.address,
      phone: schoolConfig.phone,
      email: schoolConfig.email,
      website: schoolConfig.website,
      logoUrl: schoolConfig.logoUrl,
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // In a real implementation, this would update environment variables or database settings
      // For this demo, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: 'School information updated successfully. Note: Some changes may require an application restart to take effect.',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update school information. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">School Settings</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">School Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Update your school details that will be displayed throughout the application.
                </p>
              </div>
              
              {message.text && (
                <div className={`px-4 py-3 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {message.text}
                  </p>
                </div>
              )}
              
              <div className="border-t border-gray-200">
                <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          School Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="tagline" className="block text-sm font-medium text-gray-700">
                          Tagline
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="tagline"
                            id="tagline"
                            value={formData.tagline}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="address"
                            name="address"
                            rows={3}
                            value={formData.address}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                          Website
                        </label>
                        <div className="mt-1">
                          <input
                            type="url"
                            name="website"
                            id="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                          Logo URL
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="logoUrl"
                            id="logoUrl"
                            value={formData.logoUrl}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Path to your school logo image (e.g., /images/logo.png)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {isLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
