I'll create a reusable confirmation modal component based on your requirements. Since I can't access the Figma link, I'll implement a well-structured modal following common design system patterns.

## ConfirmationModal Component

```tsx
// components/ConfirmationModal/ConfirmationModal.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './ConfirmationModal.css';

export interface ConfirmationModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Modal title */
  title: string;
  /** Modal message content */
  message: string;
  /** Primary button text */
  primaryButtonText?: string;
  /** Secondary button text */
  secondaryButtonText?: string;
  /** Primary button variant */
  primaryButtonVariant?: 'danger' | 'primary' | 'success';
  /** Callback when primary button is clicked */
  onPrimaryAction: () => void;
  /** Callback when secondary button is clicked or modal is closed */
  onSecondaryAction: () => void;
  /** Whether primary button should be loading */
  isLoading?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Test ID for testing */
  testId?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  primaryButtonText = 'Confirm',
  secondaryButtonText = 'Cancel',
  primaryButtonVariant = 'primary',
  onPrimaryAction,
  onSecondaryAction,
  isLoading = false,
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

  const trapFocus = useCallback((e: KeyboardEvent) => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [getFocusableElements]);

  // Handle escape key
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onSecondaryAction();
    }
  }, [onSecondaryAction]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSecondaryAction();
    }
  }, [onSecondaryAction]);

  // Handle primary action
  const handlePrimaryAction = useCallback(() => {
    if (!isLoading) {
      onPrimaryAction();
    }
  }, [onPrimaryAction, isLoading]);

  // Setup focus management and event listeners
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Add event listeners
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('keydown', trapFocus);
      
      // Focus first element after animation
      setTimeout(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 150);
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Remove event listeners
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('keydown', trapFocus);
      
      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('keydown', trapFocus);
    };
  }, [isOpen, handleEscapeKey, trapFocus, getFocusableElements]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className={`confirmation-modal-backdrop ${isOpen ? 'confirmation-modal-backdrop--open' : ''}`}
      onClick={handleBackdropClick}
      data-testid={`${testId}-backdrop`}
    >
      <div 
        ref={modalRef}
        className={`confirmation-modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-message"
        data-testid={testId}
      >
        <div className="confirmation-modal__content">
          <h2 
            id="modal-title" 
            className="confirmation-modal__title"
            data-testid={`${testId}-title`}
          >
            {title}
          </h2>
          
          <p 
            id="modal-message" 
            className="confirmation-modal__message"
            data-testid={`${testId}-message`}
          >
            {message}
          </p>
          
          <div className="confirmation-modal__actions">
            <button
              type="button"
              className="confirmation-modal__button confirmation-modal__button--secondary"
              onClick={onSecondaryAction}
              disabled={isLoading}
              data-testid={`${testId}-secondary-button`}
            >
              {secondaryButtonText}
            </button>
            
            <button
              type="button"
              className={`confirmation-modal__button confirmation-modal__button--${primaryButtonVariant}`}
              onClick={handlePrimaryAction}
              disabled={isLoading}
              data-testid={`${testId}-primary-button`}
            >
              {isLoading ? (
                <>
                  <span className="confirmation-modal__spinner" aria-hidden="true" />
                  Loading...
                </>
              ) : (
                primaryButtonText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
```

## CSS Styles

```css
/* components/ConfirmationModal/ConfirmationModal.css */
.confirmation-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  opacity: 0;
  animation: fadeIn 0.15s ease-out forwards;
}

.confirmation-modal-backdrop--open {
  opacity: 1;
}

.confirmation-modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  transform: scale(0.95) translateY(-10px);
  animation: slideIn 0.15s ease-out forwards;
}

.confirmation-modal__content {
  padding: 24px;
}

.confirmation-modal__title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: #111827;
}

.confirmation-modal__message {
  margin: 0 0 24px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #6b7280;
}

.confirmation-modal__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.confirmation-modal__button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
}

.confirmation-modal__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.confirmation-modal__button--secondary {
  background: white;
  color: #374151;
  border-color: #d1d5db;
}

.confirmation-modal__button--secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.confirmation-modal__button--secondary:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.confirmation-modal__button--primary {
  background: #3b82f6;
  color: white;
}

.confirmation-modal__button--primary:hover:not(:disabled) {
  background: #2563eb;
}

.confirmation-modal__button--primary:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.confirmation-modal__button--danger {
  background: #ef4444;
  color: white;
}

.confirmation-modal__button--danger:hover:not(:disabled) {
  background: #dc2626;
}

.confirmation-modal__button--danger:focus {
  outline: 2px solid #ef4444;
  outline-offset: 2px;
}

.confirmation-modal__button--success {
  background: #10b981;
  color: white;
}

.confirmation-modal__button--success:hover:not(:disabled) {
  background: #059669;
}

.confirmation-modal__button--success:focus {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.confirmation-modal__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: scale(0.95) translateY(-10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .confirmation-modal {
    margin: 16px;
    max-width: calc(100vw - 32px);
  }
  
  .confirmation-modal__content {
    padding: 20px;
  }
  
  .confirmation-modal__actions {
    flex-direction: column-reverse;
  }
  
  .confirmation-modal__button {
    width: 100%;
    justify-content: center;
  }
}
```

## Usage Example

```tsx
// Example usage in a parent component
import React, { useState } from 'react';
import { ConfirmationModal } from './components/ConfirmationModal/ConfirmationModal';

const ExampleComponent: React.FC = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Perform delete operation
      await deleteItem();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => setIsDeleteModalOpen(true)}>
        Delete Item
      </button>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        primaryButtonVariant="danger"
        onPrimaryAction={handleDelete}
        onSecondaryAction={() => setIsDeleteModalOpen(false)}
        isLoading={isLoading}
        testId="delete-confirmation-modal"
      />
    </div>
  );
};
```

## Storybook Stories

```tsx
// components/ConfirmationModal/ConfirmationModal.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmationModal } from './ConfirmationModal';

const meta: Meta<typeof ConfirmationModal> = {
  title: 'Components/ConfirmationModal',
  component: ConfirmationModal,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    primaryButtonVariant: {
      control: 'select',
      options: ['primary', 'danger', 'success'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to perform this action?',
    onPrimaryAction: () => console.log('Primary action'),
    onSecondaryAction: () => console.log('Secondary action'),
  },
};

export const DeleteConfirmation: Story = {
  args: {
    isOpen: true,
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    primaryButtonText: 'Delete',
    primaryButtonVariant: 'danger',
    onPrimaryAction: () => console.log('Delete confirmed'),
    onSecondaryAction: () => console.log('Delete cancelled'),
  },
};

export const PublishConfirmation: Story = {
  args: {
    isOpen: true,
    title: 'Publish Content',
    message: 'Are you ready to publish this content? It will be visible to all users.',
    primaryButtonText: 'Publish',
    primaryButtonVariant: 'success',
    onPrimaryAction: () => console.log('Publish confirmed'),
    onSecondaryAction: () => console.log('Publish cancelled'),
