import React from 'react'
import { createPortal } from 'react-dom'
import { Product } from '@/types/product'
import DetailAddImage from '@/components/Products/DetailAddImage'

interface DetailAddImageModalProps {
  isVisible: boolean
  onClose: () => void
  onUpload: (product: Product) => void
  product: Product
}

const DetailAddImageModal = React.memo(({ 
  isVisible, 
  onClose, 
  onUpload,
  product
}: DetailAddImageModalProps) => {
  if (!isVisible) return null

  const handleModalClose = () => {
    onClose()
  }

  return createPortal(
    <div className="modal is-active">
      <div className="modal-background" onClick={handleModalClose}></div>
      <div className="modal-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="box p-5" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <DetailAddImage
            key={product.productSku} // Force re-render when product changes
            product={product}
            onUpload={onUpload}
            onClose={onClose}
          />
        </div>
      </div>
      <button 
        className="modal-close is-large" 
        aria-label="close"
        onClick={handleModalClose}
      ></button>
    </div>,
    document.body
  )
})

DetailAddImageModal.displayName = 'DetailAddImageModal'

export default DetailAddImageModal 