'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function AvatarUpload({ currentAvatar, onUpload }) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentAvatar);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      
      // Create FormData
      const formData = new FormData();
      formData.append('avatar', file);

      // Call the onUpload callback with the file
      await onUpload(formData);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      // Revert preview on error
      setPreviewUrl(currentAvatar);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <div className="h-24 w-24 rounded-full overflow-hidden relative">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}

        {/* Upload Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <label
            htmlFor="avatar-upload"
            className="cursor-pointer text-white text-sm font-medium"
          >
            {isUploading ? 'Uploading...' : 'Change Photo'}
          </label>
          <input
            id="avatar-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      </div>

      {/* Loading Spinner */}
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}