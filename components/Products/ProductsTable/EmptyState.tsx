import React from 'react'

interface EmptyStateProps {
  showUpdatedOnly?: boolean
  activeStockFilter?: string | null
}

const EmptyState = React.memo(({ showUpdatedOnly = false, activeStockFilter = null }: EmptyStateProps) => {
  const getMessage = () => {
    if (showUpdatedOnly) {
      return "No updated products found. Try editing, adding, or updating prices for products first."
    } else {
      if (activeStockFilter === 'in') {
        return "No in-stock products found matching your criteria."
      } else if (activeStockFilter === 'out') {
        return "No out-of-stock products found matching your criteria."
      } else {
        return "No products found matching your criteria."
      }
    }
  }

  return (
    <div className="has-text-centered has-text-grey-light is-size-7 py-6">
      <p>{getMessage()}</p>
    </div>
  )
})

EmptyState.displayName = 'EmptyState'

export default EmptyState 