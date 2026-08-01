'use client';

import { ReactNode } from 'react';

export default function AgentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="h-full">
      {children}
    </div>
  );
}