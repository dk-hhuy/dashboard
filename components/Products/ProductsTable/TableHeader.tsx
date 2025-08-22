import React from 'react'

interface TableHeaderProps {
  isSelectAll: boolean;
  onSelectAll: () => void;
}

const TableHeader = React.memo<TableHeaderProps>(({ isSelectAll, onSelectAll }) => {

  return (
    <thead>
      <tr className="has-background-light is-size-7">
        <th className="is-size-7 has-text-centered" style={{ width: '20px', verticalAlign: 'middle' }}>
          <div className="is-flex is-justify-content-center is-align-items-center">
            <label className="checkbox">
              <input 
                type="checkbox" 
                checked={isSelectAll}
                onChange={onSelectAll}
              />
            </label>
          </div>
        </th>
      <th className="is-size-7">IMAGE</th>
      <th className="has-text-centered is-size-7">PRODUCT SKU</th>
      <th className="has-text-centered is-size-7">NAME</th>
      <th className="has-text-centered is-size-7">FULFILLMENT TIME</th>
      <th className="has-text-centered is-size-7">PRICES</th>
      <th className="has-text-centered is-size-7">SUPPLIER</th>
      <th className="has-text-centered is-size-7" style={{ width: '210px' }}>ACTION</th>
    </tr>
  </thead>
  );
});

TableHeader.displayName = 'TableHeader'

export default TableHeader 