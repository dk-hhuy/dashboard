import React, { useState, useMemo, useCallback } from 'react'
import { ConfigTable } from '.'
import { suppliers } from '@/constants/index_product'
import TableResult from '@/components/Shared/TableResult'
import ErrorMessage from '@/components/Shared/ErrorMessage'
import { getAllSuppliers, addSupplier, deleteSupplier, updateSupplierByIndex } from '@/lib/utils_supplier'
import { validateAddSupplier, validateDeleteSupplier, validateUpdateSupplier, validateSupplierName, validateCountry } from '@/schemas/configSchema'

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
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const clearErrors = () => {
    setErrors({})
  }

  const setFieldError = (fieldName: string, errorMessage: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: [errorMessage]
    }))
  }

  // Real-time validation for supplier name field
  const handleSupplierChange = useCallback((value: string) => {
    setSupplier(value);
    
    // Clear previous supplier errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors['supplier'];
      return newErrors;
    });

    // Validate format if not empty
    if (value.trim()) {
      const validationResult = validateSupplierName(value);
      if (!validationResult.isValid) {
        setFieldError('supplier', validationResult.error || 'Invalid supplier name');
      }
    }
  }, []);

  // Real-time validation for country field
  const handleCountryChange = useCallback((value: string) => {
    setCountry(value);
    
    // Clear previous country errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors['country'];
      return newErrors;
    });

    // Validate format if not empty
    if (value.trim()) {
      const validationResult = validateCountry(value);
      if (!validationResult.isValid) {
        setFieldError('country', validationResult.error || 'Invalid country');
      }
    }
  }, []);

  const handleAddSupplier = () => {
    clearErrors()
    
    // Validate both fields
    let hasErrors = false;
    
    if (!supplier.trim()) {
      setFieldError('supplier', 'Supplier name is required');
      hasErrors = true;
    } else {
      const supplierValidation = validateSupplierName(supplier);
      if (!supplierValidation.isValid) {
        setFieldError('supplier', supplierValidation.error || 'Invalid supplier name');
        hasErrors = true;
      }
    }
    
    if (!country.trim()) {
      setFieldError('country', 'Country is required');
      hasErrors = true;
    } else {
      const countryValidation = validateCountry(country);
      if (!countryValidation.isValid) {
        setFieldError('country', countryValidation.error || 'Invalid country');
        hasErrors = true;
      }
    }

    if (hasErrors) {
      return;
    }

    const validationResult = validateAddSupplier(supplier, country)
    if (!validationResult.isValid) {
      setFieldError('general', validationResult.error || 'Invalid supplier data')
      return
    }
    const updatedSuppliers = addSupplier(supplier, country, suppliersData);
    setSuppliersData(updatedSuppliers);
    setSupplier('');
    setCountry('');
  }

  const handleDeleteSupplier = () => {
    clearErrors()
    
    // Validate both fields for delete operation
    let hasErrors = false;
    
    if (!supplier.trim()) {
      setFieldError('supplier', 'Supplier name is required');
      hasErrors = true;
    } else {
      const supplierValidation = validateSupplierName(supplier);
      if (!supplierValidation.isValid) {
        setFieldError('supplier', supplierValidation.error || 'Invalid supplier name');
        hasErrors = true;
      }
    }
    
    if (!country.trim()) {
      setFieldError('country', 'Country is required');
      hasErrors = true;
    } else {
      const countryValidation = validateCountry(country);
      if (!countryValidation.isValid) {
        setFieldError('country', countryValidation.error || 'Invalid country');
        hasErrors = true;
      }
    }

    if (hasErrors) {
      return;
    }

    // Find the index of the supplier to delete
    const index = suppliersData.findIndex(item => item.name === supplier && item.country === country);
    if (index === -1) {
      setFieldError('general', 'Supplier not found. Please check the supplier name and country.');
      return
    }
    
    const validationResult = validateDeleteSupplier(index)
    if (!validationResult?.isValid) {
      setFieldError('general', validationResult?.error || 'Invalid supplier data')
      return
    }
    const updatedSuppliers = deleteSupplier(supplier, country, suppliersData);
    setSuppliersData(updatedSuppliers);
    setSupplier('');
    setCountry('');
  }

  const handleEditSupplier = (paginatedIndex: number, newName: string, newCountry: string) => {
    clearErrors()
    // Map paginated index to actual index in filteredSuppliers
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const filteredIndex = startIndex + paginatedIndex;
    
    // Get the actual supplier from filtered data
    const supplierToEdit = filteredSuppliers[filteredIndex];
    if (!supplierToEdit) {
      setFieldError('general', 'Supplier not found')
      return
    }
    
    // Find the actual index in suppliersData
    const actualIndex = suppliersData.findIndex(
      item => item.name === supplierToEdit.name && item.country === supplierToEdit.country
    );
    
    if (actualIndex === -1) {
      setFieldError('general', 'Supplier not found in original data')
      return
    }
    
    const validationResult = validateUpdateSupplier(actualIndex, newName, newCountry);
    if (!validationResult?.isValid) {
      setFieldError('general', validationResult?.error || 'Invalid supplier data')
      return
    }
    
    const updatedSuppliers = updateSupplierByIndex(actualIndex, newName, newCountry, suppliersData);
    setSuppliersData(updatedSuppliers);
  }

  const handleDeleteSupplierFromTable = (paginatedIndex: number) => {
    clearErrors()
    // Map paginated index to actual index in filteredSuppliers
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const filteredIndex = startIndex + paginatedIndex;
    
    // Get the actual supplier from filtered data
    const supplierToDelete = filteredSuppliers[filteredIndex];
    if (!supplierToDelete) {
      setFieldError('general', 'Supplier not found')
      return
    }
    
    // Find the actual index in suppliersData
    const actualIndex = suppliersData.findIndex(
      item => item.name === supplierToDelete.name && item.country === supplierToDelete.country
    );
    
    if (actualIndex === -1) {
      setFieldError('general', 'Supplier not found in original data')
      return
    }
    
    const validationResult = validateDeleteSupplier(actualIndex)
    if (!validationResult?.isValid) {
      setFieldError('general', validationResult?.error || 'Invalid supplier data')
      return
    }
    
    const updatedSuppliers = deleteSupplier(
      supplierToDelete.name, 
      supplierToDelete.country, 
      suppliersData
    );
    setSuppliersData(updatedSuppliers);
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
                    className={`input is-size-7 ${errors['supplier'] ? 'is-danger' : ''}`}
                    type="text" 
                    placeholder="Supplier" 
                    value={supplier} 
                    onChange={(e) => handleSupplierChange(e.target.value)} 
                  />
                </div>
              </div>
              <div className="field has-addons is-size-7 mb-0" style={{ width: 'calc(50% - 75px)' }}>
                <div className="control">
                  <span className="button is-static is-size-7">Country</span>
                </div>
                <div className="control is-expanded">
                  <input 
                    className={`input is-size-7 ${errors['country'] ? 'is-danger' : ''}`}
                    type="text" 
                    placeholder="Country" 
                    value={country} 
                    onChange={(e) => handleCountryChange(e.target.value)} 
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
            {/* Field-specific error messages */}
            <div className="is-flex is-gap-4 mt-2">
              <div style={{ width: 'calc(50% - 75px)' }}>
                <ErrorMessage errors={errors} fieldName="supplier" />
              </div>
              <div style={{ width: 'calc(50% - 75px)' }}>
                <ErrorMessage errors={errors} fieldName="country" />
              </div>
            </div>
            {/* General Error Message */}
            <div className="mt-2">
              <ErrorMessage errors={errors} fieldName="general" />
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