"use client";

import { useEffect, useState } from 'react';
import indexedDB from '@/lib/indexedDB';

/**
 * Hook to initialize IndexedDB and provide status
 */
export function useIndexedDB() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize IndexedDB on mount
    indexedDB
      .init()
      .then(() => {
        setIsReady(true);
        console.log('IndexedDB ready for offline support');
      })
      .catch((err) => {
        console.error('Failed to initialize IndexedDB:', err);
        setError(err);
        setIsReady(false);
      });
  }, []);

  return { isReady, error, indexedDB };
}

