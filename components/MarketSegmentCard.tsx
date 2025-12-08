import React from 'react';

interface StatusItem {
  label: string;
  count: number;
  color: string;
}

interface MarketSegmentCardProps {
  title: string;
  subtitle: string;
  statusItems: StatusItem[];
}

const MarketSegmentCard: React.FC<MarketSegmentCardProps> = ({
  title,
  subtitle,
  statusItems
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'teal':
        return 'bg-teal-500';
      case 'blue':
        return 'bg-blue-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'green':
        return 'bg-green-500';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTextColorClasses = (color: string) => {
    switch (color) {
      case 'teal':
        return 'text-teal-400';
      case 'blue':
        return 'text-blue-400';
      case 'yellow':
        return 'text-yellow-400';
      case 'green':
        return 'text-green-400';
      case 'red':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-slate-700 rounded-xl p-6 w-80">
      <div className="mb-6">
        <h3 className="text-gray-300 text-sm font-medium mb-1">
          {subtitle}
        </h3>
        <h2 className="text-white text-lg font-semibold">
          {title}
        </h2>
      </div>
      
      <div className="space-y-4">
        {statusItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div 
                  className={`w-1 h-4 rounded-full ${getColorClasses(item.color)}`}
                  aria-hidden="true"
                />
                <span className="text-gray-300 text-sm font-medium">
                  {item.label}
                </span>
              </div>
            </div>
            <span className={`text-2xl font-bold ${getTextColorClasses(item.color)}`}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketSegmentCard;

// Usage example:
// const statusData = [
//   { label: 'Action Required', count: 1, color: 'teal' },
//   { label: 'Submitted', count: 23, color: 'blue' },
//   { label: 'In Progress', count: 26, color: 'yellow' },
//   { label: 'Completed', count: 98, color: 'green' },
//   { label: 'Not Approved', count: 17, color: 'red' }
// ];
// 
// <MarketSegmentCard 
//   title="Medicare, Small Group(s)"
//   subtitle="Market Segment(s) Supported"
//   statusItems={statusData}
// />
