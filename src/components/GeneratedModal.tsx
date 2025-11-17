I'll create a reusable confirmation modal component based on your requirements. Since I can't access the Figma link, I'll implement a well-structured modal following common design system patterns.

## ConfirmationModal Component

```tsx
// src/components/ConfirmationModal/ConfirmationModal.tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './ConfirmationModal.css';

export interface ConfirmationModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Modal title */
  title: string;
  /** Modal message body */
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
  /** Whether primary button is loading */
  isLoading?: boolean;
  /** Custom CSS class */
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

  // Focus trap functionality
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
      onSecondaryAction();
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
  }, [isOpen, onSecondaryAction, getFocusableElements]);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Add event listeners
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      // Focus first focusable element
      setTimeout(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 100);
    } else {
      // Restore focus and cleanup
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown, getFocusableElements]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onSecondaryAction();
    }
  };

  const handlePrimaryClick = () => {
    if (!isLoading) {
      onPrimaryAction();
    }
  };

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
              className={`confirmation-modal__button confirmation-modal__button--primary confirmation-modal__button--${primaryButtonVariant}`}
              onClick={handlePrimaryClick}
              disabled={isLoading}
              data-testid={`${testId}-primary-button`}
            >
              {isLoading ? (
                <>
                  <span className="confirmation-modal__spinner" />
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

export default ConfirmationModal;
```

## CSS Styles

```css
/* src/components/ConfirmationModal/ConfirmationModal.css */
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
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  transform: scale(0.95) translateY(-10px);
  transition: transform 0.2s ease-in-out;
}

.confirmation-modal-overlay--open .confirmation-modal {
  transform: scale(1) translateY(0);
}

.confirmation-modal__content {
  padding: 24px;
}

.confirmation-modal__title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  color: #1a1a1a;
}

.confirmation-modal__message {
  margin: 0 0 24px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #666666;
}

.confirmation-modal__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.confirmation-modal__button {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
}

.confirmation-modal__button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.confirmation-modal__button--secondary {
  background-color: #f5f5f5;
  color: #666666;
  border: 1px solid #e0e0e0;
}

.confirmation-modal__button--secondary:hover:not(:disabled) {
  background-color: #eeeeee;
  border-color: #d0d0d0;
}

.confirmation-modal__button--primary {
  background-color: #007bff;
  color: white;
}

.confirmation-modal__button--primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.confirmation-modal__button--danger {
  background-color: #dc3545;
  color: white;
}

.confirmation-modal__button--danger:hover:not(:disabled) {
  background-color: #c82333;
}

.confirmation-modal__button--success {
  background-color: #28a745;
  color: white;
}

.confirmation-modal__button--success:hover:not(:disabled) {
  background-color: #1e7e34;
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

/* Mobile responsiveness */
@media (max-width: 480px) {
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

## Hook for Modal State Management

```tsx
// src/hooks/useConfirmationModal.ts
import { useState, useCallback } from 'react';

interface UseConfirmationModalReturn {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export const useConfirmationModal = (initialState = false): UseConfirmationModalReturn => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};
```

## Usage Example

```tsx
// src/components/ExampleUsage.tsx
import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal/ConfirmationModal';
import { useConfirmationModal } from '../hooks/useConfirmationModal';

const ExampleUsage: React.FC = () => {
  const { isOpen, openModal, closeModal } = useConfirmationModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Item deleted');
      closeModal();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <button onClick={openModal}>Delete Item</button>
      
      <ConfirmationModal
        isOpen={isOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        primaryButtonVariant="danger"
        onPrimaryAction={handleDelete}
        onSecondaryAction={closeModal}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ExampleUsage;
```

## Storybook Stories

```tsx
// src/components/ConfirmationModal/ConfirmationModal.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import ConfirmationModal from './ConfirmationModal';
import { useConfirmationModal } from '../../hooks/useConfirmationModal';

const meta: Meta<typeof ConfirmationModal> = {
  title: 'Components/ConfirmationModal',
  component: ConfirmationModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ModalWrapper = (args: any) => {
  const { isOpen, openModal, closeModal } = useConfirmationModal();
  
  return (
    <>
      <button onClick={openModal}>Open Modal</button>
      <ConfirmationModal
        {...args}
        isOpen={isOpen}
        onSecondaryAction={closeModal}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed with this action?',
    primaryButtonText: 'Confirm',
    secondaryButtonText: 'Cancel',
    onPrimaryAction: () => console.log('Primary action'),
  },
};

export const DeleteConfirmation: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item? This action cannot be undone.',
    primaryButtonText: 'Delete',
    secondaryButtonText: 'Cancel',
    primaryButtonVariant: 'danger',
    onPrimaryAction: () => console.log('Delete action'),
  },
};

export const PublishConfirmation: Story = {
  render: (args) => <ModalWrapper {...args} />,
  args: {
    title: 'Publish Content',
    message: 'Are you ready to publish this content? It will be visible to all users.',
    primaryButtonText: 'Publish',
    secon
