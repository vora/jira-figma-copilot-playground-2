import React from 'react';

interface NewsTitleProps {
  newCount?: number;
  outstandingCount?: number;
}

const NewsTitle: React.FC<NewsTitleProps> = ({ 
  newCount = 10, 
  outstandingCount = 8 
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">{newCount}</span>
        </div>
        <span className="text-gray-700 text-sm font-medium">New Enrollments</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">{outstandingCount}</span>
        </div>
        <span className="text-gray-700 text-sm font-medium">Outstanding Invoices</span>
      </div>
    </div>
  );
};

export default NewsTitle;
