I'll create a reusable confirmation modal component based on your requirements. Since I can't access the Figma link, I'll implement a modern, accessible modal that follows common design system patterns.

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
  }, [onCancel]);

  // Handle modal open/close effects
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Setup focus trap
      setupFocusTrap();
      
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

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  const getPrimaryButtonClasses = () => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (primaryButtonVariant) {
      case 'danger':
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
      case 'success':
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`;
      default:
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
    }
  };

  const getSecondaryButtonClasses = () => {
    return 'px-4 py-2 rounded-lg font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200';
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
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all ${
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
        <div className="px-6 pb-6 flex gap-3 justify-end">
          <button
            type="button"
            className={getSecondaryButtonClasses()}
            onClick={onCancel}
            disabled={isLoading}
          >
            {secondaryButtonText}
          </button>
          <button
            type="button"
            className={getPrimaryButtonClasses()}
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
      // Simulate API call
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
      <h1 className="text-2xl font-bold">Confirmation Modal Examples</h1>
      
      <div className="space-x-4">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Item
        </button>
        
        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Publish Content
        </button>
      </div>

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
        message="Are you sure you want to publish this content? It will be visible to all users."
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

```css
/* Add these animations to your Tailwind CSS or global CSS */
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
  animation: fadeIn 0.2s ease-out;
}

.animate-fadeOut {
  animation: fadeOut 0.2s ease-out;
}

.animate-slideIn {
  animation: slideIn 0.2s ease-out;
}

.animate-slideOut {
  animation: slideOut 0.2s ease-out;
}
```

```tsx
// __tests__/ConfirmationModal.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmationModal from '../ConfirmationModal';

describe('ConfirmationModal', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Test Title',
    message: 'Test message',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
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

  it('shows loading state when isLoading is true', () => {
    render(<ConfirmationModal {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });

  it('uses custom button texts', () => {
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

  it('applies danger variant styling', () => {
    render(<ConfirmationModal {...defaultProps} primaryButtonVariant="danger" />);
    
    const primaryButton = screen.getByText('Confirm');
    expect(primaryButton).toHaveClass('bg-red-600');
  });

  it('traps focus within modal', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
