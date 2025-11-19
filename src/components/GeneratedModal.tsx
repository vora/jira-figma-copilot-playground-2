I'll create a reusable confirmation modal component based on your requirements. Since I can't access the Figma link, I'll implement a well-structured modal following modern design patterns and accessibility standards.

```tsx
// ConfirmationModal.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  isLoading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);

  // Focus trap implementation
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');
    
    return Array.from(modalRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [onClose, getFocusableElements]);

  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    if (!isLoading) {
      onConfirm();
    }
  }, [onConfirm, isLoading]);

  // Effect for focus management and event listeners
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Add event listener for keyboard navigation
      document.addEventListener('keydown', handleKeyDown);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the modal after a brief delay to ensure it's rendered
      setTimeout(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleKeyDown, getFocusableElements]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          icon: 'text-red-600',
        };
      case 'warning':
        return {
          confirmButton: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
          icon: 'text-amber-600',
        };
      default:
        return {
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          icon: 'text-blue-600',
        };
    }
  };

  const variantStyles = getVariantStyles();

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-out"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4"
      >
        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className={`flex-shrink-0 ${variantStyles.icon}`}>
              {variant === 'danger' && (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              )}
              {variant === 'warning' && (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
              {variant === 'info' && (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              )}
            </div>
            
            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h3 
                id="modal-title" 
                className="text-lg font-semibold text-gray-900 mb-2"
              >
                {title}
              </h3>
              <p 
                id="modal-description" 
                className="text-sm text-gray-600 leading-relaxed"
              >
                {message}
              </p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${variantStyles.confirmButton}`}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;
```

Now, let's create a custom hook to make it even easier to use:

```tsx
// useConfirmationModal.ts
import { useState, useCallback } from 'react';

export interface UseConfirmationModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const useConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<UseConfirmationModalOptions>({
    title: '',
    message: '',
  });
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void | Promise<void>) | null>(null);

  const openModal = useCallback((
    modalOptions: UseConfirmationModalOptions,
    onConfirm: () => void | Promise<void>
  ) => {
    setOptions(modalOptions);
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsLoading(false);
    setOnConfirmCallback(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (onConfirmCallback) {
      try {
        setIsLoading(true);
        await onConfirmCallback();
        closeModal();
      } catch (error) {
        setIsLoading(false);
        // Handle error as needed
        console.error('Confirmation action failed:', error);
      }
    }
  }, [onConfirmCallback, closeModal]);

  return {
    isOpen,
    isLoading,
    options,
    openModal,
    closeModal,
    handleConfirm,
  };
};
```

Here's an example of how to use the modal component:

```tsx
// ExampleUsage.tsx
import React from 'react';
import ConfirmationModal from './ConfirmationModal';
import { useConfirmationModal } from './useConfirmationModal';

const ExampleUsage: React.FC = () => {
  const {
    isOpen,
    isLoading,
    options,
    openModal,
    closeModal,
    handleConfirm,
  } = useConfirmationModal();

  const handleDelete = () => {
    openModal(
      {
        title: 'Delete Item',
        message: 'Are you sure you want to delete this item? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger',
      },
      async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Item deleted!');
      }
    );
  };

  const handlePublish = () => {
    openModal(
      {
        title: 'Publish Content',
        message: 'Are you ready to publish this content? It will be visible to all users.',
        confirmText: 'Publish',
        cancelText: 'Cancel',
        variant: 'info',
      },
      async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Content published!');
      }
    );
  };

  return (
    <div className="p-8 space-y-4">
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Delete Item
      </button>
      
      <button
        onClick={handlePublish}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Publish Content
      </button>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        variant={options.variant}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ExampleUsage;
```

And here are the unit tests:

```tsx
// ConfirmationModal.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmationModal from './ConfirmationModal';

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
  title: 'Test Title',
  message: 'Test message',
};

describe('ConfirmationModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(<ConfirmationModal {...defaultProps
