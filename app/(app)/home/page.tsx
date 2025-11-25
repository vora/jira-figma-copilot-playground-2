import { Bell, MoreVertical, Search } from 'lucide-react'
import { Card } from '@/components/card'
import { Input } from '@/components/input'
import { KpiBadge } from '@/components/kpi-badge'
import { Pill } from '@/components/pill'
import { IconButton } from '@/components/icon-button'
import { ProgressBar } from '@/components/progress-bar'
import { BottomNav } from '@/components/bottom-nav'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white">
      {/* Header Section */}
      <header className="flex items-center justify-between p-6 pt-12">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Broker Plus</h1>
          <p className="text-blue-100 text-sm mb-1">Welcome,</p>
          <p className="text-xl font-medium">Steven Williams</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>
          </div>
          <MoreVertical className="w-6 h-6" />
        </div>
      </header>

      {/* KPIs Section */}
      <section className="px-6 mb-8">
        <div className="flex gap-4">
          <KpiBadge number="10" label="New enrollments" />
          <KpiBadge number="8" label="Outstanding invoices" />
        </div>
      </section>

      {/* Search Section */}
      <section className="px-6 mb-8">
        <Input 
          placeholder="Search for client" 
          icon={<Search className="w-5 h-5 text-gray-400" />}
        />
      </section>

      {/* Recently Viewed Section */}
      <section className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recently Viewed Clients</h2>
          <button className="text-blue-200 text-sm flex items-center gap-1">
            View All Clients
            <span className="text-lg">›</span>
          </button>
        </div>
        <Card className="bg-blue-700/50 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1">ABCD Plumbing LLC</h3>
              <p className="text-blue-200 text-sm">Client ID: 23456</p>
            </div>
            <MoreVertical className="w-5 h-5 text-blue-200" />
          </div>
        </Card>
      </section>

      {/* Latest News Section */}
      <section className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Latest News</h2>
          <button className="text-blue-200 text-sm flex items-center gap-1">
            More News
            <span className="text-lg">›</span>
          </button>
        </div>
        <Card className="bg-white text-gray-900">
          <Pill className="bg-green-100 text-green-800 mb-3">10/21/2021</Pill>
          <p className="font-medium">Updated ARP resource guide explains impact on individual clients</p>
        </Card>
      </section>

      {/* Applications Summary Section */}
      <section className="px-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Applications Summary</h2>
        <Card className="bg-blue-700/50 border-blue-600">
          <div className="mb-6">
            <p className="text-blue-200 text-sm mb-1">Market Segment(s) Supported</p>
            <p className="font-medium">Medicare, Small Group(s)</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Action Required</span>
              <span className="font-bold text-xl">10</span>
            </div>
            <ProgressBar value={10} max={174} color="red" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Submitted</span>
              <span className="font-bold text-xl">23</span>
            </div>
            <ProgressBar value={23} max={174} color="blue" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm">In Progress</span>
              <span className="font-bold text-xl">26</span>
            </div>
            <ProgressBar value={26} max={174} color="yellow" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed</span>
              <span className="font-bold text-xl">98</span>
            </div>
            <ProgressBar value={98} max={174} color="blue" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Not Approved</span>
              <span className="font-bold text-xl">17</span>
            </div>
            <ProgressBar value={17} max={174} color="red" />
          </div>
        </Card>
      </section>

      {/* Commissions Section */}
      <section className="px-6 mb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Commissions</h2>
          <button className="text-blue-200 text-sm flex items-center gap-1">
            View All
            <span className="text-lg">›</span>
          </button>
        </div>
        <Card className="bg-blue-700/50 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm mb-1">October total earned</p>
              <p className="text-2xl font-bold">$5,038.23</p>
            </div>
            <div className="text-right">
              <p className="text-green-400 font-medium">+12%</p>
              <p className="text-blue-200 text-sm">monthly increase</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
