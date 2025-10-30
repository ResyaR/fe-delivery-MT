"use client";

import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
    warning: 'warning',
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-down">
      <div className={`${styles[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-start gap-3 max-w-md min-w-[300px]`}>
        <span className="material-symbols-outlined text-2xl flex-shrink-0">
          {icons[type]}
        </span>
        <div className="flex-1">
          <p className="font-medium leading-relaxed whitespace-pre-line">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
          aria-label="Close notification"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
    </div>
  );
}
