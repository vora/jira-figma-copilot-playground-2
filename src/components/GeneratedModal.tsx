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
  /** Custom CSS classes for the modal */
  className?: string;
  /** Disable overlay click to close */
  disableOverlayClose?: boolean;
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
  disableOverlayClose = false,
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
    if (!isOpen) return;

    if (event.key === 'Escape') {
      onCancel();
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
  }, [isOpen, onCancel, getFocusableElements]);

  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (disableOverlayClose) return;
    if (event.target === event.currentTarget) {
      onCancel();
    }
  }, [onCancel, disableOverlayClose]);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus first focusable element after animation
      const timer = setTimeout(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 150);

      return () => clearTimeout(timer);
    } else {
      // Restore focus when modal closes
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen, getFocusableElements]);

  // Add/remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  // Button variant styles
  const getButtonStyles = (variant: string) => {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'danger':
        return `${baseStyles} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500`;
      case 'success':
        return `${baseStyles} bg-green-600 hover:bg-green-700 text-white focus:ring-green-500`;
      case 'primary':
      default:
        return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`;
    }
  };

  const secondaryButtonStyles = 'px-4 py-2 rounded-lg font-medium border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isOpen ? 'animate-fadeIn' : 'animate-fadeOut'
      }`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 ${
          isOpen ? 'animate-slideIn scale-100' : 'animate-slideOut scale-95'
        } ${className}`}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-gray-900 leading-6"
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
            onClick={onCancel}
            className={secondaryButtonStyles}
            disabled={isLoading}
          >
            {secondaryButtonText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={getButtonStyles(primaryButtonVariant)}
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

  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;
```

```css
/* Add these animations to your global CSS or Tailwind config */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-fadeOut {
  animation: fadeOut 0.3s ease-out;
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out;
}

.animate-slideOut {
  animation: slideOut 0.3s ease-out;
}
```

```tsx
// Example usage component
import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const ExampleUsage: React.FC = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Item deleted');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Content published');
      setIsPublishModalOpen(false);
    } catch (error) {
      console.error('Publish failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <button
        onClick={() => setIsDeleteModalOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Delete Item
      </button>

      <button
        onClick={() => setIsPublishModalOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Publish Content
      </button>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        primaryButtonText="Delete"
        primaryButtonVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={isLoading}
      />

      {/* Publish Confirmation Modal */}
      <ConfirmationModal
        isOpen={isPublishModalOpen}
        title="Publish Content"
        message="Are you ready to publish this content? It will be visible to all users."
        primaryButtonText="Publish"
        primaryButtonVariant="success"
        onConfirm={handlePublish}
        onCancel={() => setIsPublishModalOpen(false)}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ExampleUsage;
```

```tsx
// Unit tests - ConfirmationModal.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmationModal from './ConfirmationModal';

const defaultProps = {
  isOpen: true,
  title: 'Test Modal',
  message: 'This is a test message',
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
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
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

  it('calls onCancel when cancel button is clicked', async () => {
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
    
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not call onCancel when overlay click is disabled', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} disableOverlayClose />);
    
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    expect(defaultProps.onCancel).not.toHaveBeenCalled();
  });

  it('shows loading state on primary button', () => {
    render(<ConfirmationModal {...defaultProps} isLoading />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });

  it('applies correct variant styles', () => {
    render(<ConfirmationModal {...defaultProps} primaryButtonVariant="danger" />);
