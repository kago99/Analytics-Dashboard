import React from 'react';

export const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-x-hidden overflow-y-auto w-full p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

// Moving Sidebar import down to resolve potential circular depending issues during fast refresh
import { Sidebar } from './Sidebar';
