import { useEffect, useRef } from 'react';

// Hook for handling modal backdrop and escape key
export const useModalHandlers = (
  isOpen: boolean,
  onClose: () => void,
  isLoading: boolean = false
) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  // Handle Escape key and prevent background scrolling
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onClose]);

  return { modalRef, handleBackdropClick };
};
