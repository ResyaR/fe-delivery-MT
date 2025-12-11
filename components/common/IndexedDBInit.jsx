"use client";

import { useEffect } from 'react';
import { useIndexedDB } from '@/hooks/useIndexedDB';

/**
 * Component to initialize IndexedDB on app load
 */
export default function IndexedDBInit() {
  const { isReady, error } = useIndexedDB();

  useEffect(() => {
    if (isReady) {
      console.log('✅ IndexedDB initialized - Offline support enabled');
    }
    if (error) {
      console.warn('⚠️ IndexedDB initialization failed - Offline features may not work:', error);
    }
  }, [isReady, error]);

  // This component doesn't render anything
  return null;
}

