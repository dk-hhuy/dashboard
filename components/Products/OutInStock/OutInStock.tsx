import React from 'react'
import { calculateAllProducts, calculateAllProductsInStock, calculateAllProductsOutStock } from '@/lib/utils_product'
import { StockFilter, Product } from '@/types/product'

interface OutInStockProps {
  activeStockFilter: StockFilter;
  onStockFilterChange: (filter: StockFilter) => void;
  showUpdatedOnly: boolean;
  onToggleShowUpdated: () => void;
  productsData: Product[];
  updatedProductSkus?: Set<string>;
}

const OutInStock = ({ activeStockFilter, onStockFilterChange, showUpdatedOnly, onToggleShowUpdated, productsData, updatedProductSkus = new Set() }: OutInStockProps) => {
  return (
    <div className="is-flex is-align-items-center is-flex-direction-row is-size-7">

      <div className="is-size-7 mr-2">
        <button 
          className={`button is-size-7 is-responsive is-rounded ${!showUpdatedOnly && activeStockFilter === null ? 'is-link is-light' : 'is-info is-light'}`}
          onClick={() => {
            onStockFilterChange(null)
            if (showUpdatedOnly) onToggleShowUpdated() // Turn off showUpdatedOnly if it's active
          }}
        >
          All ({calculateAllProducts(productsData).length})
        </button>
      </div>

      <div className="is-size-7 mr-2">
        <button 
          className={`button is-size-7 is-responsive is-rounded ${!showUpdatedOnly && activeStockFilter === 'in' ? 'is-link is-light' : 'is-info is-light'}`}
          onClick={() => {
            onStockFilterChange('in')
            if (showUpdatedOnly) onToggleShowUpdated() // Turn off showUpdatedOnly if it's active
          }}
        >
          In Stock ({calculateAllProductsInStock(productsData).length})
        </button>
      </div>

      <div className="is-size-7">
        <button 
          className={`button is-size-7 is-responsive is-rounded ${!showUpdatedOnly && activeStockFilter === 'out' ? 'is-link is-light' : 'is-info is-light'}`}
          onClick={() => {
            onStockFilterChange('out')
            if (showUpdatedOnly) onToggleShowUpdated() // Turn off showUpdatedOnly if it's active
          }}
        >
          Out Stock ({calculateAllProductsOutStock(productsData).length})
        </button>
      </div>

      <div className="is-size-7 ml-2">
        <button 
          className={`button is-size-7 is-responsive is-rounded ${showUpdatedOnly ? 'is-link is-light' : 'is-info is-light'}`}
          onClick={() => {
            onToggleShowUpdated()
            if (activeStockFilter !== null) onStockFilterChange(null) // Reset stock filter if it's active
          }}
        >
          Show Updated Only ({updatedProductSkus.size})
        </button>
      </div>

    </div>
  )
}

export default OutInStock