'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { ReactNode } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-hidden">
        <div className="h-full p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}