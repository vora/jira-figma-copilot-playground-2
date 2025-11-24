Based on the requirements and the design shown in the image, I'll create a reusable confirmation modal component. Here's the implementation:

```tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning';
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
  variant = 'primary',
  isLoading = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

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
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus first element when modal opens
    setTimeout(() => {
      firstFocusableRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

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
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95"
      >
        {/* Header */}
        <div className="mb-4">
          <h3
            id="modal-title"
            className="text-lg font-semibold text-gray-900 leading-6"
          >
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="mb-6">
          <p
            id="modal-description"
            className="text-sm text-gray-600 leading-5"
          >
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={firstFocusableRef}
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {cancelText}
          </button>
          <button
            ref={lastFocusableRef}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${getVariantStyles()}`}
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
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;
```

And here's a custom hook to make it easier to use:

```tsx
// hooks/useConfirmationModal.ts
import { useState, useCallback } from 'react';

interface UseConfirmationModalProps {
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning';
}

export const useConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalProps, setModalProps] = useState<UseConfirmationModalProps | null>(null);

  const openModal = useCallback((props: UseConfirmationModalProps) => {
    setModalProps(props);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsLoading(false);
    setModalProps(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!modalProps) return;

    try {
      setIsLoading(true);
      await modalProps.onConfirm();
      closeModal();
    } catch (error) {
      console.error('Confirmation action failed:', error);
      setIsLoading(false);
    }
  }, [modalProps, closeModal]);

  return {
    isOpen,
    isLoading,
    modalProps,
    openModal,
    closeModal,
    handleConfirm,
  };
};
```

Usage example:

```tsx
// Example usage in a component
import React from 'react';
import ConfirmationModal from './ConfirmationModal';
import { useConfirmationModal } from './hooks/useConfirmationModal';

const ExampleComponent: React.FC = () => {
  const { isOpen, isLoading, modalProps, openModal, closeModal, handleConfirm } = useConfirmationModal();

  const handleDelete = () => {
    openModal({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Item deleted');
      },
    });
  };

  const handlePublish = () => {
    openModal({
      title: 'Publish Content',
      message: 'Are you sure you want to publish this content? It will be visible to all users.',
      confirmText: 'Publish',
      cancelText: 'Cancel',
      variant: 'primary',
      onConfirm: async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Content published');
      },
    });
  };

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete Item
      </button>
      
      <button
        onClick={handlePublish}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Publish Content
      </button>

      {modalProps && (
        <ConfirmationModal
          isOpen={isOpen}
          onClose={closeModal}
          onConfirm={handleConfirm}
          title={modalProps.title}
          message={modalProps.message}
          confirmText={modalProps.confirmText}
          cancelText={modalProps.cancelText}
          variant={modalProps.variant}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ExampleComponent;
```

And here are the unit tests:

```tsx
// __tests__/ConfirmationModal.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmationModal from '../ConfirmationModal';

describe('ConfirmationModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Test Title',
    message: 'Test message',
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

  it('closes modal when ESC key is pressed', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    await user.keyboard('{Escape}');
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('closes modal when backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    const backdrop = document.querySelector('.bg-black.bg-opacity-50');
    if (backdrop) {
      await user.click(backdrop);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('shows loading state when isLoading is true', () => {
    render(<ConfirmationModal {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });

  it('uses custom button text when provided', () => {
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

  it('applies correct variant styles', () => {
    render(<ConfirmationModal {...defaultProps} variant="danger" />);
    
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveClass('bg-red-600');
  });

  it('traps focus within modal', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    const confirmButton = screen.getByText('Confirm');
    
    // Focus should start on first focusable element
    await waitFor(() => {
      expect(cancelButton).toHaveFocus();
    });
    
    // Tab should move to next focusable element
    await user.tab();
    expect(confirmButton).toHaveFocus();
    
    // Tab from last element should wrap to first
    await user.tab();
    expect(cancelButton).toHaveFocus();
    
    // Shift+Tab should move backwards
    await user.tab({ shift: true });
    expect(confirmButton).toHaveFocus();
  });

  it('has proper ARIA attributes', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog
