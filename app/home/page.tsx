import React from 'react';
import { Search } from '@/components/search';
import BottomNav from '@/components/BottomNav';
import NewsTitle from '@/components/newsTitle';
import MarketSegmentCard from '@/components/MarketSegmentCard';
import ClientCard from '@/components/clientCard';
import Commissions from '@/components/commissions';

const HomePage: React.FC = () => {
  const statusItems = [
    { label: 'Action Required', count: 1, color: 'teal' },
    { label: 'Submitted', count: 23, color: 'blue' },
    { label: 'In Progress', count: 26, color: 'yellow' },
    { label: 'Completed', count: 98, color: 'green' },
    { label: 'Not Approved', count: 17, color: 'red' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">BS</span>
            </div>
            <span className="text-blue-600 font-semibold">South Carolina</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🔔</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
            </div>
            <button className="text-gray-600">
              <span className="text-lg">⋮</span>
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-1">Welcome,</p>
          <h1 className="text-2xl font-bold text-gray-900">Steven Williams</h1>
        </div>
        
        <NewsTitle newCount={10} outstandingCount={8} />
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <Search placeholder="Search for client" />
      </div>

      {/* Recently Viewed Clients */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recently Viewed Clients</h2>
          <button className="text-gray-600 text-sm font-medium flex items-center">
            View All Clients
            <span className="ml-1">→</span>
          </button>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <div className="flex-shrink-0 w-64">
            <ClientCard clientName="Cunningham Hardware" clientId="12345" />
          </div>
          <div className="flex-shrink-0 w-64">
            <ClientCard clientName="Cunningham Hardware" clientId="12345" />
          </div>
          <div className="flex-shrink-0 w-64">
            <ClientCard clientName="Cunningham Hardware" clientId="12345" />
          </div>
        </div>
      </div>

      {/* Latest News */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Latest News</h2>
          <button className="text-gray-600 text-sm font-medium flex items-center">
            More News
            <span className="ml-1">→</span>
          </button>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <div className="flex-shrink-0 w-80">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="mb-3">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  10/21/2021
                </span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 leading-tight">
                Updated ARP Resource Guide Explains Impact On Individual Clients
              </h3>
            </div>
          </div>
          <div className="flex-shrink-0 w-80">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="mb-3">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  10/21/2021
                </span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 leading-tight">
                Updated ARP Resource Guide Explains Impact On Individual Clients
              </h3>
            </div>
          </div>
          <div className="flex-shrink-0 w-80">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="mb-3">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  10/21/2021
                </span>
              </div>
              <h3 className="text-base font-semibold text-gray-900 leading-tight">
                Updated ARP Resource Guide Explains Impact On Individual Clients
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Application Summary */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h2>
        <div className="flex justify-center">
          <MarketSegmentCard
            title="Medicare, Small Group(s)"
            subtitle="Market Segment(s) Supported"
            statusItems={statusItems}
          />
        </div>
      </div>

      {/* Commissions */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Comissions</h2>
          <button className="text-gray-600 text-sm font-medium flex items-center">
            View All
            <span className="ml-1">→</span>
          </button>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <div className="flex-shrink-0 w-80">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">October total earned</p>
                  <p className="text-2xl font-semibold text-gray-900 mb-2">$5,038.24</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-8 bg-blue-100 rounded-sm relative overflow-hidden">
                    <svg 
                      viewBox="0 0 64 32" 
                      className="w-full h-full"
                      preserveAspectRatio="none"
                    >
                      <path 
                        d="M0,20 Q16,16 32,18 T64,14" 
                        stroke="#3B82F6" 
                        strokeWidth="2" 
                        fill="none"
                      />
                      <path 
                        d="M0,20 Q16,16 32,18 T64,14 L64,32 L0,32 Z" 
                        fill="#3B82F6" 
                        fillOpacity="0.2"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-blue-600">+8%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">monthly increase</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-80">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">October total earned</p>
                  <p className="text-2xl font-semibold text-gray-900 mb-2">$5,038.24</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-8 bg-blue-100 rounded-sm relative overflow-hidden">
                    <svg 
                      viewBox="0 0 64 32" 
                      className="w-full h-full"
                      preserveAspectRatio="none"
                    >
                      <path 
                        d="M0,20 Q16,16 32,18 T64,14" 
                        stroke="#3B82F6" 
                        strokeWidth="2" 
                        fill="none"
                      />
                      <path 
                        d="M0,20 Q16,16 32,18 T64,14 L64,32 L0,32 Z" 
                        fill="#3B82F6" 
                        fillOpacity="0.2"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-blue-600">+12%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">monthly increase</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="mt-8">
        <BottomNav activeTab="Home" />
      </div>
    </div>
  );
};

export default HomePage;
