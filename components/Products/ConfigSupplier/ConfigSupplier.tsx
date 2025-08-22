import React, { useState, useMemo, useCallback } from 'react'
import { ConfigTable } from '.'
import { suppliers } from '@/constants/index_product'
import TableResult from '@/components/Shared/TableResult'
import ErrorMessage from '@/components/Shared/ErrorMessage'
import { getAllSuppliers, addSupplier, deleteSupplier, updateSupplierByIndex } from '@/lib/utils_supplier'
import { validateAddSupplier, validateDeleteSupplier, validateUpdateSupplier, validateSupplierName, validateCountry } from '@/schemas/configSchema'

// Constants
const ITEMS_PER_PAGE = 10;
const FIELD_WIDTH = 'calc(50% - 75px)';
const BUTTON_WIDTH = '150px';

// Types
interface ConfigSupplierProps {
  onClose: () => void
}

interface SupplierFormData {
  supplier: string;
  country: string;
}

// Custom hook for error management
const useErrorManager = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setFieldError = useCallback((fieldName: string, errorMessage: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: [errorMessage]
    }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return { errors, clearErrors, setFieldError, clearFieldError };
};

// Custom hook for form validation
const useFormValidation = (setFieldError: (field: string, message: string) => void) => {
  const validateField = useCallback((fieldName: string, value: string, validator: (val: string) => any) => {
    if (!value.trim()) {
      setFieldError(fieldName, `${fieldName === 'supplier' ? 'Supplier name' : 'Country'} is required`);
      return false;
    }
    
    const validationResult = validator(value);
    if (!validationResult.isValid) {
      setFieldError(fieldName, validationResult.error || `Invalid ${fieldName}`);
      return false;
    }
    
    return true;
  }, [setFieldError]);

  const validateForm = useCallback((formData: SupplierFormData) => {
    let isValid = true;
    
    isValid = validateField('supplier', formData.supplier, validateSupplierName) && isValid;
    isValid = validateField('country', formData.country, validateCountry) && isValid;
    
    return isValid;
  }, [validateField]);

  return { validateField, validateForm };
};

// Custom hook for supplier operations
const useSupplierOperations = (suppliersData: any[], setSuppliersData: (data: any[]) => void) => {
  const addSupplierOperation = useCallback((supplier: string, country: string) => {
    const updatedSuppliers = addSupplier(supplier, country, suppliersData);
    setSuppliersData(updatedSuppliers);
  }, [suppliersData, setSuppliersData]);

  const deleteSupplierOperation = useCallback((supplier: string, country: string) => {
    const updatedSuppliers = deleteSupplier(supplier, country, suppliersData);
    setSuppliersData(updatedSuppliers);
  }, [suppliersData, setSuppliersData]);

  const updateSupplierOperation = useCallback((index: number, newName: string, newCountry: string) => {
    const updatedSuppliers = updateSupplierByIndex(index, newName, newCountry, suppliersData);
    setSuppliersData(updatedSuppliers);
  }, [suppliersData, setSuppliersData]);

  return { addSupplierOperation, deleteSupplierOperation, updateSupplierOperation };
};

// Search component
const SearchSection = React.memo<{
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}>(({ searchQuery, onSearchChange, onClearSearch }) => (
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
            onChange={(e) => onSearchChange(e.target.value)} 
          />
        </div>
      </div>
      <div className="is-flex is-align-items-center is-justify-content-center" style={{ width: '100px', flexShrink: 0 }}>
        <button 
          className="button is-small is-size-7 is-info"
          onClick={onClearSearch}
        >
          Clear
        </button>
      </div>
    </div>
  </div>
));
SearchSection.displayName = 'SearchSection';

// Form input component
const FormInput = React.memo<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  hasError: boolean;
}>(({ label, value, onChange, placeholder, hasError }) => (
  <div className="field has-addons is-size-7 mb-0" style={{ width: FIELD_WIDTH }}>
    <div className="control">
      <span className="button is-static is-size-7">{label}</span>
    </div>
    <div className="control is-expanded">
      <input 
        className={`input is-size-7 ${hasError ? 'is-danger' : ''}`}
        type="text" 
        placeholder={placeholder} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  </div>
));
FormInput.displayName = 'FormInput';

// Action buttons component
const ActionButtons = React.memo<{
  onAdd: () => void;
  onDelete: () => void;
}>(({ onAdd, onDelete }) => (
  <div className="is-flex is-align-items-center is-justify-content-center" style={{ width: BUTTON_WIDTH, flexShrink: 0 }}>
    <button 
      className="button is-small is-size-7 is-primary mr-2"
      onClick={onAdd}
    >
      Add 
    </button>
    <button 
      className="button is-small is-size-7 is-danger"
      onClick={onDelete}
    >
      Delete
    </button>
  </div>
));
ActionButtons.displayName = 'ActionButtons';

