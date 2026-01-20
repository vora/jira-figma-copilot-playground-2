import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content - Placeholder for dashboard sections */}
      <main className="flex-1 px-6 py-8" role="main">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

          {/* Placeholder content - sections will be added in later tickets */}
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-2">
                Dashboard content sections will be added here
              </p>
              <p className="text-gray-400 text-sm">
                Individual sections (search, frequent tasks, recent activity, billing summary, etc.)
                will be implemented in subsequent tickets
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
