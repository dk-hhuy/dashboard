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
  width = 300, 
  height = 300 
}: HoverZoomModalProps) => {
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
        maxWidth: '80vw',
        maxHeight: '80vh'
      }}
    >
      <Image 
        src={src} 
        alt={alt} 
        width={width} 
        height={height} 
        style={{ 
          objectFit: 'contain',
          width: '100%',
          height: '100%'
        }} 
      />
    </div>
  );

  return createPortal(modalContent, document.body);
});

HoverZoomModal.displayName = 'HoverZoomModal';

export default HoverZoomModal; 