'use client';

import { useEffect } from 'react';
import { Bot } from 'lucide-react';

export default function LoginPage() {
  useEffect(() => {
    // Always go to sign-in, never auto-redirect to dashboard
    window.location.replace('/sign-in');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <Bot className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">AgentHub</h1>
        <p className="text-gray-500 mt-2">Redirecting to login...</p>
        <div className="mt-6 flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}