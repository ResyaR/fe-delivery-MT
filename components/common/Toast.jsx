"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, type = 'success', onClose, duration = 4000, icon }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-white',
      border: 'border-l-4 border-green-500',
      iconColor: 'text-green-500',
      iconBg: 'bg-green-50',
      textColor: 'text-gray-800',
      shadow: 'shadow-lg shadow-green-500/10',
    },
    error: {
      bg: 'bg-white',
      border: 'border-l-4 border-red-500',
      iconColor: 'text-red-500',
      iconBg: 'bg-red-50',
      textColor: 'text-gray-800',
      shadow: 'shadow-lg shadow-red-500/10',
    },
    info: {
      bg: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      border: 'border-l-4 border-indigo-400',
      iconColor: 'text-white',
      iconBg: 'bg-white/20',
      textColor: 'text-white',
      shadow: 'shadow-lg shadow-indigo-500/30',
    },
    warning: {
      bg: 'bg-white',
      border: 'border-l-4 border-yellow-500',
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-50',
      textColor: 'text-gray-800',
      shadow: 'shadow-lg shadow-yellow-500/10',
    },
  };

  const defaultIcons = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
    warning: 'warning',
  };

  const iconToShow = icon || defaultIcons[type];
  const styleConfig = styles[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9, x: 100 }}
        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.95, x: 100 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          duration: 0.3
        }}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[9999] max-w-xs sm:max-w-sm md:max-w-md w-[calc(100%-1.5rem)] sm:w-auto sm:min-w-[280px] md:min-w-[320px]"
      >
        <motion.div 
          className={`${styleConfig.bg} ${styleConfig.border} ${styleConfig.shadow} px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 relative overflow-hidden ${type === 'info' ? '' : 'border-t border-r border-b border-gray-100'}`}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30
          }}
        >
          {/* Decorative dot pattern */}
          <div className={`absolute top-0 right-0 w-20 h-20 opacity-5 ${styleConfig.iconColor}`}>
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current"></div>
            <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-current"></div>
            <div className="absolute top-10 right-4 w-1 h-1 rounded-full bg-current"></div>
          </div>
          
          {/* Icon with background */}
          <motion.div
            className={`${styleConfig.iconBg} ${styleConfig.iconColor} rounded-xl p-2 sm:p-2.5 flex-shrink-0 relative z-10 flex items-center justify-center`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              delay: 0.1
            }}
          >
            <span className="material-symbols-outlined text-lg sm:text-xl md:text-2xl">
              {iconToShow}
            </span>
          </motion.div>
          
          {/* Message */}
          <div className="flex-1 relative z-10 min-w-0 flex items-center">
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={`${styleConfig.textColor} font-semibold text-sm sm:text-base leading-normal whitespace-pre-line break-words`}
            >
              {message}
            </motion.p>
          </div>
          
          {/* Close button */}
          <motion.button
            onClick={onClose}
            className={`flex-shrink-0 rounded-lg p-1 sm:p-1.5 transition-all duration-200 relative z-10 group flex items-center justify-center ${type === 'info' ? 'hover:bg-white/20' : 'hover:bg-gray-100'}`}
            aria-label="Close notification"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <span className={`material-symbols-outlined text-lg sm:text-xl ${type === 'info' ? 'text-white/80 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
              close
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
