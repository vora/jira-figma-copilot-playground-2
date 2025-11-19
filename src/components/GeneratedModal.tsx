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
  /** Whether to show close button in header */
  showCloseButton?: boolean;
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
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);

  // Focus trap implementation
  const updateFocusableElements = useCallback(() => {
    if (!modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    firstFocusableElement.current = focusableElements[0] as HTMLElement;
    lastFocusableElement.current = focusableElements[focusableElements.length - 1] as HTMLElement;
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        onCancel();
        break;
      case 'Tab':
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
        break;
    }
  }, [isOpen, onCancel]);

  // Handle overlay click
  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  // Manage focus and event listeners
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Add event listener
      document.addEventListener('keydown', handleKeyDown);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus first element after animation
      setTimeout(() => {
        updateFocusableElements();
        firstFocusableElement.current?.focus();
      }, 150);
    } else {
      // Restore focus
      previousActiveElement.current?.focus();
      
      // Remove event listener
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore body scroll
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown, updateFocusableElements]);

  // Get button styles based on variant
  const getPrimaryButtonStyles = () => {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (primaryButtonVariant) {
      case 'danger':
        return `${baseStyles} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500`;
      case 'success':
        return `${baseStyles} bg-green-600 hover:bg-green-700 text-white focus:ring-green-500`;
      default:
        return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`;
    }
  };

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
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 ${
          isOpen ? 'animate-slideIn scale-100' : 'animate-slideOut scale-95'
        } ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-gray-900 leading-6"
          >
            {title}
          </h2>
          {showCloseButton && (
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <p
            id="modal-description"
            className="text-gray-600 leading-relaxed"
          >
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 p-6 pt-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {secondaryButtonText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={getPrimaryButtonStyles()}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
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

Now, let's add the required CSS animations to your Tailwind config or CSS file:

```css
/* Add these animations to your global CSS or Tailwind config */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
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

Here's an example of how to use the component:

```tsx
// Example usage
import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const ExampleComponent: React.FC = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const handleDelete = async () => {
    // Perform delete action
    console.log('Item deleted');
    setIsDeleteModalOpen(false);
  };

  const handlePublish = async () => {
    // Perform publish action
    console.log('Content published');
    setIsPublishModalOpen(false);
  };

  return (
    <div className="p-8">
      <button
        onClick={() => setIsDeleteModalOpen(true)}
        className="bg-red-600 text-white px-4 py-2 rounded mr-4"
      >
        Delete Item
      </button>
      
      <button
        onClick={() => setIsPublishModalOpen(true)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Publish Content
      </button>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        primaryButtonText="Delete"
        primaryButtonVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={isPublishModalOpen}
        title="Publish Content"
        message="Are you ready to publish this content? It will be visible to all users."
        primaryButtonText="Publish"
        primaryButtonVariant="success"
        onConfirm={handlePublish}
        onCancel={() => setIsPublishModalOpen(false)}
      />
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
    
    const overlay = screen.getByRole('dialog');
    await user.click(overlay);
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows loading state on primary button', () => {
    render(<ConfirmationModal {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button',
