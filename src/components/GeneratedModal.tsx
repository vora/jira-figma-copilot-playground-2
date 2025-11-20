Based on the requirements, I'll create a reusable confirmation modal component with TypeScript and React. Here's the implementation:

## ConfirmationModal Component

```tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  primaryButton: {
    text: string;
    onClick: () => void;
    variant?: 'danger' | 'primary';
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

      // Find focusable elements
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        firstFocusableElement.current = focusableElements[0] as HTMLElement;
        lastFocusableElement.current = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        // Focus the first focusable element
        setTimeout(() => {
          firstFocusableElement.current?.focus();
        }, 100);
      }

      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        // Cleanup
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';

        // Restore focus to the previously focused element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackgroundClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className={`
          relative w-full max-w-md bg-white rounded-lg shadow-xl
          animate-in zoom-in-95 duration-200
          ${className}
        `}
      >
        {/* Modal Content */}
        <div className="p-6">
          {/* Title */}
          <h2
            id="modal-title"
            className="text-lg font-semibold text-gray-900 mb-2"
          >
            {title}
          </h2>

          {/* Message */}
          <p
            id="modal-description"
            className="text-sm text-gray-600 mb-6 leading-relaxed"
          >
            {message}
          </p>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            {/* Secondary Button */}
            <button
              type="button"
              onClick={handleSecondaryClick}
              className="
                px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-blue-500 transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={primaryButton.loading}
            >
              {secondaryButton.text}
            </button>

            {/* Primary Button */}
            <button
              type="button"
              onClick={primaryButton.onClick}
              disabled={primaryButton.loading}
              className={`
                px-4 py-2 text-sm font-medium text-white rounded-md
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                transition-colors duration-200 min-w-[80px]
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  primaryButton.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }
              `}
            >
              {primaryButton.loading ? (
                <div className="flex items-center justify-center">
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                primaryButton.text
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

## Usage Examples

```tsx
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

  const handlePublish = () => {
    console.log('Content published');
    setIsPublishModalOpen(false);
  };

  return (
    <div className="p-8">
      <div className="space-x-4">
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete Item
        </button>

        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Publish Content
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        primaryButton={{
          text: 'Delete',
          onClick: handleDelete,
          variant: 'danger',
          loading: isLoading,
        }}
        secondaryButton={{
          text: 'Cancel',
          onClick: () => {},
        }}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      {/* Publish Confirmation Modal */}
      <ConfirmationModal
        isOpen={isPublishModalOpen}
        title="Publish Content"
        message="Are you ready to publish this content? It will be visible to all users immediately."
        primaryButton={{
          text: 'Publish',
          onClick: handlePublish,
          variant: 'primary',
        }}
        onClose={() => setIsPublishModalOpen(false)}
      />
    </div>
  );
};

export default ExampleUsage;
```

## Unit Tests

```tsx
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

  it('calls onClose when background is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    const backdrop = screen.getByRole('dialog');
    await user.click(backdrop);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls primary button onClick when clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    const confirmButton = screen.getByText('Confirm');
    await user.click(confirmButton);
    
    expect(defaultProps.primaryButton.onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when secondary button is clicked', async () => {
    const user = userEvent.setup();
    const secondaryButton = { text: 'Cancel', onClick: jest.fn() };
    render(
      <ConfirmationModal {...defaultProps} secondaryButton={secondaryButton} />
    );
    
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(secondaryButton.onClick).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('shows loading state on primary button', () => {
    const props = {
      ...defaultProps,
      primaryButton: {
        ...defaultProps.primaryButton,
        loading: true,
      },
    };
    
    render(<ConfirmationModal {...props} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeDisabled();
  });

  it('applies danger variant styling', () => {
    const props = {
      ...defaultProps,
      primaryButton: {
        ...defaultProps.primaryButton,
        variant: 'danger' as const,
      },
    };
    
    render(<ConfirmationModal {...props} />);
    
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveClass('bg-red-600');
  });

  it('has proper ARIA attributes', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
  });

  it('traps focus within modal', async () => {
    const user = userEvent.setup();
    render(<ConfirmationModal {...defaultProps} />);
    
    const confirmButton = screen.getByText('Confirm');
    const cancelButton = screen.getByText('Cancel');
    
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
  });
});
```

## Key Features

1. **Accessibility**: Full ARIA support, focus trapping, and keyboard navigation
2. **Responsive**: Works on mobile and desktop with Tailwind CSS
3. **Customizable**: Configurable buttons, variants, and loading states
4. **Animations**: Smooth enter/exit animations using Tailwind's animate-in
5. **Portal Rendering**: Renders outside component tree to avoid z-index issues
6. **TypeScript**: Full
