I'll create a reusable confirmation modal component based on your requirements. Since I can't access the Figma link, I'll implement a well-structured modal following modern design system patterns with proper accessibility and animations.

```tsx
// ConfirmationModal.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

export interface ConfirmationModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Modal title */
  title: string;
  /** Modal message/body content */
  message: string;
  /** Primary button text */
  primaryButtonText?: string;
  /** Secondary button text */
  secondaryButtonText?: string;
  /** Primary button variant */
  primaryButtonVariant?: 'danger' | 'primary' | 'success';
  /** Modal type for icon display */
  type?: 'warning' | 'danger' | 'success' | 'info';
  /** Loading state for primary button */
  isLoading?: boolean;
  /** Disable primary button */
  isPrimaryDisabled?: boolean;
  /** Hide close button */
  hideCloseButton?: boolean;
  /** Prevent closing on overlay click */
  preventOverlayClose?: boolean;
  /** Prevent closing on ESC key */
  preventEscClose?: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback for primary button click */
  onPrimaryAction?: () => void;
  /** Callback for secondary button click */
  onSecondaryAction?: () => void;
  /** Custom className for modal content */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  primaryButtonText = 'Confirm',
  secondaryButtonText = 'Cancel',
  primaryButtonVariant = 'primary',
  type = 'info',
  isLoading = false,
  isPrimaryDisabled = false,
  hideCloseButton = false,
  preventOverlayClose = false,
  preventEscClose = false,
  onClose,
  onPrimaryAction,
  onSecondaryAction,
  className = '',
  testId = 'confirmation-modal',
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
    if (event.key === 'Escape' && !preventEscClose) {
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
  }, [getFocusableElements, onClose, preventEscClose]);

  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget && !preventOverlayClose) {
      onClose();
    }
  }, [onClose, preventOverlayClose]);

  const handleSecondaryAction = useCallback(() => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      onClose();
    }
  }, [onSecondaryAction, onClose]);

  // Setup focus management and event listeners
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Focus first focusable element after animation
      const timer = setTimeout(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 150);

      return () => {
        clearTimeout(timer);
      };
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      
      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown, getFocusableElements]);

  // Icon mapping
  const getIcon = () => {
    const iconProps = { className: "w-6 h-6", 'aria-hidden': true };
    
    switch (type) {
      case 'warning':
        return <AlertTriangle {...iconProps} className="w-6 h-6 text-amber-500" />;
      case 'danger':
        return <AlertCircle {...iconProps} className="w-6 h-6 text-red-500" />;
      case 'success':
        return <CheckCircle {...iconProps} className="w-6 h-6 text-green-500" />;
      case 'info':
      default:
        return <Info {...iconProps} className="w-6 h-6 text-blue-500" />;
    }
  };

  // Button variant styles
  const getButtonStyles = (variant: string, isSecondary = false) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    if (isSecondary) {
      return `${baseStyles} bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300`;
    }

    switch (variant) {
      case 'danger':
        return `${baseStyles} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
      case 'success':
        return `${baseStyles} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`;
      case 'primary':
      default:
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isOpen ? 'animate-in fade-in duration-200' : 'animate-out fade-out duration-200'
      }`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      data-testid={testId}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200 ${
          isOpen ? 'animate-in zoom-in-95 slide-in-from-bottom-2' : 'animate-out zoom-out-95 slide-out-to-bottom-2'
        } ${className}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start space-x-3">
            {getIcon()}
            <div className="flex-1">
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900 leading-6"
              >
                {title}
              </h2>
            </div>
          </div>
          
          {!hideCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Close modal"
              data-testid={`${testId}-close-button`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <p
            id="modal-description"
            className="text-sm text-gray-600 leading-5 ml-9"
          >
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-6 pt-0 border-t border-gray-100">
          <button
            type="button"
            onClick={handleSecondaryAction}
            className={getButtonStyles('', true)}
            data-testid={`${testId}-secondary-button`}
          >
            {secondaryButtonText}
          </button>
          
          {onPrimaryAction && (
            <button
              type="button"
              onClick={onPrimaryAction}
              disabled={isPrimaryDisabled || isLoading}
              className={getButtonStyles(primaryButtonVariant)}
              data-testid={`${testId}-primary-button`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                primaryButtonText
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsDeleteModalOpen(false);
    console.log('Item deleted');
  };

  const handlePublish = () => {
    setIsPublishModalOpen(false);
    console.log('Content published');
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
        type="danger"
        isLoading={isLoading}
        onClose={() => setIsDeleteModalOpen(false)}
        onPrimaryAction={handleDelete}
        testId="delete-modal"
      />

      {/* Publish Confirmation Modal */}
      <ConfirmationModal
        isOpen={isPublishModalOpen}
        title="Publish Content"
        message="Are you sure you want to publish this content? It will be visible to all users."
        primaryButtonText="Publish"
        primaryButtonVariant="success"
        type="success"
        onClose={() => setIsPublishModalOpen(false)}
        onPrimaryAction={handlePublish}
        testId="publish-modal"
      />
    </div>
  );
};

export default ExampleUsage;
```

```tsx
// __tests__/ConfirmationModal.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmationModal from '../ConfirmationModal';

const defaultProps = {
  isOpen: true,
  title: 'Test Modal',
  message: 'This is a test message',
  onClose: jest.fn(),
};

describe('ConfirmationModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = '';
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

  it('calls onClose when ESC key is pressed', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    await user.keyboard('{Escape}');
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);
    
    expect
