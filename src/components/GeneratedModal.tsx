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
        onSecondaryAction();
        break;
      case 'Tab':
        if (!firstFocusableElement.current || !lastFocusableElement.current) return;
        
        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement.current) {
            event.preventDefault();
            lastFocusableElement.current.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement.current) {
            event.preventDefault();
            firstFocusableElement.current.focus();
          }
        }
        break;
    }
  }, [isOpen, onSecondaryAction]);

  // Handle overlay click
  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onSecondaryAction();
    }
  }, [onSecondaryAction]);

  // Handle primary action
  const handlePrimaryAction = useCallback(() => {
    if (!isLoading) {
      onPrimaryAction();
    }
  }, [onPrimaryAction, isLoading]);

  // Effects
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Update focusable elements and focus first one
      updateFocusableElements();
      setTimeout(() => {
        firstFocusableElement.current?.focus();
      }, 100);
      
      // Add keyboard listeners
      document.addEventListener('keydown', handleKeyDown);
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus
      previousActiveElement.current?.focus();
      
      // Remove keyboard listeners
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown, updateFocusableElements]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`confirmation-modal-overlay ${isOpen ? 'confirmation-modal-overlay--open' : ''}`}
      onClick={handleOverlayClick}
      data-testid={`${testId}-overlay`}
    >
      <div
        ref={modalRef}
        className={`confirmation-modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${testId}-title`}
        aria-describedby={`${testId}-message`}
        data-testid={testId}
      >
        <div className="confirmation-modal__content">
          <h2
            id={`${testId}-title`}
            className="confirmation-modal__title"
            data-testid={`${testId}-title`}
          >
            {title}
          </h2>
          
          <p
            id={`${testId}-message`}
            className="confirmation-modal__message"
            data-testid={`${testId}-message`}
          >
            {message}
          </p>
        </div>

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
            className={`confirmation-modal__button confirmation-modal__button--primary confirmation-modal__button--${primaryButtonVariant}`}
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
  );

  return createPortal(modalContent, document.body);
};
```

## CSS Styles

```css
/* components/ConfirmationModal/ConfirmationModal.css */
.confirmation-modal-overlay {
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
  visibility: hidden;
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
}

.confirmation-modal-overlay--open {
  opacity: 1;
  visibility: visible;
}

.confirmation-modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.9) translateY(-20px);
  transition: transform 0.2s ease-in-out;
}

.confirmation-modal-overlay--open .confirmation-modal {
  transform: scale(1) translateY(0);
}

.confirmation-modal__content {
  padding: 24px 24px 16px;
}

.confirmation-modal__title {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: #1a1a1a;
}

.confirmation-modal__message {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #666;
}

.confirmation-modal__actions {
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px;
  justify-content: flex-end;
}

.confirmation-modal__button {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
}

.confirmation-modal__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.confirmation-modal__button--secondary {
  background: white;
  border-color: #d1d5db;
  color: #374151;
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
  border-color: #3b82f6;
  color: white;
}

.confirmation-modal__button--primary:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.confirmation-modal__button--danger {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
}

.confirmation-modal__button--danger:hover:not(:disabled) {
  background: #b91c1c;
  border-color: #b91c1c;
}

.confirmation-modal__button--success {
  background: #059669;
  border-color: #059669;
  color: white;
}

.confirmation-modal__button--success:hover:not(:disabled) {
  background: #047857;
  border-color: #047857;
}

.confirmation-modal__button--primary:focus,
.confirmation-modal__button--danger:focus,
.confirmation-modal__button--success:focus {
  outline: 2px solid currentColor;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile responsive */
@media (max-width: 480px) {
  .confirmation-modal-overlay {
    padding: 16px;
  }
  
  .confirmation-modal {
    max-width: none;
    margin: 0;
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Perform delete operation
      await deleteItem();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button onClick={() => setShowDeleteModal(true)}>
        Delete Item
      </button>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        primaryButtonVariant="danger"
        onPrimaryAction={handleDelete}
        onSecondaryAction={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
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
      control: { type: 'select' },
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
    message: 'Are you sure you want to proceed with this action?',
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
  },
};

export const Loading: Story = {
  args: {
    isOpen: true,
    title: 'Processing',
    message: 'Please wait while we process your request.',
    isLoading: true,
    onPrimaryAction: () => console.log('Primary action'),
    onSecondaryAction: () => console.log('Secondary action'),
  },
};
```

## Unit Tests

```tsx
// components/ConfirmationModal/ConfirmationModal.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Confirmation
