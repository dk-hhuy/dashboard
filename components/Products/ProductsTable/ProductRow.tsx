import React from 'react'
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
}

const ProductRow = React.memo<ProductRowProps>(({ 
  product, 
  onImageHover, 
  onImageLeave,
  onActionClick,
  isUpdated = false
}) => {
  const handleActionClick = (action: string) => {
    onActionClick(action, product.productSku);
  };

  return (
    <tr className="is-size-7">
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