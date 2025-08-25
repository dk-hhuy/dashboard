import React, { useState, useCallback, useEffect } from 'react'
import { Product } from '@/types/product'
import TableHeader from './TableHeader'
import ProductRow from './ProductRow'
import EmptyState from './EmptyState'

interface ProductsTableProps {
  products: Product[]
  allProducts: Product[] // All products for select all functionality
  onImageHover: (src: string) => void
  onImageLeave: () => void
  onActionClick: (action: string, productSku: string) => void
  showUpdatedOnly?: boolean
  activeStockFilter?: string | null
  updatedProductSkus?: Set<string>
  onSelectionChange?: (selectedProducts: Set<string>) => void
}

const ProductsTable = React.memo<ProductsTableProps>(({ 
  products, 
  allProducts,
  onImageHover, 
  onImageLeave,
  onActionClick,
  showUpdatedOnly = false,
  activeStockFilter = null,
  updatedProductSkus = new Set(),
  onSelectionChange

}) => {
  // Debug: Log products data
  console.log('📊 ProductsTable received products:', products.map(p => ({
    sku: p.productSku,
    name: p.name,
    mainimage: p.mainimage
  })))
  
  // Force re-render when products data changes
  const [renderKey, setRenderKey] = useState(0)
  
  useEffect(() => {
    setRenderKey(prev => prev + 1)
  }, [products])
  
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState(false);

  const handleSelectAll = useCallback(() => {
    if (isSelectAll) {
      // Deselect all
      const newSelection = new Set<string>();
      setSelectedProducts(newSelection);
      setIsSelectAll(false);
    } else {
      // Select all products from the entire list, not just current page
      const allProductSkus = new Set(allProducts.map(product => product.productSku));
      setSelectedProducts(allProductSkus);
      setIsSelectAll(true);
    }
  }, [isSelectAll, allProducts]);

  const handleProductSelect = useCallback((productSku: string, isSelected: boolean) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(productSku);
      } else {
        newSet.delete(productSku);
      }
      return newSet;
    });

    // Update select all state based on current selection
    const newSelectedCount = isSelected ? selectedProducts.size + 1 : selectedProducts.size - 1;
    setIsSelectAll(newSelectedCount === allProducts.length);
  }, [selectedProducts.size, allProducts.length]);

  // Use useEffect to notify parent of selection changes
  useEffect(() => {
    onSelectionChange?.(selectedProducts);
  }, [selectedProducts, onSelectionChange]);

  return (
  <div className="is-size-7" key={renderKey}>
    <table className="table is-fullwidth is-size-7 is-hoverable">
      <TableHeader 
        isSelectAll={isSelectAll}
        onSelectAll={handleSelectAll}
      />
      <tbody>
        {products.map((product, index) => (
          <ProductRow 
            key={`${product.productSku}-${product.mainimage}-${index}`} 
            product={product} 
            onImageHover={onImageHover}
            onImageLeave={onImageLeave}
            onActionClick={onActionClick}
            isUpdated={updatedProductSkus.has(product.productSku)}
            isSelected={selectedProducts.has(product.productSku)}
            onSelect={handleProductSelect}
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
  );
});

ProductsTable.displayName = 'ProductsTable'

export default ProductsTable 