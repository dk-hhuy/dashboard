import React from 'react'
import Image from 'next/image'

interface ProductImageProps {
  src: string
  alt: string
  onHover: () => void
  onLeave: () => void
}

const ProductImage = React.memo(({ src, alt, onHover, onLeave }: ProductImageProps) => (
  <div 
    className="image image-hover"
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    style={{ 
      cursor: 'pointer',
      display: 'inline-block',
      width: '40px',
      height: '40px'
    }}
  >
    <Image 
      src={src} 
      alt={alt} 
      width={40} 
      height={40}
      className="is-size-7"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  </div>
))

ProductImage.displayName = 'ProductImage'

export default ProductImage 