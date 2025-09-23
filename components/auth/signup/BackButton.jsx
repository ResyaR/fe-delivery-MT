import React from 'react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="absolute top-4 left-4 z-10">
      <button 
        onClick={handleBack}
        className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-xs font-medium">Back</span>
      </button>
    </div>
  );
};

export default BackButton;