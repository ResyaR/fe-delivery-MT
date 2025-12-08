'use client';

import React, { useState, useEffect } from 'react';

// Default avatar SVG as base64
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjgwIiBmaWxsPSIjZTVlN2U5Ii8+PHN2ZyB4PSI1MCIgeT0iNTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiM5Y2EzYWYiPjxwYXRoIGQ9Ik0xMiAxMmMyLjIxIDAgNC0xLjc5IDQtNHMtMS43OS00LTQtNC00IDEuNzktNCA0IDEuNzkgNCA0IDR6bTAgMmMtMi42NyAwLTggMS4zNC04IDR2MmgxNnYtMmMwLTIuNjYtNS4zMy00LTgtNHoiLz48L3N2Zz48L3N2Zz4=';

export default function AvatarUpload({ currentAvatar, onUpload }) {
  const [isUploading, setIsUploading] = useState(false);
  
  // Check if avatar is valid (not undefined, null, or contains "undefined")
  const getValidAvatar = (avatar) => {
    if (!avatar || avatar === 'undefined' || avatar.includes('undefined')) {
      return DEFAULT_AVATAR;
    }
    return avatar;
  };
  
  const [previewUrl, setPreviewUrl] = useState(getValidAvatar(currentAvatar));

  // Update previewUrl when currentAvatar changes
  useEffect(() => {
    setPreviewUrl(getValidAvatar(currentAvatar));
  }, [currentAvatar]);

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
      setPreviewUrl(getValidAvatar(currentAvatar));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <div className="h-24 w-24 rounded-full overflow-hidden relative">
        <img
          src={previewUrl || DEFAULT_AVATAR}
          alt="Profile"
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback to default if image fails to load
            e.target.src = DEFAULT_AVATAR;
          }}
        />

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