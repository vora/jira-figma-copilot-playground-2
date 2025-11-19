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
    if (!isOpen) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Add event listener for ESC key
    document.addEventListener('keydown', handleKeyDown);

    // Set up focus trap
    const modal = modalRef.current;
    if (modal) {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
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
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const getButtonVariantClasses = (variant: string = 'primary') => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'danger':
        return `${baseClasses} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500`;
      case 'success':
        return `${baseClasses} bg-green-600 hover:bg-green-700 text-white focus:ring-green-500`;
      case 'primary':
      default:
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`;
    }
  };

  const secondaryButtonClasses = 'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackgroundClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Background overlay with animation */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 animate-in fade-in" />
      
      {/* Modal content */}
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6
          transform transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-2
          ${className}
        `}
      >
        {/* Header */}
        <div className="mb-4">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-gray-900 leading-6"
          >
            {title}
          </h2>
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

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
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
    confirmModal,
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
  // Method 1: Direct usage
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    console.log('Item deleted!');
    setShowModal(false);
  };

  // Method 2: Using the hook (recommended)
  const { isOpen, config, openModal, closeModal, confirmModal } = useConfirmationModal();

  const handleDeleteWithHook = async () => {
    const confirmed = await openModal({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      primaryButton: {
        text: 'Delete',
        variant: 'danger',
      },
      secondaryButton: {
        text: 'Cancel',
      },
    });

    if (confirmed) {
      console.log('Item deleted!');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Modal Examples</h1>
      
      {/* Method 1: Direct usage */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-red-600 text-white px-4 py-2 rounded mr-4"
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
        }}
        secondaryButton={{
          text: 'Cancel',
          onClick: () => setShowModal(false),
        }}
        onClose={() => setShowModal(false)}
      />

      {/* Method 2: Using hook */}
      <button
        onClick={handleDeleteWithHook}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Delete Item (Hook)
      </button>

      {config && (
        <ConfirmationModal
          isOpen={isOpen}
          title={config.title}
          message={config.message}
          primaryButton={{
            ...config.primaryButton,
            onClick: confirmModal,
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
    
    const primaryButton = screen.getByText('Confirm');
    await user.click(primaryButton);
    
    expect(defaultProps.primaryButton.onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when secondary button is clicked', async () => {
    const user = userEvent.setup();
    const secondaryButton = {
      text: 'Cancel',
      onClick: jest.fn(),
    };
    
    render(
      <ConfirmationModal
        {...defaultProps}
        secondaryButton={secondaryButton}
      />
    );
    
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(secondaryButton.onClick).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows loading state on primary button', () => {
    render(
      <ConfirmationModal
        
