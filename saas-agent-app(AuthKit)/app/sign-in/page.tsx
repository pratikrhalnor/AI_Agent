'use client';

import { useEffect } from 'react';

export default function SignInPage() {
  useEffect(() => {
    const signIn = async () => {
      const res = await fetch('/api/auth/sign-in');
      const data = await res.json();
      if (data.url) {
        window.location.replace(data.url);
      }
    };
    signIn();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to secure login...</p>
      </div>
    </div>
  );
}