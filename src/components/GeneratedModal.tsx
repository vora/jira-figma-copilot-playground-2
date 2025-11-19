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
    ];
    
    return Array.from(
      modalRef.current.querySelectorAll(focusableSelectors.join(', '))
    ) as HTMLElement[];
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

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus the first focusable element
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
          icon: '⚠️',
          confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          iconBg: 'bg-red-100',
        };
      case 'warning':
        return {
          icon: '⚠️',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          iconBg: 'bg-yellow-100',
        };
      default:
        return {
          icon: 'ℹ️',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          iconBg: 'bg-blue-100',
        };
    }
  };

  const variantStyles = getVariantStyles();

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-out"
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4"
      >
        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${variantStyles.iconBg}`}>
              <span className="text-xl" role="img" aria-hidden="true">
                {variantStyles.icon}
              </span>
            </div>
          </div>
          
          {/* Title */}
          <h3
            id="modal-title"
            className="text-lg font-semibold text-gray-900 text-center mb-2"
          >
            {title}
          </h3>
          
          {/* Message */}
          <p
            id="modal-description"
            className="text-sm text-gray-600 text-center mb-6 leading-relaxed"
          >
            {message}
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {cancelText}
            </button>
            
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${variantStyles.confirmButton}`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Loading...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;
```

Now, let's create a custom hook to manage the modal state:

```tsx
// useConfirmationModal.ts
import { useState, useCallback } from 'react';

export interface UseConfirmationModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  confirmAndClose: (callback?: () => void | Promise<void>) => Promise<void>;
}

export const useConfirmationModal = (): UseConfirmationModalReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const confirmAndClose = useCallback(async (callback?: () => void | Promise<void>) => {
    if (callback) {
      await callback();
    }
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    confirmAndClose,
  };
};
```

Here's an example of how to use the modal component:

```tsx
// ExampleUsage.tsx
import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { useConfirmationModal } from './useConfirmationModal';

const ExampleUsage: React.FC = () => {
  const { isOpen, openModal, closeModal } = useConfirmationModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Item deleted successfully');
      closeModal();
    } catch (error) {
      console.error('Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={openModal}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Delete Item
      </button>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
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
    render(<ConfirmationModal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    await user.click(screen.getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    await user.click(screen.getByText('Confirm'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when ESC key is pressed', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    await user.keyboard('{Escape}');
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    const backdrop = screen.getByRole('dialog');
    await user.click(backdrop);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders custom button text', () => {
    render(
      <ConfirmationModal
        {...defaultProps}
        confirmText="Delete"
        cancelText="Keep"
      />
    );
    
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Keep')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<ConfirmationModal {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(
      <ConfirmationModal {...defaultProps} variant="danger" />
    );
    
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveClass('bg-red-600');
    
    rerender(<ConfirmationModal {...defaultProps} variant="warning" />);
    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveClass('bg-yellow-600');
  });

  it('traps focus within modal', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    const confirmButton = screen.getByText('Confirm');
    
    // Focus should start on the first focusable element
    await waitFor(() => {
      expect(cancelButton).toHaveFocus
