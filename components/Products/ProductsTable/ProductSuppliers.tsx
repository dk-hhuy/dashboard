import React from 'react'

interface ProductSuppliersProps {
  suppliers: string[]
}

const ProductSuppliers = React.memo(({ suppliers }: ProductSuppliersProps) => (
  <div className="tags is-centered is-size-7">
    {suppliers.map((supplier, idx) => (
      <span key={idx} className="tag is-small is-info is-light is-size-7">
        {supplier}
      </span>
    ))}
  </div>
))

ProductSuppliers.displayName = 'ProductSuppliers'

export default ProductSuppliers 