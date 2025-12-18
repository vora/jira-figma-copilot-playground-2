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
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('Home');

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
      title: 'Updated ARP Resource Guide Explains Impact On Individual Clients'
    },
    {
      date: '10/21/2021',
      title: 'Updated ARP Resource Guide Explains Impact On Individual Clients'
    },
    {
      date: '10/21/2021',
      title: 'Updated ARP Resource Guide Explains Impact On Individual Clients'
    }
  ];

  const recentClients = [
    { name: 'Cunningham Hardware', id: '12345' },
    { name: 'Cunningham Hardware', id: '12345' },
    { name: 'Cunningham Hardware', id: '12345' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                <span className="text-white text-xs font-bold">BS</span>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
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
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <p className="text-gray-600 text-sm mb-1">Welcome,</p>
          <h1 className="text-2xl font-bold text-gray-900">Steven Williams</h1>
        </div>

        {/* Status Cards */}
        <NewsTitle newCount={10} outstandingCount={8} />

        {/* Search */}
        <Search 
          placeholder="Search for client"
          value={searchValue}
          onChange={setSearchValue}
          className="w-full"
        />

        {/* Recently Viewed Clients */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recently Viewed Clients</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View All Clients →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentClients.map((client, index) => (
              <ClientCard
                key={index}
                clientName={client.name}
                clientId={client.id}
                onDelete={() => console.log(`Delete ${client.name}`)}
              />
            ))}
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
                <div className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded mb-3">
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
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default HomePage;
