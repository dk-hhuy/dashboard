import React, { useState, Fragment, useCallback } from 'react'
import { validateSupplier, validateSupplierName, validateCountry } from '@/schemas/configSchema'
import ErrorMessage from '@/components/Shared/ErrorMessage'

interface ConfigTableProps {
  suppliers: Array<{
    name: string;
    country: string;
  }>;
  onEdit?: (index: number, name: string, country: string) => void;
  onDelete?: (index: number) => void;
}

const ConfigTable = React.memo<ConfigTableProps>(({ suppliers, onEdit, onDelete }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const clearErrors = () => {
    setErrors({})
  }

  const setFieldError = (fieldName: string, errorMessage: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: [errorMessage]
    }))
  }

  // Real-time validation for name field
  const handleNameChange = useCallback((value: string) => {
    setEditName(value);
    
    // Clear previous name errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors['name'];
      return newErrors;
    });

    // Validate name if not empty
    if (value.trim()) {
      const validationResult = validateSupplierName(value);
      if (!validationResult.isValid) {
        setFieldError('name', validationResult.error || 'Invalid supplier name');
      }
    }
  }, []);

  // Real-time validation for country field
  const handleCountryChange = useCallback((value: string) => {
    setEditCountry(value);
    
    // Clear previous country errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors['country'];
      return newErrors;
    });

    // Validate country if not empty
    if (value.trim()) {
      const validationResult = validateCountry(value);
      if (!validationResult.isValid) {
        setFieldError('country', validationResult.error || 'Invalid country');
      }
    }
  }, []);

  const handleEditClick = (index: number, name: string, country: string) => {
    clearErrors()
    setEditingIndex(index);
    setEditName(name);
    setEditCountry(country);
  };

  const handleSaveEdit = (index: number) => {
    clearErrors()
    
    // Validate both fields
    let hasErrors = false;
    
    if (!editName.trim()) {
      setFieldError('name', 'Supplier name is required');
      hasErrors = true;
    } else {
      const nameValidation = validateSupplierName(editName);
      if (!nameValidation.isValid) {
        setFieldError('name', nameValidation.error || 'Invalid supplier name');
        hasErrors = true;
      }
    }
    
    if (!editCountry.trim()) {
      setFieldError('country', 'Country is required');
      hasErrors = true;
    } else {
      const countryValidation = validateCountry(editCountry);
      if (!countryValidation.isValid) {
        setFieldError('country', countryValidation.error || 'Invalid country');
        hasErrors = true;
      }
    }

    if (hasErrors) {
      return;
    }

    // Validate combined data
    const validationResult = validateSupplier({ name: editName.trim(), country: editCountry.trim() });
    if (!validationResult.isValid) {
      setFieldError('edit', validationResult.error || 'Invalid supplier data');
      return;
    }

    if (onEdit) {
      onEdit(index, editName.trim(), editCountry.trim());
      setEditingIndex(null);
      setEditName('');
      setEditCountry('');
    }
  };

  const handleCancelEdit = () => {
    clearErrors()
    setEditingIndex(null);
    setEditName('');
    setEditCountry('');
  };

  const handleDeleteClick = (index: number) => {
    clearErrors()
    const supplierToDelete = suppliers[index];
    const confirmDelete = window.confirm(
      `Are you sure you want to delete supplier "${supplierToDelete.name}" from "${supplierToDelete.country}"?`
    );
    
    if (confirmDelete && onDelete) {
      onDelete(index);
    }
  };

  return (
    <div className="is-size-7">
      <table className="table is-fullwidth is-bordered is-size-7">
        <thead>
          <tr>
            <th className="has-text-left is-size-7 title">SUPPLIER</th>
            <th className="has-text-left is-size-7 title">COUNTRY</th>
            <th className="has-text-centered is-size-7">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier, index) => (
            <Fragment key={`${supplier.name}-${index}`}>
              <tr>
                <td className="has-text-left is-size-7">
                  {editingIndex === index ? (
                    <div>
                      <input 
                        className={`input is-size-7 ${errors['name'] ? 'is-danger' : ''}`}
                        type="text" 
                        value={editName} 
                        onChange={(e) => handleNameChange(e.target.value)}
                      />
                      <ErrorMessage errors={errors} fieldName="name" />
                    </div>
                  ) : (
                    supplier.name
                  )}
                </td>
                <td className="has-text-left is-size-7">
                  {editingIndex === index ? (
                    <div>
                      <input 
                        className={`input is-size-7 ${errors['country'] ? 'is-danger' : ''}`}
                        type="text" 
                        value={editCountry} 
                        onChange={(e) => handleCountryChange(e.target.value)}
                      />
                      <ErrorMessage errors={errors} fieldName="country" />
                    </div>
                  ) : (
                    supplier.country
                  )}
                </td>
                <td className="has-text-centered" style={{ width: '150px' }}> 
                  {editingIndex === index ? (
                    <>
                      <button 
                        className="button is-small is-size-7 is-success mr-1"
                        onClick={() => handleSaveEdit(index)}
                      >
                        Save
                      </button>
                      <button 
                        className="button is-small is-size-7 is-warning"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="button is-small is-size-7 is-primary mr-1"
                        onClick={() => handleEditClick(index, supplier.name, supplier.country)}
                      >
                        Edit    
                      </button>
                      <button 
                        className="button is-small is-size-7 is-danger"
                        onClick={() => handleDeleteClick(index)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
              {/* General Error Message Row - chỉ hiển thị khi đang edit row này và có lỗi */}
              {editingIndex === index && errors['edit'] && errors['edit'].length > 0 && (
                <tr>
                  <td colSpan={3} className="has-background-light">
                    <ErrorMessage errors={errors} fieldName="edit" />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
});

ConfigTable.displayName = 'ConfigTable';

export default ConfigTable;