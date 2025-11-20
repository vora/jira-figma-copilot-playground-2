I'll create a reusable confirmation modal component based on your requirements. Since I can't access the Figma link, I'll implement a well-structured modal following modern design patterns and accessibility standards.

```tsx
// ConfirmationModal.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  primaryButton?: {
    text: string;
    onClick: () => void;
    variant?: 'danger' | 'primary' | 'success';
    loading?: boolean;
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
  };
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  primaryButton = {
    text: 'Confirm',
    onClick: () => {},
    variant: 'primary'
  },
  secondaryButton = {
    text: 'Cancel',
    onClick: () => {}
  },
  onClose,
  closeOnOverlayClick = true,
  closeOnEscape = true
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
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    return Array.from(modalRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    if (event.key === 'Escape' && closeOnEscape) {
      event.preventDefault();
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
  }, [isOpen, closeOnEscape, onClose, getFocusableElements]);

  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  }, [closeOnOverlayClick, onClose]);

  const handleSecondaryClick = useCallback(() => {
    secondaryButton.onClick();
    onClose();
  }, [secondaryButton, onClose]);

  const handlePrimaryClick = useCallback(() => {
    primaryButton.onClick();
  }, [primaryButton]);

  // Setup focus management and event listeners
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus first focusable element after animation
      setTimeout(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 150);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      
      // Return focus to previously active element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown, getFocusableElements]);

  if (!isOpen) return null;

  const getButtonVariantClasses = (variant: string = 'primary') => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'danger':
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
      case 'success':
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`;
      case 'primary':
      default:
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
    }
  };

  const secondaryButtonClasses = 'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500';

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-out"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-gray-900 leading-6"
          >
            {title}
          </h2>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <p
            id="modal-description"
            className="text-sm text-gray-600 leading-5"
          >
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            className={secondaryButtonClasses}
            onClick={handleSecondaryClick}
          >
            {secondaryButton.text}
          </button>
          
          <button
            type="button"
            className={getButtonVariantClasses(primaryButton.variant)}
            onClick={handlePrimaryClick}
            disabled={primaryButton.loading}
          >
            {primaryButton.loading && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {primaryButton.text}
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

interface UseConfirmationModalProps {
  title: string;
  message: string;
  primaryButton?: {
    text: string;
    variant?: 'danger' | 'primary' | 'success';
  };
  secondaryButton?: {
    text: string;
  };
}

export const useConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<UseConfirmationModalProps | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const openModal = useCallback((modalConfig: UseConfirmationModalProps): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfig(modalConfig);
      setResolvePromise(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  const confirmModal = useCallback(() => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
  }, [resolvePromise]);

  return {
    isOpen,
    config,
    openModal,
    closeModal,
    confirmModal
  };
};
```

Here's how to use the modal component:

```tsx
// Example usage component
import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { useConfirmationModal } from './useConfirmationModal';

const ExampleUsage: React.FC = () => {
  // Method 1: Direct component usage
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setShowModal(false);
    console.log('Item deleted!');
  };

  // Method 2: Using the hook (recommended)
  const { isOpen, config, openModal, closeModal, confirmModal } = useConfirmationModal();

  const handleDeleteWithHook = async () => {
    const confirmed = await openModal({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      primaryButton: {
        text: 'Delete',
        variant: 'danger'
      },
      secondaryButton: {
        text: 'Cancel'
      }
    });

    if (confirmed) {
      console.log('User confirmed deletion');
      // Perform delete action
    }
  };

  const handlePublish = async () => {
    const confirmed = await openModal({
      title: 'Publish Content',
      message: 'Are you ready to publish this content? It will be visible to all users.',
      primaryButton: {
        text: 'Publish',
        variant: 'success'
      }
    });

    if (confirmed) {
      console.log('Content published');
    }
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Confirmation Modal Examples</h1>
      
      {/* Direct usage */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete Item (Direct)
      </button>

      <ConfirmationModal
        isOpen={showModal}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        primaryButton={{
          text: 'Delete',
          onClick: handleDelete,
          variant: 'danger',
          loading: loading
        }}
        secondaryButton={{
          text: 'Cancel',
          onClick: () => setShowModal(false)
        }}
        onClose={() => setShowModal(false)}
      />

      {/* Hook usage */}
      <div className="space-x-4">
        <button
          onClick={handleDeleteWithHook}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Item (Hook)
        </button>

        <button
          onClick={handlePublish}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Publish Content
        </button>
      </div>

      {/* Hook modal */}
      {config && (
        <ConfirmationModal
          isOpen={isOpen}
          title={config.title}
          message={config.message}
          primaryButton={{
            text: config.primaryButton?.text || 'Confirm',
            onClick: confirmModal,
            variant: config.primaryButton?.variant || 'primary'
          }}
          secondaryButton={{
            text: config.secondaryButton?.text || 'Cancel',
            onClick: closeModal
          }}
          onClose={closeModal}
        />
      )}
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

describe('ConfirmationModal', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Test Title',
    message: 'Test message',
    onClose: jest.fn(),
    primaryButton: {
      text: 'Confirm',
      onClick: jest.fn()
    },
    secondaryButton: {
      text: 'Cancel',
      onClick: jest.fn()
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInThe
