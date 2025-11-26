import React from 'react';
import { Input } from '@/components/input';
import { Card } from '@/components/card';
import { KpiBadge } from '@/components/kpi-badge';
import { Pill } from '@/components/pill';
import { IconButton } from '@/components/icon-button';
import { ProgressBar } from '@/components/progress-bar';
import { BottomNav } from '@/components/bottom-nav';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white">
      {/* Header Section */}
      <div className="px-6 pt-12 pb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Broker Plus</h1>
            <p className="text-blue-100 text-sm mb-1">Welcome,</p>
            <p className="text-xl font-medium">Steven Williams</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <IconButton icon="bell" variant="ghost" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
            </div>
            <IconButton icon="menu" variant="ghost" />
          </div>
        </div>
      </div>

      {/* KPIs Section */}
      <div className="px-6 mb-8">
        <div className="flex gap-4">
          <KpiBadge number="10" label="New enrollments" variant="primary" />
          <KpiBadge number="8" label="Outstanding invoices" variant="secondary" />
        </div>
      </div>

      {/* Search Section */}
      <div className="px-6 mb-8">
        <Input 
          placeholder="Search for client" 
          icon="search" 
          className="bg-white/10 border-white/20 text-white placeholder-white/70"
        />
      </div>

      {/* Recently Viewed Section */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Recently Viewed Clients</h2>
          <button className="text-blue-200 text-sm flex items-center gap-1">
            View All Clients
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <Card className="bg-blue-900/50 border-blue-700">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium mb-1">ABCD Plumbing LLC</h3>
              <p className="text-blue-200 text-sm">Client ID: 23456</p>
            </div>
            <IconButton icon="menu" variant="ghost" />
          </div>
        </Card>
      </div>

      {/* Latest News Section */}
      <div className="px-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Latest News</h2>
          <button className="text-blue-200 text-sm flex items-center gap-1">
            More News
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <Card className="bg-white text-gray-900">
          <div className="mb-3">
            <Pill text="10/21/2021" variant="success" />
          </div>
          <p className="text-sm font-medium">Updated ARP resource guide explains impact on individual clients</p>
        </Card>
      </div>

      {/* Applications Summary Section */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Applications Summary</h2>
        <Card className="bg-blue-900/50 border-blue-700">
          <div className="mb-6">
            <p className="text-blue-200 text-sm mb-1">Market Segment(s) Supported</p>
            <p className="font-medium">Medicare, Small Group(s)</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Action Required</span>
              <span className="font-semibold text-lg">10</span>
            </div>
            <ProgressBar value={10} max={100} color="red" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Submitted</span>
              <span className="font-semibold text-lg">23</span>
            </div>
            <ProgressBar value={23} max={100} color="blue" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">In Progress</span>
              <span className="font-semibold text-lg">26</span>
            </div>
            <ProgressBar value={26} max={100} color="yellow" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Completed</span>
              <span className="font-semibold text-lg">98</span>
            </div>
            <ProgressBar value={98} max={100} color="green" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Not Approved</span>
              <span className="font-semibold text-lg">17</span>
            </div>
            <ProgressBar value={17} max={100} color="red" />
          </div>
        </Card>
      </div>

      {/* Commissions Section */}
      <div className="px-6 mb-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Commissions</h2>
          <button className="text-blue-200 text-sm flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <Card className="bg-blue-900/50 border-blue-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-200 text-sm mb-1">October total earned</p>
              <p className="text-2xl font-semibold">$5,038.23</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
                <span className="text-green-400 font-medium">+12%</span>
              </div>
              <p className="text-blue-200 text-xs">monthly increase</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
