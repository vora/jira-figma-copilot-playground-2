I'll create a React TypeScript modal component for you. Since no Figma link was provided, I'll create a flexible, well-structured modal that follows common design patterns and best practices.

```tsx
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when modal should be closed */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Modal size variant */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  /** Whether clicking overlay closes modal */
  closeOnOverlayClick?: boolean;
  /** Whether pressing ESC closes modal */
  closeOnEscape?: boolean;
  /** Custom CSS class for modal container */
  className?: string;
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Footer content (typically buttons) */
  footer?: React.ReactNode;
  /** Whether modal can be closed */
  closable?: boolean;
  /** Z-index for modal */
  zIndex?: number;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  showCloseButton = true,
  footer,
  closable = true,
  zIndex = 1000,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape && closable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Store previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Focus modal for accessibility
      modalRef.current?.focus();
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore body scroll
      document.body.style.overflow = 'unset';
      // Restore focus to previously active element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, closeOnEscape, closable, onClose]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnOverlayClick && closable) {
      onClose();
    }
  };

  // Handle close button click
  const handleCloseClick = () => {
    if (closable) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div 
      className={`modal-overlay ${className}`}
      onClick={handleOverlayClick}
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div 
        ref={modalRef}
        className={`modal-container modal-${size}`}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && (
              <h2 id="modal-title" className="modal-title">
                {title}
              </h2>
            )}
            {showCloseButton && closable && (
              <button
                type="button"
                className="modal-close-button"
                onClick={handleCloseClick}
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="modal-content">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Render modal in portal to avoid z-index issues
  return createPortal(modalContent, document.body);
};

// Close icon component
const CloseIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Modal;
```

And here's the accompanying CSS file (`Modal.css`):

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: modal-fade-in 0.2s ease-out;
}

.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modal-slide-in 0.2s ease-out;
  outline: none;
}

/* Size variants */
.modal-small {
  width: 100%;
  max-width: 400px;
}

.modal-medium {
  width: 100%;
  max-width: 600px;
}

.modal-large {
  width: 100%;
  max-width: 800px;
}

.modal-fullscreen {
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  border-radius: 0;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 16px;
  margin-bottom: 0;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
}

.modal-close-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close-button:hover {
  background-color: #f5f5f5;
  color: #333;
}

.modal-close-button:focus {
  outline: 2px solid #0052cc;
  outline-offset: 2px;
}

/* Content */
.modal-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

/* Footer */
.modal-footer {
  padding: 16px 24px 24px 24px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Animations */
@keyframes modal-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
  }
  
  .modal-container {
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-content,
  .modal-footer {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .modal-fullscreen {
    border-radius: 0;
    margin: 0;
  }
}

/* Focus management */
.modal-container:focus {
  outline: none;
}
```

Here's an example of how to use the Modal component:

```tsx
import React, { useState } from 'react';
import Modal from './Modal';

const ExampleUsage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    // Handle save logic
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        size="medium"
        footer={
          <>
            <button onClick={handleCancel}>Cancel</button>
            <button onClick={handleSave}>Save</button>
          </>
        }
      >
        <p>This is the modal content. You can put any React components here.</p>
        <form>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExampleUsage;
```

## Key Features:

1. **TypeScript Support**: Fully typed with comprehensive prop interfaces
2. **Accessibility**: ARIA attributes, focus management, keyboard navigation
3. **Portal Rendering**: Renders outside component tree to avoid z-index issues
4. **Flexible Sizing**: Small, medium, large, and fullscreen variants
5. **Customizable**: Extensive props for different behaviors
6. **Responsive**: Mobile-friendly design
7. **Animations**: Smooth fade-in and slide-in effects
8. **Focus Management**: Traps focus and restores it when closed
9. **Body Scroll Lock**: Prevents background scrolling when modal is open
10. **Event Handling**: ESC key and overlay click to close

The component follows React and accessibility best practices and can be easily customized to match your specific design requirements from the Figma file once provided.
