"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import AvatarUpload from "@/components/profile/AvatarUpload";

export default function ProfilePage() {
  const { user, setUser, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    } else if (user) {
      // Update form data when user data is available
      setFormData({
        name: user.fullName || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E46329]"></div>
      </div>
    );
  }

  // Early return if no user
  if (!user) {
    return null;
  }

  const handleAvatarUpload = async (formData) => {
    try {
      setError("");
      const response = await fetch('https://be-mt-trans.vercel.app/users/profile/avatar', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      const data = await response.json();
      setUser({ ...user, avatar: data.avatar });
    } catch (err) {
      setError("Failed to upload avatar. Please try again.");
      throw err;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Basic phone number validation
    if (name === 'phone') {
      // Remove any non-digit characters except +
      const sanitizedValue = value.replace(/[^\d+]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError("");
      
      console.log('Updating profile with data:', formData);
      
      // Format phone number to include country code if not present
      const formattedPhone = formData.phone.startsWith('+62') 
        ? formData.phone 
        : `+62${formData.phone.startsWith('0') ? formData.phone.substring(1) : formData.phone}`;

      const response = await fetch('https://be-mt-trans.vercel.app/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formattedPhone
          // Removing address field as it's not supported by the backend
        })
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update profile');
      }

      // Update user state with the response data
      setUser({
        ...user,
        fullName: responseData.fullName || formData.name,
        phone: responseData.phoneNumber || formData.phone,  // Note the field name change
        address: responseData.address || formData.address
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <AvatarUpload
                currentAvatar={user.avatar || "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/pmhU3FeeUc/k7iacvwh_expires_30_days.png"}
                onUpload={handleAvatarUpload}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.email}</h1>
                <p className="text-sm text-gray-500">Member since September 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1">
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="bg-gray-50 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Example: 081234567890"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter your phone number without spaces or special characters. Example: 081234567890
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Order History */}
        <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order History</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #123456
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Sept 16, 2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rp 150.000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}