import React, { useState } from 'react'
import { Product } from '@/types/product'
import ProductImage from './ProductImage'
import ProductPrice from './ProductPrice'
import ProductSuppliers from './ProductSuppliers'
import ActionButton from './ActionButton'

interface ProductRowProps {
  product: Product
  onImageHover: (src: string) => void
  onImageLeave: () => void
  onActionClick: (action: string, productSku: string) => void
  isUpdated?: boolean
  isSelected?: boolean
  onSelect?: (productSku: string, isSelected: boolean) => void
}

const ProductRow = React.memo<ProductRowProps>(({ 
  product, 
  onImageHover, 
  onImageLeave,
  onActionClick,
  isUpdated = false,
  isSelected = false,
  onSelect
}) => {
  // Debug: Log product data
  console.log('🖼️ ProductRow rendering:', {
    sku: product.productSku,
    name: product.name,
    mainimage: product.mainimage,
    isUpdated
  })
  const [isChecked, setIsChecked] = useState(isSelected);

  const handleActionClick = (action: string) => {
    onActionClick(action, product.productSku);
  };

  const handleRowClick = (event: React.MouseEvent) => {
    // Don't toggle checkbox if clicking on action buttons
    const target = event.target as HTMLElement;
    if (target.closest('.buttons') || target.closest('button')) {
      return;
    }
    
    const newCheckedState = !isSelected;
    onSelect?.(product.productSku, newCheckedState);
  };

  const handleCheckboxClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click when clicking checkbox directly
    const newCheckedState = !isSelected;
    onSelect?.(product.productSku, newCheckedState);
  };


  return (
    <tr 
      className={`is-size-7 ${isSelected ? 'has-background-light' : ''}`}
      onClick={handleRowClick}
      style={{ cursor: 'pointer' }}
    >
      <td className="has-text-centered" style={{ width: '20px', verticalAlign: 'middle' }}>
        <div className="is-flex is-justify-content-center is-align-items-center">
          <label className="checkbox" onClick={handleCheckboxClick}>
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={() => {}} // Controlled component, handled by onClick
            />
          </label>
        </div>
      </td>
      <td>
        <ProductImage 
          src={product.mainimage} 
          alt={product.name} 
          onHover={() => onImageHover(product.mainimage)}
          onLeave={onImageLeave}
        />
      </td>
      <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>
        <strong className="is-size-7">{product.productSku}</strong>
      </td>
      <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>
        <div className="has-text-weight-bold has-text-link is-size-7">{product.name}</div>
      </td>
      <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>
        <div className="is-size-7">{product.fulfillmentTime}</div>
      </td>
      <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>
        <ProductPrice product={product} />
      </td>
      <td className="has-text-centered" style={{ verticalAlign: 'middle' }}>
        <ProductSuppliers suppliers={product.supplier} />
      </td>
      <td className="has-text-centered" style={{ verticalAlign: 'middle', width: '210px' }}>
        <div className="buttons are-small is-justify-content-center">
          <ActionButton
            action="Edit"
            onClick={() => handleActionClick('Edit')}
          />
          <ActionButton
            action="Delete"
            onClick={() => handleActionClick('Delete')}
          />
          <ActionButton
            action="Detail"
            onClick={() => handleActionClick('Detail')}
          />
        </div>
      </td>
    </tr>
  );
});

ProductRow.displayName = 'ProductRow'

export default ProductRow 