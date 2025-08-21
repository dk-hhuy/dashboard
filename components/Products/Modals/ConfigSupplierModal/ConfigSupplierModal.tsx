import React from 'react'
import { createPortal } from 'react-dom'
import ConfigSupplier from '@/components/Products/ConfigSupplier'

interface ConfigSupplierModalProps {
  isVisible: boolean
  onClose: () => void
}

const ConfigSupplierModal = React.memo(({ isVisible, onClose }: ConfigSupplierModalProps) => {
  if (!isVisible) return null

  return createPortal (
    <div className="modal is-active">
        <div className="modal-background" onClick={onClose}></div>
        <div 
          className="modal-content" 
          style={{ 
            width: '50vw', 
            maxWidth: '1600px', 
            margin: '0 auto',
            transform: 'none'
          }}
        >
            <div className="box" style={{ maxHeight: '90vh', overflowY: 'auto', padding: '20px' }}>
                <ConfigSupplier onClose={onClose} />
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

ConfigSupplierModal.displayName = 'ConfigSupplierModal'

export default ConfigSupplierModal