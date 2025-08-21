import React from 'react'
import { createPortal } from 'react-dom'
import { Product } from '@/types/product'
import ImportProduct from '@/components/Products/ImportProduct'

interface ImportProductModalProps {
  isVisible: boolean
  onClose: () => void
  onImport: (products: Product[]) => void
}

const ImportProductModal = React.memo(({ 
  isVisible, 
  onClose, 
  onImport 
}: ImportProductModalProps) => {
  if (!isVisible) return null

  return createPortal(
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="box" style={{ maxHeight: '90vh', overflowY: 'auto', padding: '20px' }}>
          <ImportProduct
            onImport={onImport}
            onClose={onClose}
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

ImportProductModal.displayName = 'ImportProductModal'

export default ImportProductModal 