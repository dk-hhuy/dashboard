import { useState, useMemo, useCallback, useEffect } from 'react'
import { Product, StockFilter } from '@/types/product'

// Constants
const ITEMS_PER_PAGE = 10

// Custom hook for product filtering and pagination
export const useProductFilter = (productsData: Product[], updatedProductSkus?: Set<string>, showUpdatedOnly?: boolean) => {
  const [activeStockFilter, setActiveStockFilter] = useState<StockFilter>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts = useMemo(() => {
    let filtered = productsData

    // Filter by updated products only (independent mode)
    if (showUpdatedOnly) {
      if (updatedProductSkus && updatedProductSkus.size > 0) {
        console.log('Filtering by updated products only:', Array.from(updatedProductSkus))
        filtered = filtered.filter(product => updatedProductSkus.has(product.productSku))
        console.log('Filtered products after updated filter:', filtered.length)
      } else {
        console.log('Show Updated Only is active but no updated products found')
        filtered = [] // Return empty array when no updated products
      }
    } else {
      // Filter by stock status (only when showUpdatedOnly is false)
      if (activeStockFilter === 'in') {
        filtered = filtered.filter(product => product.productStatus === 'In Stock')
        console.log('Filtered products after In Stock filter:', filtered.length)
      } else if (activeStockFilter === 'out') {
        filtered = filtered.filter(product => product.productStatus === 'Out Stock')
        console.log('Filtered products after Out Stock filter:', filtered.length)
      }
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.productSku.toLowerCase().includes(searchLower) ||
        product.supplier.some(supplier => 
          supplier.toLowerCase().includes(searchLower)
        )
      )
    }

    return filtered
  }, [activeStockFilter, searchTerm, productsData, updatedProductSkus, showUpdatedOnly])

  const { startIndex, endIndex, displayProducts } = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return {
      startIndex: start,
      endIndex: end,
      displayProducts: filteredProducts.slice(start, end),
    }
  }, [currentPage, filteredProducts])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeStockFilter, searchTerm, showUpdatedOnly])

  const handleStockFilter = useCallback((filter: StockFilter) => {
    setActiveStockFilter(filter)
  }, [])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  return {
    activeStockFilter,
    searchTerm,
    filteredProducts,
    displayProducts,
    currentPage,
    startIndex,
    endIndex,
    handleStockFilter,
    handleSearch,
    handlePageChange
  }
} 