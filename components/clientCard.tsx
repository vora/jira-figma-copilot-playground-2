import React, { useState } from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';

interface ClientCardProps {
  clientName: string;
  clientId: string;
  onDelete?: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ clientName, clientId, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowMenu(false);
  };

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      {/* Header with client name and menu */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 leading-6">
          {clientName}
        </h3>
        
        <div className="relative">
          <button
            onClick={handleMenuToggle}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Client options menu"
            aria-expanded={showMenu}
            aria-haspopup="true"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          
          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
              <button
                onClick={handleDelete}
                className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                role="menuitem"
                aria-label={`Delete client ${clientName}`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Client ID */}
      <div className="flex items-center">
        <span className="text-sm text-gray-500 mr-2">Client ID</span>
        <span className="text-sm font-medium text-gray-700">{clientId}</span>
      </div>
      
      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default ClientCard;
