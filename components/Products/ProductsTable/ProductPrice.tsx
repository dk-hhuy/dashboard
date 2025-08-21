import React from 'react'
import { Product } from '@/types/product'

interface ProductPriceProps {
  product: Product
}

const ProductPrice = React.memo(({ product }: ProductPriceProps) => {
  // Calculate min and max prices from product data
  const calculateMinPrice = (): string => {
    if (!product.priceHistory || product.priceHistory.length === 0) {
      return "$0.00"
    }
    
    const prices = product.priceHistory.map(item => parseFloat(item.oldCost.replace('$', '')))
    const minPrice = Math.min(...prices)
    return `$${minPrice.toFixed(2)}`
  }

  const calculateMaxPrice = (): string => {
    if (!product.priceHistory || product.priceHistory.length === 0) {
      return "$0.00"
    }
    
    const prices = product.priceHistory.map(item => parseFloat(item.oldCost.replace('$', '')))
    const maxPrice = Math.max(...prices)
    return `$${maxPrice.toFixed(2)}`
  }

  const minPrice = calculateMinPrice()
  const maxPrice = calculateMaxPrice()
  
  // Nếu chỉ có 1 giá duy nhất thì hiển thị giá đó
  if (minPrice === maxPrice) {
    return (
      <div className="has-text-info is-size-7">
        <strong className="has-text-weight-semibold is-size-7">
          {minPrice}
        </strong>
      </div>
    )
  }
  
  // Nếu có nhiều giá thì hiển thị min - max
  return (
    <div className="has-text-info is-size-7">
      <strong className="has-text-weight-semibold is-size-7">
        {minPrice} - {maxPrice}
      </strong>
    </div>
  )
})

ProductPrice.displayName = 'ProductPrice'

export default ProductPrice 