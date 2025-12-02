import React from 'react';

interface CardProps {
  date: string;
  title: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ date, title, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded-t-lg">
        {date}
      </div>
      <div className="p-4">
        <p className="text-gray-900 text-sm font-medium leading-5">
          {title}
        </p>
      </div>
      <div className="px-4 pb-4">
        <button 
          className="w-full bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium py-2.5 px-4 rounded transition-colors duration-200"
          aria-label="View card details"
          role="button"
        >
          Button
        </button>
      </div>
    </div>
  );
};

export default Card;
