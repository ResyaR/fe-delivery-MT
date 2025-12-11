"use client";

import { useOffline } from '@/hooks/useOffline';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function OfflineIndicator() {
  const { isOnline, wasOffline } = useOffline();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (wasOffline && isOnline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [wasOffline, isOnline]);

  return (
    <>
      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2 text-center text-sm font-semibold shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">
                wifi_off
              </span>
              <span>Anda sedang offline. Beberapa fitur mungkin terbatas.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reconnected Banner */}
      <AnimatePresence>
        {showReconnected && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white px-4 py-2 text-center text-sm font-semibold shadow-lg"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">wifi</span>
              <span>Koneksi internet kembali. Data sedang disinkronkan...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

