import React from 'react'

const TableHeader = React.memo(() => (
  <thead>
    <tr className="has-background-light is-size-7">
      <th className="is-size-7">IMAGE</th>
      <th className="has-text-centered is-size-7">PRODUCT SKU</th>
      <th className="has-text-centered is-size-7">NAME</th>
      <th className="has-text-centered is-size-7">FULFILLMENT TIME</th>
      <th className="has-text-centered is-size-7">PRICES</th>
      <th className="has-text-centered is-size-7">SUPPLIER</th>
      <th className="has-text-centered is-size-7" style={{ width: '210px' }}>ACTION</th>
    </tr>
  </thead>
))

TableHeader.displayName = 'TableHeader'

export default TableHeader 