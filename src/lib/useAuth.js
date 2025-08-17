"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // Check for various possible authentication cookie names
      const cookies = document.cookie.split(';');
      const hasAuthCookie = cookies.some(cookie => {
        const [name] = cookie.trim().split('=');
        return ['admin_session', 'auth_token', 'session_token', 'token'].includes(name);
      });

      console.log('🔒 Client-side: Checking cookies:', document.cookie);
      console.log('🔒 Client-side: Has auth cookie?', hasAuthCookie);

      if (!hasAuthCookie) {
        console.log('🔒 Client-side: No auth cookies found, redirecting to login');
        // Force redirect immediately
        window.location.href = '/login';
        return;
      }

      console.log('🔒 Client-side: Auth cookies found, allowing access');
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    // Check immediately
    checkAuth();
  }, [router]);

  return { isAuthenticated, isLoading };
}; 