const ConfigSupplier = React.memo<ConfigSupplierProps>(({ onClose }) => {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<SupplierFormData>({ supplier: '', country: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliersData, setSuppliersData] = useState([...suppliers]);

  // Custom hooks
  const { errors, clearErrors, setFieldError, clearFieldError } = useErrorManager();
  const { validateField, validateForm } = useFormValidation(setFieldError);
  const { addSupplierOperation, deleteSupplierOperation, updateSupplierOperation } = useSupplierOperations(suppliersData, setSuppliersData);

  // Memoized computations
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
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);
    
    return {
      startIndex,
      endIndex,
      paginatedSuppliers
    };
  }, [currentPage, filteredSuppliers]);

  // Real-time validation handlers
  const handleSupplierChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, supplier: value }));
    clearFieldError('supplier');

    if (value.trim()) {
      const validationResult = validateSupplierName(value);
      if (!validationResult.isValid) {
        setFieldError('supplier', validationResult.error || 'Invalid supplier name');
      }
    }
  }, [clearFieldError, setFieldError]);

  const handleCountryChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, country: value }));
    clearFieldError('country');

    if (value.trim()) {
      const validationResult = validateCountry(value);
      if (!validationResult.isValid) {
        setFieldError('country', validationResult.error || 'Invalid country');
      }
    }
  }, [clearFieldError, setFieldError]);

  // Operation handlers
  const handleAddSupplier = useCallback(() => {
    clearErrors();
    
    if (!validateForm(formData)) {
      return;
    }

    const validationResult = validateAddSupplier(formData.supplier, formData.country);
    if (!validationResult.isValid) {
      setFieldError('general', validationResult.error || 'Invalid supplier data');
      return;
    }

    addSupplierOperation(formData.supplier, formData.country);
    setFormData({ supplier: '', country: '' });
  }, [clearErrors, validateForm, formData, setFieldError, addSupplierOperation]);

  const handleDeleteSupplier = useCallback(() => {
    clearErrors();
    
    if (!validateForm(formData)) {
      return;
    }

    const index = suppliersData.findIndex(item => 
      item.name === formData.supplier && item.country === formData.country
    );
    
    if (index === -1) {
      setFieldError('general', 'Supplier not found. Please check the supplier name and country.');
      return;
    }
    
    const validationResult = validateDeleteSupplier(index);
    if (!validationResult?.isValid) {
      setFieldError('general', validationResult?.error || 'Invalid supplier data');
      return;
    }

    deleteSupplierOperation(formData.supplier, formData.country);
    setFormData({ supplier: '', country: '' });
  }, [clearErrors, validateForm, formData, suppliersData, setFieldError, deleteSupplierOperation]);

  const handleEditSupplier = useCallback((paginatedIndex: number, newName: string, newCountry: string) => {
    clearErrors();
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const filteredIndex = startIndex + paginatedIndex;
    
    const supplierToEdit = filteredSuppliers[filteredIndex];
    if (!supplierToEdit) {
      setFieldError('general', 'Supplier not found');
      return;
    }
    
    const actualIndex = suppliersData.findIndex(
      item => item.name === supplierToEdit.name && item.country === supplierToEdit.country
    );
    
    if (actualIndex === -1) {
      setFieldError('general', 'Supplier not found in original data');
      return;
    }
    
    const validationResult = validateUpdateSupplier(actualIndex, newName, newCountry);
    if (!validationResult?.isValid) {
      setFieldError('general', validationResult?.error || 'Invalid supplier data');
      return;
    }
    
    updateSupplierOperation(actualIndex, newName, newCountry);
  }, [clearErrors, currentPage, filteredSuppliers, suppliersData, setFieldError, updateSupplierOperation]);

  const handleDeleteSupplierFromTable = useCallback((paginatedIndex: number) => {
    clearErrors();
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const filteredIndex = startIndex + paginatedIndex;
    
    const supplierToDelete = filteredSuppliers[filteredIndex];
    if (!supplierToDelete) {
      setFieldError('general', 'Supplier not found');
      return;
    }
    
    const actualIndex = suppliersData.findIndex(
      item => item.name === supplierToDelete.name && item.country === supplierToDelete.country
    );
    
    if (actualIndex === -1) {
      setFieldError('general', 'Supplier not found in original data');
      return;
    }
    
    const validationResult = validateDeleteSupplier(actualIndex);
    if (!validationResult?.isValid) {
      setFieldError('general', validationResult?.error || 'Invalid supplier data');
      return;
    }
    
    deleteSupplierOperation(supplierToDelete.name, supplierToDelete.country);
  }, [clearErrors, currentPage, filteredSuppliers, suppliersData, setFieldError, deleteSupplierOperation]);

  // Search handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <div>
      <div className="">
        <div className="is-size-7">
          <div className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center is-flex-wrap-wrap mb-4">
            <h4 className="title is-4 mb-0 is-size-6">
              Config Supplier ({getAllSuppliers(filteredSuppliers)})
            </h4>
            <button className="button is-small is-size-7 is-danger is-light ml-4" onClick={onClose}>
              <span className="icon is-small">
                <i className="material-icons is-size-7">close</i>
              </span>
            </button>
          </div>
        </div>
        <div className="is-size-7">
          {/* Search Section */}
          <SearchSection 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
          />

          {/* Add/Delete Section */}
          <div className="field mb-4">
            <label className="label is-size-7">Add/Delete Supplier</label>
            <div className="is-flex is-align-items-center is-gap-1" style={{ width: '100%' }}>
              <FormInput
                label="Supplier"
                value={formData.supplier}
                onChange={handleSupplierChange}
                placeholder="Supplier"
                hasError={!!errors['supplier']}
              />
              <FormInput
                label="Country"
                value={formData.country}
                onChange={handleCountryChange}
                placeholder="Country"
                hasError={!!errors['country']}
              />
              <ActionButtons 
                onAdd={handleAddSupplier}
                onDelete={handleDeleteSupplier}
              />
            </div>
            {/* Field-specific error messages */}
            <div className="is-flex is-gap-4 mt-2">
              <div style={{ width: FIELD_WIDTH }}>
                <ErrorMessage errors={errors} fieldName="supplier" />
              </div>
              <div style={{ width: FIELD_WIDTH }}>
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
  );
});

ConfigSupplier.displayName = 'ConfigSupplier';

export default ConfigSupplier;