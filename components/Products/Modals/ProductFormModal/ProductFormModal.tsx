import React from 'react'
import { createPortal } from 'react-dom'
import { Product, ProductFormData } from '@/types/product'
import ProductForm from '@/components/Products/ProductForm'

interface ProductFormModalProps {
  isVisible: boolean
  editingProduct: Product | null
  onClose: () => void
  onSave: (data: ProductFormData[]) => void
  onAddMore?: () => void
}

const ProductFormModal = React.memo(({ 
  isVisible, 
  editingProduct, 
  onClose, 
  onSave,
  onAddMore
}: ProductFormModalProps) => {
  if (!isVisible) return null

  return createPortal(
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="box" style={{ maxHeight: '90vh', overflowY: 'auto', padding: '20px' }}>
          <ProductForm
            product={editingProduct || undefined}
            onClose={onClose}
            onSave={onSave}
            onAddMore={onAddMore}
          />
        </div>
      </div>
      <button 
        className="modal-close is-large" 
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>,
    document.body
  )
})

ProductFormModal.displayName = 'ProductFormModal'

export default ProductFormModal 