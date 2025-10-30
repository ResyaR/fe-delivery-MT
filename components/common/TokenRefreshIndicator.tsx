'use client';

import { useEffect, useState } from 'react';

export default function TokenRefreshIndicator() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    // Listen untuk custom event dari refresh function
    const handleRefreshStart = () => {
      setIsRefreshing(true);
      console.log('[TokenIndicator] Token refresh started');
    };
    
    const handleRefreshEnd = () => {
      setIsRefreshing(false);
      setLastRefresh(new Date());
      console.log('[TokenIndicator] Token refresh completed');
      
      // Hide indicator setelah 3 detik
      setTimeout(() => setLastRefresh(null), 3000);
    };

    const handleRefreshError = () => {
      setIsRefreshing(false);
      console.error('[TokenIndicator] Token refresh failed');
    };

    window.addEventListener('token-refresh-start', handleRefreshStart);
    window.addEventListener('token-refresh-end', handleRefreshEnd);
    window.addEventListener('token-refresh-error', handleRefreshError);

    return () => {
      window.removeEventListener('token-refresh-start', handleRefreshStart);
      window.removeEventListener('token-refresh-end', handleRefreshEnd);
      window.removeEventListener('token-refresh-error', handleRefreshError);
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  if (!isRefreshing && !lastRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isRefreshing && (
        <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-scale-in">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm font-medium">Refreshing token...</span>
        </div>
      )}
      {lastRefresh && !isRefreshing && (
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-scale-in flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <div>
            <div className="font-semibold">Token Refreshed</div>
            <div className="text-xs opacity-90">{lastRefresh.toLocaleTimeString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}

