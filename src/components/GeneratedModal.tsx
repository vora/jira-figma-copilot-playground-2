Based on the Figma design and requirements, here's a React TypeScript confirmation modal component:

```tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  buttonText,
  onConfirm,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Focus management and keyboard handling
  useEffect(() => {
    if (isOpen) {
      // Focus the button when modal opens
      buttonRef.current?.focus();

      // Handle ESC key
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      // Handle Tab key for focus trapping
      const handleTab = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          // Since we only have one focusable element (the button),
          // prevent tabbing away from it
          event.preventDefault();
          buttonRef.current?.focus();
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTab);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleTab);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-lg shadow-xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* Green Pill Title */}
          <div className="flex justify-center">
            <div
              id="modal-title"
              className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full"
            >
              {title}
            </div>
          </div>

          {/* Message Text */}
          <div
            id="modal-description"
            className="text-center text-gray-700 text-base leading-relaxed px-2"
          >
            {message}
          </div>

          {/* Single Full-Width Button */}
          <div className="pt-2">
            <button
              ref={buttonRef}
              onClick={onConfirm}
              className="w-full bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal in portal to ensure it appears above other content
  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;
```

And here's how to use the component:

```tsx
// Example usage
import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const ExampleComponent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    // Perform delete action
    console.log('Item deleted');
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Delete Item
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="10/21/2021"
        message="Updated ARP Resource Guide Explains Impact On Individual Clients"
        buttonText="Button"
        onConfirm={handleDelete}
        onClose={handleClose}
      />
    </div>
  );
};

export default ExampleComponent;
```

Here's a basic test file for the component:

```tsx
// ConfirmationModal.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmationModal from './ConfirmationModal';

describe('ConfirmationModal', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Test Title',
    message: 'Test message',
    buttonText: 'Confirm',
    onConfirm: jest.fn(),
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
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onConfirm when button is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Confirm'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when ESC key is pressed', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('dialog'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('focuses the button when modal opens', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    expect(screen.getByText('Confirm')).toHaveFocus();
  });
});
```

## Key Features:

1. **Matches Figma Design**: Green pill title, paragraph text, single full-width button
2. **Accessibility**: Proper ARIA labels, focus management, keyboard navigation
3. **Focus Trapping**: Focus stays within modal, ESC key closes it
4. **Responsive**: Works on mobile with proper spacing
5. **Portal Rendering**: Ensures modal appears above all other content
6. **TypeScript**: Fully typed with proper interfaces
7. **Tailwind Classes**: Uses design system classes as requested
8. **No Default UI Patterns**: Custom implementation without standard Confirm/Cancel layout

The component is reusable and can be easily customized for different confirmation scenarios throughout your application.
