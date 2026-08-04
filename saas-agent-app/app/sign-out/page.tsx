'use client';

import { useEffect } from 'react';

export default function SignOutPage() {
  useEffect(() => {
    const logout = async () => {
      try {
        // Clear client cookies
        document.cookie.split(';').forEach(c => {
          document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });

        // Call server logout
        await fetch('/api/auth/logout', { method: 'POST' });

        // Go to home page
        window.location.replace('/');
      } catch (error) {
        console.error('Logout error:', error);
        window.location.replace('/');
      }
    };

    logout();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Logging out...</p>
      </div>
    </div>
  );
}