I'll create a reusable confirmation modal component based on your requirements. Since I can't access the Figma link, I'll implement a well-structured modal following modern design patterns and accessibility standards.

```tsx
// ConfirmationModal.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  primaryButton: {
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
  className?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  primaryButton,
  secondaryButton = { text: 'Cancel', onClick: () => {} },
  onClose,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);

  // Handle ESC key press
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      // Focus trap
      if (event.key === 'Tab') {
        if (!firstFocusableElement.current || !lastFocusableElement.current) return;

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusableElement.current) {
            event.preventDefault();
            lastFocusableElement.current.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusableElement.current) {
            event.preventDefault();
            firstFocusableElement.current.focus();
          }
        }
      }
    },
    [onClose]
  );

  // Handle background click
  const handleBackgroundClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle secondary button click
  const handleSecondaryClick = useCallback(() => {
    secondaryButton.onClick();
    onClose();
  }, [secondaryButton, onClose]);

  // Setup focus management and event listeners
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Add event listener for ESC key
      document.addEventListener('keydown', handleKeyDown);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Set up focus trap
      const modal = modalRef.current;
      if (modal) {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        firstFocusableElement.current = focusableElements[0] as HTMLElement;
        lastFocusableElement.current = focusableElements[focusableElements.length - 1] as HTMLElement;

        // Focus the first focusable element
        setTimeout(() => {
          firstFocusableElement.current?.focus();
        }, 100);
      }
    }

    return () => {
      // Cleanup
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';

      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  // Don't render if not open
  if (!isOpen) return null;

  const getButtonVariantClasses = (variant: string = 'primary') => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'danger':
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400`;
      case 'success':
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-400`;
      case 'primary':
      default:
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400`;
    }
  };

  const secondaryButtonClasses = 'px-4 py-2 rounded-lg font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200';

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Background overlay with animation */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-out animate-in fade-in"
        onClick={handleBackgroundClick}
        aria-hidden="true"
      />

      {/* Modal content with animation */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out animate-in zoom-in-95 slide-in-from-bottom-4"
      >
        {/* Modal header */}
        <div className="px-6 pt-6 pb-4">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-gray-900 leading-6"
          >
            {title}
          </h2>
        </div>

        {/* Modal body */}
        <div className="px-6 pb-6">
          <p
            id="modal-description"
            className="text-sm text-gray-600 leading-5"
          >
            {message}
          </p>
        </div>

        {/* Modal footer */}
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
            onClick={primaryButton.onClick}
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

  // Render modal in portal
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
  primaryButton: {
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
  const [primaryAction, setPrimaryAction] = useState<(() => void) | null>(null);
  const [secondaryAction, setSecondaryAction] = useState<(() => void) | null>(null);

  const openModal = useCallback((
    modalConfig: UseConfirmationModalProps,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    setConfig(modalConfig);
    setPrimaryAction(() => onConfirm);
    setSecondaryAction(() => onCancel || (() => {}));
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setConfig(null);
    setPrimaryAction(null);
    setSecondaryAction(null);
  }, []);

  return {
    isOpen,
    config,
    primaryAction,
    secondaryAction,
    openModal,
    closeModal,
  };
};
```

Here's how to use the modal component:

```tsx
// Example usage in a parent component
import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { useConfirmationModal } from './useConfirmationModal';

const ExampleComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Method 1: Direct usage
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Item deleted');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  // Method 2: Using the hook
  const {
    isOpen: isHookModalOpen,
    config,
    primaryAction,
    secondaryAction,
    openModal,
    closeModal,
  } = useConfirmationModal();

  const handleDeleteWithHook = () => {
    openModal(
      {
        title: 'Delete Item',
        message: 'Are you sure you want to delete this item? This action cannot be undone.',
        primaryButton: {
          text: 'Delete',
          variant: 'danger',
        },
        secondaryButton: {
          text: 'Cancel',
        },
      },
      () => {
        console.log('Item deleted via hook');
        closeModal();
      },
      () => {
        console.log('Delete cancelled');
      }
    );
  };

  return (
    <div className="p-8">
      <div className="space-x-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Item (Direct)
        </button>

        <button
          onClick={handleDeleteWithHook}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Item (Hook)
        </button>
      </div>

      {/* Direct usage */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        primaryButton={{
          text: 'Delete',
          onClick: handleDelete,
          variant: 'danger',
          loading: isDeleting,
        }}
        secondaryButton={{
          text: 'Cancel',
          onClick: () => {},
        }}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Hook usage */}
      {config && (
        <ConfirmationModal
          isOpen={isHookModalOpen}
          title={config.title}
          message={config.message}
          primaryButton={{
            text: config.primaryButton.text,
            onClick: primaryAction || (() => {}),
            variant: config.primaryButton.variant,
          }}
          secondaryButton={config.secondaryButton}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default ExampleComponent;
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
    primaryButton: {
      text: 'Confirm',
      onClick: jest.fn(),
    },
    onClose: jest.fn(),
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

  it('calls onClose when ESC key is pressed', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    await user.keyboard('{Escape}');
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when background overlay is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls primaryButton onClick when primary button is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    const confirmButton = screen.getByText('Confirm');
    await user.click(confirmButton);
    
    expect(defaultProps.primaryButton.onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when secondary button is clicked', async () => {
    const user = userEvent
