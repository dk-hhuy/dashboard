import React, { useState } from 'react'
import { Product } from '@/types/product'
import { supplierProducts } from '@/constants/supplierProducts'

interface SupplierSectionProps {
  product: Product
}

const SupplierSection: React.FC<SupplierSectionProps> = ({ product }) => {
  const [selectedQuality, setSelectedQuality] = useState<'All' | 'Premium' | 'Standard' | 'Economy'>('All')
  
  const productSuppliers = supplierProducts[product.productSku] || []

  const filteredSuppliers = selectedQuality === 'All' 
    ? productSuppliers 
    : productSuppliers.filter((supplier: any) => supplier.quality === selectedQuality)

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Premium': return 'is-success'
      case 'Standard': return 'is-warning'
      case 'Economy': return 'is-info'
      default: return 'is-light'
    }
  }

  return (
    <div className="content is-size-7">
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <h4 className="title is-4 is-size-7">
          Suppliers 
          <span className="has-text-grey-light ml-2 is-size-7">
            ({productSuppliers.length} total)
          </span>
        </h4>
        
        {/* Quality Filter */}
        <div className="field">
          <div className="control">
            <div className="select is-small is-size-7">
              <select 
                value={selectedQuality} 
                onChange={(e) => setSelectedQuality(e.target.value as 'All' | 'Premium' | 'Standard' | 'Economy')}
              >
                <option value="All">All Qualities</option>
                <option value="Premium">Premium</option>
                <option value="Standard">Standard</option>
                <option value="Economy">Economy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="table-container">
        {productSuppliers.length > 0 ? (
          <table className="table is-fullwidth is-striped is-hoverable is-size-7">
            <thead>
              <tr>
                <th className="is-size-7">Supplier Name</th>
                <th className="is-size-7">SKU</th>
                <th className="is-size-7">Price</th>
                <th className="is-size-7">Quality</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier: any) => (
                <tr key={supplier.supplierId}>
                  <td className="is-size-7">
                    <strong>{supplier.supplierName}</strong>
                  </td>
                  <td className="is-size-7 has-text-grey-light">
                    {supplier.supplierSku}
                  </td>
                  <td className="is-size-7">
                    <span className="has-text-success has-text-weight-bold">
                      ${supplier.price}
                    </span>
                  </td>
                  <td className="is-size-7">
                    <span className={`tag ${getQualityColor(supplier.quality)} is-size-7`}>
                      {supplier.quality}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="has-text-centered p-6">
            <span className="icon is-large has-text-grey-light mb-3">
              <i className="material-icons is-size-1">business</i>
            </span>
            <p className="has-text-grey-light is-size-7 mb-3">No suppliers available</p>
            <p className="has-text-grey-light is-size-7">
              {selectedQuality !== 'All' 
                ? `No ${selectedQuality.toLowerCase()} suppliers found` 
                : 'Suppliers will be added here when available'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SupplierSection 