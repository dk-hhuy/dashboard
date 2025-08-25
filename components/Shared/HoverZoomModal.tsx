import React from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

interface HoverZoomModalProps {
  src: string;
  isVisible: boolean;
  alt?: string;
  width?: number;
  height?: number;
}

const HoverZoomModal = React.memo(({ 
  src, 
  isVisible, 
  alt = "zoomed", 
  width = 400, 
  height = 400 
}: HoverZoomModalProps) => {
  const [imageSize, setImageSize] = React.useState({ width: 400, height: 400 });

  // Calculate appropriate size based on viewport
  React.useEffect(() => {
    if (isVisible && typeof window !== 'undefined') {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate max size (70% of viewport, but capped at 400px for better UX)
      const maxSize = Math.min(400, Math.min(viewportWidth * 0.7, viewportHeight * 0.7));
      
      // Ensure minimum size
      const finalSize = Math.max(200, maxSize);
      
      setImageSize({ width: finalSize, height: finalSize });
    }
  }, [isVisible]);

  if (!isVisible || typeof window === 'undefined') return null;

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: `${imageSize.width + 40}px`, // image width + padding
        maxHeight: `${imageSize.height + 40}px`, // image height + padding
        minWidth: '240px', // 200px + 40px padding
        minHeight: '240px', // 200px + 40px padding
        width: 'auto',
        height: 'auto',
        cursor: 'pointer'
      }}
      onClick={(e) => {
        // Close modal when clicking on it
        e.stopPropagation();
        // You can add a close handler here if needed
      }}
    >
      <Image 
        src={src} 
        alt={alt} 
        width={imageSize.width} 
        height={imageSize.height} 
        style={{ 
          objectFit: 'contain',
          width: '100%',
          height: '100%',
          maxWidth: `${imageSize.width}px`,
          maxHeight: `${imageSize.height}px`
        }} 
      />
    </div>
  );

  return createPortal(modalContent, document.body);
});

HoverZoomModal.displayName = 'HoverZoomModal';

export default HoverZoomModal; 