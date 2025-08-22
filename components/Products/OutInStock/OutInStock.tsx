import React, { useCallback, useMemo, useEffect } from 'react'
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils'
import { useSearchParams, useRouter } from 'next/navigation'
import { calculateAllProducts, calculateAllProductsInStock, calculateAllProductsOutStock } from '@/lib/utils_product'
import { StockFilter, Product } from '@/types/product'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface OutInStockProps {
  activeStockFilter: StockFilter;
  onStockFilterChange: (filter: StockFilter) => void;
  showUpdatedOnly: boolean;
  onToggleShowUpdated: () => void;
  productsData: Product[];
  updatedProductSkus?: Set<string>;
}

interface FilterButton {
  key: string;
  label: string;
  filter: StockFilter;
  count: number;
  isActive: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const OutInStock = React.memo<OutInStockProps>(({ 
  activeStockFilter, 
  onStockFilterChange, 
  showUpdatedOnly, 
  onToggleShowUpdated, 
  productsData, 
  updatedProductSkus = new Set() 
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL update helper
  const updateUrlParam = useCallback((key: string, value: string) => {
    const newUrl = value 
      ? formUrlQuery({ params: searchParams.toString(), key, value })
      : removeKeysFromUrlQuery({ params: searchParams.toString(), keysToRemove: [key] });
    router.push(newUrl, { scroll: false });
  }, [searchParams, router]);

  // Update URL when filters change
  useEffect(() => {
    updateUrlParam('stock', activeStockFilter || '');
  }, [activeStockFilter, updateUrlParam]);

  useEffect(() => {
    updateUrlParam('updated', showUpdatedOnly ? 'true' : '');
  }, [showUpdatedOnly, updateUrlParam]);
  // Memoized filter buttons
  const filterButtons = useMemo<FilterButton[]>(() => [
    {
      key: 'all',
      label: 'All',
      filter: null,
      count: calculateAllProducts(productsData).length,
      isActive: !showUpdatedOnly && activeStockFilter === null
    },
    {
      key: 'in',
      label: 'In Stock',
      filter: 'in',
      count: calculateAllProductsInStock(productsData).length,
      isActive: !showUpdatedOnly && activeStockFilter === 'in'
    },
    {
      key: 'out',
      label: 'Out Stock',
      filter: 'out',
      count: calculateAllProductsOutStock(productsData).length,
      isActive: !showUpdatedOnly && activeStockFilter === 'out'
    }
  ], [productsData, showUpdatedOnly, activeStockFilter]);

  // Event handlers
  const handleFilterClick = useCallback((filter: StockFilter) => {
    onStockFilterChange(filter);
    if (showUpdatedOnly) onToggleShowUpdated();
  }, [onStockFilterChange, showUpdatedOnly, onToggleShowUpdated]);

  const handleToggleShowUpdated = useCallback(() => {
    onToggleShowUpdated();
    if (activeStockFilter !== null) onStockFilterChange(null);
  }, [onToggleShowUpdated, activeStockFilter, onStockFilterChange]);

  return (
    <div className="is-flex is-align-items-center is-flex-direction-row is-size-7">
      {filterButtons.map(({ key, label, filter, count, isActive }) => (
        <div key={key} className={`is-size-7 ${key !== 'out' ? 'mr-2' : ''}`}>
          <button 
            className={`button is-size-7 is-responsive is-rounded ${isActive ? 'is-link is-light' : 'is-info is-light'}`}
            onClick={() => handleFilterClick(filter)}
          >
            {label} ({count})
          </button>
        </div>
      ))}

      <div className="is-size-7 ml-2">
        <button 
          className={`button is-size-7 is-responsive is-rounded ${showUpdatedOnly ? 'is-link is-light' : 'is-info is-light'}`}
          onClick={handleToggleShowUpdated}
        >
          Show Updated Only ({updatedProductSkus.size})
        </button>
      </div>
    </div>
  );
});

OutInStock.displayName = 'OutInStock';

export default OutInStock;