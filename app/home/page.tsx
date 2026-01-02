'use client';

import React, { useState } from 'react';
import { Bell, MoreVertical } from 'lucide-react';
import Search from '@/components/search';
import BottomNav from '@/components/BottomNav';
import NewsTitle from '@/components/newsTitle';
import MarketSegmentCard from '@/components/MarketSegmentCard';
import ClientCard from '@/components/clientCard';
import Commissions from '@/components/commissions';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [searchValue, setSearchValue] = useState('');

  const statusItems = [
    { label: 'Action Required', count: 1, color: 'teal' },
    { label: 'Submitted', count: 23, color: 'blue' },
    { label: 'In Progress', count: 26, color: 'yellow' },
    { label: 'Completed', count: 98, color: 'green' },
    { label: 'Not Approved', count: 17, color: 'red' }
  ];

  const newsItems = [
    {
      date: '10/21/2021',
      title: 'Updated ARP Resource Guide Explains Impact On Individual Clients',
      bgColor: 'bg-green-100'
    },
    {
      date: '10/21/2021',
      title: 'Updated ARP Resource Guide Explains Impact On Individual Clients',
      bgColor: 'bg-green-100'
    },
    {
      date: '10/21/2021',
      title: 'Updated ARP Resource Guide Explains Impact On Individual Clients',
      bgColor: 'bg-green-100'
    }
  ];

  const handleClientDelete = (clientName: string) => {
    console.log(`Deleting client: ${clientName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">BS</span>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">SC</span>
              </div>
            </div>
            <span className="text-blue-600 text-sm font-medium">South Carolina</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">3</span>
              </div>
            </div>
            <MoreVertical className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-1">Welcome,</p>
          <h1 className="text-2xl font-bold text-gray-900">Steven Williams</h1>
        </div>
        
        <NewsTitle newCount={10} outstandingCount={8} />
      </div>

      {/* Search */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <Search 
          placeholder="Search for client"
          value={searchValue}
          onChange={setSearchValue}
        />
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Recently Viewed Clients */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recently Viewed Clients</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View All Clients →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ClientCard 
              clientName="Cunningham Hardware" 
              clientId="12345"
              onDelete={() => handleClientDelete('Cunningham Hardware')}
            />
            <ClientCard 
              clientName="Cunningham Hardware" 
              clientId="12345"
              onDelete={() => handleClientDelete('Cunningham Hardware')}
            />
            <ClientCard 
              clientName="Cunningham Hardware" 
              clientId="12345"
              onDelete={() => handleClientDelete('Cunningham Hardware')}
            />
          </div>
        </section>

        {/* Latest News */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Latest News</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              More News →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium text-green-800 ${item.bgColor} mb-3`}>
                  {item.date}
                </div>
                <h3 className="text-sm font-medium text-gray-900 leading-5">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Application Summary */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h2>
          <div className="flex justify-center">
            <MarketSegmentCard
              title="Medicare, Small Group(s)"
              subtitle="Market Segment(s) Supported"
              statusItems={statusItems}
            />
          </div>
        </section>

        {/* Commissions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Commissions</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View All →
            </button>
          </div>
          <Commissions />
        </section>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Add padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20" />
    </div>
  );
};

export default HomePage;
