I'll create a reusable confirmation modal component based on your requirements. Since I can't access the Figma link, I'll implement a well-structured modal following modern design patterns and accessibility standards.

```tsx
// ConfirmationModal.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ConfirmationModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Modal title */
  title: string;
  /** Modal message/body content */
  message: string;
  /** Primary button text (default: "Confirm") */
  primaryButtonText?: string;
  /** Secondary button text (default: "Cancel") */
  secondaryButtonText?: string;
  /** Primary button variant for different actions */
  primaryButtonVariant?: 'danger' | 'primary' | 'success';
  /** Callback when primary button is clicked */
  onConfirm: () => void;
  /** Callback when modal should close (cancel, ESC, overlay click) */
  onCancel: () => void;
  /** Whether primary button is in loading state */
  isLoading?: boolean;
  /** Custom className for additional styling */
  className?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  primaryButtonText = 'Confirm',
  secondaryButtonText = 'Cancel',
  primaryButtonVariant = 'primary',
  onConfirm,
  onCancel,
  isLoading = false,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);

  // Focus trap implementation
  const setupFocusTrap = useCallback(() => {
    if (!modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    firstFocusableElement.current = focusableElements[0] as HTMLElement;
    lastFocusableElement.current = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element
    firstFocusableElement.current?.focus();
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      onCancel();
      return;
    }

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement.current) {
          event.preventDefault();
          lastFocusableElement.current?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement.current) {
          event.preventDefault();
          firstFocusableElement.current?.focus();
        }
      }
    }
  }, [isOpen, onCancel]);

  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  // Handle modal open/close effects
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Setup focus trap
      setTimeout(setupFocusTrap, 100);
      
      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus to previously focused element
      previousActiveElement.current?.focus();
      
      // Remove event listeners
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown, setupFocusTrap]);

  // Get button styles based on variant
  const getPrimaryButtonStyles = () => {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (primaryButtonVariant) {
      case 'danger':
        return `${baseStyles} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
      case 'success':
        return `${baseStyles} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`;
      default:
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
    }
  };

  const secondaryButtonStyles = 'px-4 py-2 rounded-lg font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200';

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Overlay with animation */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-out"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* Modal content with animation */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95"
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
            className={secondaryButtonStyles}
            onClick={onCancel}
            disabled={isLoading}
          >
            {secondaryButtonText}
          </button>
          <button
            type="button"
            className={getPrimaryButtonStyles()}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            ) : (
              primaryButtonText
            )}
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
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonVariant?: 'danger' | 'primary' | 'success';
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
      setIsLoading(false);
      // Handle error as needed
      console.error('Confirmation action failed:', error);
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

Here's how to use the modal component:

```tsx
// Example usage in a parent component
import React from 'react';
import ConfirmationModal, { useConfirmationModal } from './ConfirmationModal';

const ExampleComponent: React.FC = () => {
  const { isOpen, isLoading, modalProps, openModal, closeModal, handleConfirm } = useConfirmationModal();

  const handleDelete = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Item deleted!');
  };

  const handlePublish = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Content published!');
  };

  return (
    <div className="p-8 space-y-4">
      <button
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={() => openModal({
          title: 'Delete Item',
          message: 'Are you sure you want to delete this item? This action cannot be undone.',
          primaryButtonText: 'Delete',
          primaryButtonVariant: 'danger',
          onConfirm: handleDelete,
        })}
      >
        Delete Item
      </button>

      <button
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => openModal({
          title: 'Publish Content',
          message: 'Are you sure you want to publish this content? It will be visible to all users.',
          primaryButtonText: 'Publish',
          primaryButtonVariant: 'success',
          onConfirm: handlePublish,
        })}
      >
        Publish Content
      </button>

      {modalProps && (
        <ConfirmationModal
          isOpen={isOpen}
          title={modalProps.title}
          message={modalProps.message}
          primaryButtonText={modalProps.primaryButtonText}
          secondaryButtonText={modalProps.secondaryButtonText}
          primaryButtonVariant={modalProps.primaryButtonVariant}
          onConfirm={handleConfirm}
          onCancel={closeModal}
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
// ConfirmationModal.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmationModal from './ConfirmationModal';

const defaultProps = {
  isOpen: true,
  title: 'Test Title',
  message: 'Test message',
  onConfirm: jest.fn(),
  onCancel: jest.fn(),
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

  it('calls onConfirm when primary button is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    await user.click(screen.getByText('Confirm'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when secondary button is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    await user.click(screen.getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when ESC key is pressed', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    await user.keyboard('{Escape}');
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when overlay is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    const overlay = screen.getByRole('dialog').firstChild as HTMLElement;
    await user.click(overlay);
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isLoading is true', () => {
    render(<ConfirmationModal {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });

  it('uses custom button texts when provided', () => {
    render(
      <ConfirmationModal
        {...defaultProps}
        primaryButtonText="Delete"
        secondaryButtonText="Keep"
      />
    );
    
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Keep')).toBeInTheDocument();
  });

  it('applies correct styles for danger variant', () => {
    render(<ConfirmationModal {...defaultProps} primaryButtonVariant="danger" />);
    
    const primaryButton = screen.getByText('Confirm');
    expect(primaryButton).toHaveClass('bg-red-600');
  });

  it('traps focus within modal', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    const confirmButton = screen.getByText('Confirm');
    
    // Focus should start on first foc
