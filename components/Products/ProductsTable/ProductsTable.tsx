import React from 'react'
import { Product } from '@/types/product'
import TableHeader from './TableHeader'
import ProductRow from './ProductRow'
import EmptyState from './EmptyState'

interface ProductsTableProps {
  products: Product[]
  onImageHover: (src: string) => void
  onImageLeave: () => void
  onActionClick: (action: string, productSku: string) => void
  showUpdatedOnly?: boolean
  activeStockFilter?: string | null
  updatedProductSkus?: Set<string>
}

const ProductsTable = React.memo<ProductsTableProps>(({ 
  products, 
  onImageHover, 
  onImageLeave,
  onActionClick,
  showUpdatedOnly = false,
  activeStockFilter = null,
  updatedProductSkus = new Set()
}) => (
  <div className="is-size-7">
    <table className="table is-fullwidth is-size-7 is-hoverable">
      <TableHeader />
      <tbody>
        {products.map((product, index) => (
          <ProductRow 
            key={`${product.productSku}-${index}`} 
            product={product} 
            onImageHover={onImageHover}
            onImageLeave={onImageLeave}
            onActionClick={onActionClick}
            isUpdated={updatedProductSkus.has(product.productSku)}
          />
        ))}
      </tbody>
    </table>
    
    {products.length === 0 && (
      <EmptyState 
        showUpdatedOnly={showUpdatedOnly} 
        activeStockFilter={activeStockFilter} 
      />
    )}
  </div>
))

ProductsTable.displayName = 'ProductsTable'

export default ProductsTable 