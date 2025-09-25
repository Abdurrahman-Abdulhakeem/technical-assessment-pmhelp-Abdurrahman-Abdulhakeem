import React, { useState } from 'react';
import { Outlet } from '@tanstack/react-router';
// import { Header } from './Header';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useCurrentUser } from '@/hooks/useAuth';
import { Loading } from '@/components/ui/Loading';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoading, error } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loading size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-slate-600">Please refresh the page or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export { MainLayout };
