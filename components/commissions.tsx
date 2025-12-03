import React from 'react';

interface CommissionCardProps {
  title: string;
  amount: string;
  percentage: string;
  trend: 'up' | 'down';
}

const CommissionCard: React.FC<CommissionCardProps> = ({ title, amount, percentage, trend }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mb-2">{amount}</p>
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
            <span className="text-sm font-medium text-blue-600">{percentage}</span>
            <span className="text-xs text-gray-500 ml-1">monthly</span>
          </div>
        </div>
      </div>
      <div className="flex items-center mt-1">
        <span className="text-xs text-gray-500">increase</span>
      </div>
    </div>
  );
};

const Commissions: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <CommissionCard
        title="October total earned"
        amount="$5,038.24"
        percentage="+8%"
        trend="up"
      />
      <CommissionCard
        title="October total earned"
        amount="$5,038.24"
        percentage="+12%"
        trend="up"
      />
    </div>
  );
};

export default Commissions;
