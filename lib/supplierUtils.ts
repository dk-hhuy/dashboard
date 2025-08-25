import { SupplierProduct } from '@/types/product'
import { supplierProducts } from '@/constants/supplierProducts'

// Helper function to get supplier products for a specific product
export const getSupplierProducts = (productSku: string): SupplierProduct[] => {
  return supplierProducts[productSku] || []
}

// Helper function to get suppliers by quality
export const getSupplierProductsByQuality = (productSku: string, quality: 'Premium' | 'Standard' | 'Economy'): SupplierProduct[] => {
  return getSupplierProducts(productSku).filter(supplier => supplier.quality === quality)
}

// Helper function to get cheapest supplier
export const getCheapestSupplier = (productSku: string): SupplierProduct | null => {
  const suppliers = getSupplierProducts(productSku)
  if (suppliers.length === 0) return null
  
  return suppliers.reduce((cheapest, current) => 
    current.price < cheapest.price ? current : cheapest
  )
}

// Helper function to get suppliers by price range
export const getSupplierProductsByPriceRange = (productSku: string, minPrice: number, maxPrice: number): SupplierProduct[] => {
  return getSupplierProducts(productSku).filter(supplier => 
    supplier.price >= minPrice && supplier.price <= maxPrice
  )
}

// Helper function to get suppliers sorted by price (ascending)
export const getSupplierProductsSortedByPrice = (productSku: string, ascending: boolean = true): SupplierProduct[] => {
  const suppliers = getSupplierProducts(productSku)
  return suppliers.sort((a, b) => {
    return ascending ? a.price - b.price : b.price - a.price
  })
}

// Helper function to get unique qualities available for a product
export const getAvailableQualities = (productSku: string): ('Premium' | 'Standard' | 'Economy')[] => {
  const suppliers = getSupplierProducts(productSku)
  const qualities = suppliers.map(supplier => supplier.quality)
  return [...new Set(qualities)] as ('Premium' | 'Standard' | 'Economy')[]
}

// Helper function to get average price for a product
export const getAveragePrice = (productSku: string): number => {
  const suppliers = getSupplierProducts(productSku)
  if (suppliers.length === 0) return 0
  
  const totalPrice = suppliers.reduce((sum, supplier) => sum + supplier.price, 0)
  return totalPrice / suppliers.length
}

// Helper function to get price range for a product
export const getPriceRange = (productSku: string): { min: number; max: number } => {
  const suppliers = getSupplierProducts(productSku)
  if (suppliers.length === 0) return { min: 0, max: 0 }
  
  const prices = suppliers.map(supplier => supplier.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
} 