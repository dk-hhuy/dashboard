"use client"

import React from 'react'
import { Product } from '@/types/product'
import UpdatePrice from '@/components/Products/UpdatePrice'

interface UpdatePriceModalProps {
  isVisible: boolean
  products: Product[]
  onClose: () => void
  onSave: (priceUpdates: any[]) => void
}

const UpdatePriceModal = ({ isVisible, products, onClose, onSave }: UpdatePriceModalProps) => {
  if (!isVisible) return null

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card" style={{ maxWidth: '95vw', maxHeight: '90vh', width: '1200px' }}>
        <div className="modal-card-body" style={{ padding: '0' }}>
          <UpdatePrice 
            products={products}
            onClose={onClose}
            onSave={onSave}
          />
        </div>
      </div>
      <button 
        className="modal-close is-large" 
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  )
}

export default UpdatePriceModal 