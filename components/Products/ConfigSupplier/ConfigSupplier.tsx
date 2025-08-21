import React, { useState, useMemo } from 'react'
import { ConfigTable } from '.'
import { suppliers } from '@/constants/index_product'
import TableResult from '@/components/Shared/TableResult'
import { getAllSuppliers, addSupplier, deleteSupplier, updateSupplierByIndex } from '@/lib/utils_supplier'

interface ConfigSupplierProps {
  onClose: () => void
}

const ITEMS_PER_PAGE = 10;

const ConfigSupplier = React.memo<ConfigSupplierProps>(({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [supplier, setSupplier] = useState('')
  const [country, setCountry] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [suppliersData, setSuppliersData] = useState([...suppliers])

  const handleAddSupplier = () => {
    if (supplier.trim() && country.trim()) {
      const updatedSuppliers = addSupplier(supplier, country, suppliersData);
      setSuppliersData(updatedSuppliers);
      setSupplier('');
      setCountry('');
    }
  }

  const handleDeleteSupplier = () => {
    if (supplier.trim() && country.trim()) {
      const updatedSuppliers = deleteSupplier(supplier, country, suppliersData);
      setSuppliersData(updatedSuppliers);
      setSupplier('');
      setCountry('');
    }
  }

  const handleEditSupplier = (paginatedIndex: number, newName: string, newCountry: string) => {
    // Map paginated index to actual index in suppliersData
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const actualIndex = startIndex + paginatedIndex;
    
    const updatedSuppliers = updateSupplierByIndex(actualIndex, newName, newCountry, suppliersData);
    setSuppliersData([...updatedSuppliers]); // Force re-render with new array
  }

  const handleDeleteSupplierFromTable = (paginatedIndex: number) => {
    // Map paginated index to actual index in suppliersData
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const actualIndex = startIndex + paginatedIndex;
    
    const supplierToDelete = suppliersData[actualIndex];
    const updatedSuppliers = deleteSupplier(
      supplierToDelete.name, 
      supplierToDelete.country, 
      suppliersData
    );
    setSuppliersData([...updatedSuppliers]); // Force re-render with new array
  }

  // Filter suppliers based on search criteria
  const filteredSuppliers = useMemo(() => {
    if (!searchQuery.trim()) return suppliersData;
    
    const query = searchQuery.toLowerCase();
    return suppliersData.filter(supplier => {
      const nameMatch = supplier.name.toLowerCase().includes(query);
      const countryMatch = supplier.country.toLowerCase().includes(query);
      return nameMatch || countryMatch;
    });
  }, [suppliersData, searchQuery]);

  const paginationData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex)
    
    return {
      startIndex,
      endIndex,
      paginatedSuppliers
    }
  }, [currentPage, filteredSuppliers])

  return (
    <div>
      <div className="">
        <div className="is-size-7">
          <div className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center is-flex-wrap-wrap mb-4">
            <h4 className="title is-4 mb-0 is-size-6">Config Supplier ({getAllSuppliers(filteredSuppliers)})</h4>
            <button className="button is-small is-size-7 is-danger is-light ml-4" onClick={onClose}>
              <span className="icon is-small">
                <i className="material-icons is-size-7">close</i>
              </span>
            </button>
          </div>
        </div>
        <div className="is-size-7">
          {/* Search Section */}
          <div className="field mb-4">
            <label className="label is-size-7">Search Suppliers</label>
            <div className="is-flex is-align-items-center is-gap-1" style={{ width: '100%' }}>
              <div className="field has-addons is-size-7 mb-0" style={{ flex: '1' }}>
                <div className="control">
                  <span className="button is-static is-size-7">Search</span>
                </div>
                <div className="control is-expanded">
                  <input 
                    className="input is-size-7" 
                    type="text" 
                    placeholder="Search by supplier name or country..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                </div>
              </div>
              <div className="is-flex is-align-items-center is-justify-content-center" style={{ width: '100px', flexShrink: 0 }}>
                <button 
                  className="button is-small is-size-7 is-info"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Add/Delete Section */}
          <div className="field mb-4">
            <label className="label is-size-7">Add/Delete Supplier</label>
            <div className="is-flex is-align-items-center is-gap-1" style={{ width: '100%' }}>
              <div className="field has-addons is-size-7 mb-0" style={{ width: 'calc(50% - 75px)' }}>
                <div className="control">
                  <span className="button is-static is-size-7">Supplier</span>
                </div>
                <div className="control is-expanded">
                  <input 
                    className="input is-size-7" 
                    type="text" 
                    placeholder="Supplier" 
                    value={supplier} 
                    onChange={(e) => setSupplier(e.target.value)} 
                  />
                </div>
              </div>
              <div className="field has-addons is-size-7 mb-0" style={{ width: 'calc(50% - 75px)' }}>
                <div className="control">
                  <span className="button is-static is-size-7">Country</span>
                </div>
                <div className="control is-expanded">
                  <input 
                    className="input is-size-7" 
                    type="text" 
                    placeholder="Country" 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)} 
                  />
                </div>
              </div>
              <div className="is-flex is-align-items-center is-justify-content-center" style={{ width: '150px', flexShrink: 0 }}>
                <button 
                  className="button is-small is-size-7 is-primary mr-2"
                  onClick={handleAddSupplier}
                >
                  Add 
                </button>
                <button 
                  className="button is-small is-size-7 is-danger"
                  onClick={handleDeleteSupplier}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <ConfigTable 
            suppliers={paginationData.paginatedSuppliers} 
            onEdit={handleEditSupplier}
            onDelete={handleDeleteSupplierFromTable}
          />
          
          <TableResult 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            startIndex={paginationData.startIndex}
            endIndex={paginationData.endIndex}
            totalItems={filteredSuppliers.length}
          />
        </div>
      </div>
    </div>
  )
})

ConfigSupplier.displayName = 'ConfigSupplier'

export default ConfigSupplier