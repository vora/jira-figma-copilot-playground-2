Based on the Figma design and requirements, here's a React TypeScript confirmation modal component:

```tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "10/21/2021",
  message = "Updated ARP Resource Guide Explains Impact On Individual Clients",
  buttonText = "Button"
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus trap and ESC key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap
      if (event.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
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
    
    // Focus the first focusable element when modal opens
    setTimeout(() => {
      firstFocusableRef.current?.focus();
    }, 0);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
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
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Green pill title - left aligned */}
        <div className="mb-4">
          <span 
            id="modal-title"
            className="inline-block bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full"
          >
            {title}
          </span>
        </div>

        {/* Message paragraph - left aligned */}
        <p 
          id="modal-description"
          className="text-gray-900 text-base leading-relaxed mb-6 text-left"
        >
          {message}
        </p>

        {/* Single full-width button */}
        <button
          ref={firstFocusableRef}
          onClick={onConfirm}
          className="w-full bg-gray-600 hover:bg-gray-700 focus:bg-gray-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;
```

And here's how to use the component:

```tsx
// Usage example
import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

const ExampleUsage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = () => {
    // Handle confirmation action
    console.log('Confirmed!');
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Modal
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="10/21/2021"
        message="Updated ARP Resource Guide Explains Impact On Individual Clients"
        buttonText="Button"
      />
    </div>
  );
};

export default ExampleUsage;
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
    onClose: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('10/21/2021')).toBeInTheDocument();
    expect(screen.getByText('Updated ARP Resource Guide Explains Impact On Individual Clients')).toBeInTheDocument();
    expect(screen.getByText('Button')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onConfirm when button is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Button'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when ESC key is pressed', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop!);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders custom props correctly', () => {
    const customProps = {
      ...defaultProps,
      title: 'Custom Title',
      message: 'Custom message',
      buttonText: 'Custom Button',
    };

    render(<ConfirmationModal {...customProps} />);
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
    expect(screen.getByText('Custom Button')).toBeInTheDocument();
  });
});
```

## Key Features:

1. **Matches Figma Design**: Green pill title, left-aligned text, single full-width gray button
2. **Accessibility**: Focus trap, ESC key handling, proper ARIA attributes
3. **Responsive**: Works on mobile devices
4. **Reusable**: Accepts props for title, message, and button text
5. **Portal Rendering**: Renders outside the component tree to avoid z-index issues
6. **No Standard Confirm/Cancel Pattern**: Only one button as specified
7. **Tailwind Classes**: Uses utility classes for styling
8. **TypeScript**: Fully typed with proper interfaces

The component follows the exact requirements from the Jira description and matches the design shown in the image.
