/**
 * JWT Helper Utilities
 * Functions for decoding and validating JWT tokens
 */

export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function getTokenExpiryTime(token: string): number | null {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return null;
  return payload.exp * 1000; // Convert to milliseconds
}

export function isTokenExpiringSoon(token: string, minutesBefore = 2): boolean {
  const expiryTime = getTokenExpiryTime(token);
  if (!expiryTime) return false;
  
  const now = Date.now();
  const timeUntilExpiry = expiryTime - now;
  const thresholdMs = minutesBefore * 60 * 1000;
  
  return timeUntilExpiry <= thresholdMs && timeUntilExpiry > 0;
}

export function getTimeUntilExpiry(token: string): number {
  const expiryTime = getTokenExpiryTime(token);
  if (!expiryTime) return 0;
  
  const now = Date.now();
  return Math.max(0, expiryTime - now);
}

export function formatTimeRemaining(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

