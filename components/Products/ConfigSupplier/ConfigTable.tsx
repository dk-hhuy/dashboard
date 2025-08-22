import React, { useState, Fragment, useCallback, useMemo } from 'react'
import { validateSupplier, validateSupplierName, validateCountry } from '@/schemas/configSchema'
import ErrorMessage from '@/components/Shared/ErrorMessage'

// Types
interface ConfigTableProps {
  suppliers: Array<{
    name: string;
    country: string;
  }>;
  onEdit?: (index: number, name: string, country: string) => void;
  onDelete?: (index: number) => void;
}

interface EditFormData {
  name: string;
  country: string;
}

// Constants
const ACTION_COLUMN_WIDTH = '150px';

// Custom hook for edit state management
const useEditState = () => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<EditFormData>({ name: '', country: '' });

  const startEditing = useCallback((index: number, name: string, country: string) => {
    setEditingIndex(index);
    setEditData({ name, country });
  }, []);

  const stopEditing = useCallback(() => {
    setEditingIndex(null);
    setEditData({ name: '', country: '' });
  }, []);

  const updateEditData = useCallback((field: keyof EditFormData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  }, []);

  return {
    editingIndex,
    editData,
    startEditing,
    stopEditing,
    updateEditData
  };
};

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
      setFieldError(fieldName, `${fieldName === 'name' ? 'Supplier name' : 'Country'} is required`);
      return false;
    }
    
    const validationResult = validator(value);
    if (!validationResult.isValid) {
      setFieldError(fieldName, validationResult.error || `Invalid ${fieldName}`);
      return false;
    }
    
    return true;
  }, [setFieldError]);

  const validateForm = useCallback((formData: EditFormData) => {
    let isValid = true;
    
    isValid = validateField('name', formData.name, validateSupplierName) && isValid;
    isValid = validateField('country', formData.country, validateCountry) && isValid;
    
    return isValid;
  }, [validateField]);

  return { validateField, validateForm };
};

// Edit input component
const EditInput = React.memo<{
  value: string;
  onChange: (value: string) => void;
  hasError: boolean;
  fieldName: string;
  errors: Record<string, string[]>;
}>(({ value, onChange, hasError, fieldName, errors }) => (
  <div>
    <input 
      className={`input is-size-7 ${hasError ? 'is-danger' : ''}`}
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
    />
    <ErrorMessage errors={errors} fieldName={fieldName} />
  </div>
));
EditInput.displayName = 'EditInput';

// Action buttons component
const ActionButtons = React.memo<{
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}>(({ isEditing, onSave, onCancel, onEdit, onDelete }) => (
  <>
    {isEditing ? (
      <>
        <button 
          className="button is-small is-size-7 is-success mr-1"
          onClick={onSave}
        >
          Save
        </button>
        <button 
          className="button is-small is-size-7 is-warning"
          onClick={onCancel}
        >
          Cancel
        </button>
      </>
    ) : (
      <>
        <button 
          className="button is-small is-size-7 is-primary mr-1"
          onClick={onEdit}
        >
          Edit    
        </button>
        <button 
          className="button is-small is-size-7 is-danger"
          onClick={onDelete}
        >
          Delete
        </button>
      </>
    )}
  </>
));
ActionButtons.displayName = 'ActionButtons';

// Table row component
const TableRow = React.memo<{
  supplier: { name: string; country: string };
  index: number;
  isEditing: boolean;
  editData: EditFormData;
  errors: Record<string, string[]>;
  onNameChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}>(({ 
  supplier, 
  index, 
  isEditing, 
  editData, 
  errors, 
  onNameChange, 
  onCountryChange, 
  onSave, 
  onCancel, 
  onEdit, 
  onDelete 
}) => (
  <Fragment key={`${supplier.name}-${index}`}>
    <tr>
      <td className="has-text-left is-size-7">
        {isEditing ? (
          <EditInput
            value={editData.name}
            onChange={onNameChange}
            hasError={!!errors['name']}
            fieldName="name"
            errors={errors}
          />
        ) : (
          supplier.name
        )}
      </td>
      <td className="has-text-left is-size-7">
        {isEditing ? (
          <EditInput
            value={editData.country}
            onChange={onCountryChange}
            hasError={!!errors['country']}
            fieldName="country"
            errors={errors}
          />
        ) : (
          supplier.country
        )}
      </td>
      <td className="has-text-centered is-size-7" style={{ width: ACTION_COLUMN_WIDTH }}>
        <ActionButtons 
          isEditing={isEditing}
          onSave={onSave}
          onCancel={onCancel}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
    {/* General Error Message Row */}
    {isEditing && errors['edit'] && errors['edit'].length > 0 && (
      <tr>
        <td colSpan={3} className="has-background-light">
          <ErrorMessage errors={errors} fieldName="edit" />
        </td>
      </tr>
    )}
  </Fragment>
));
TableRow.displayName = 'TableRow';

const ConfigTable = React.memo<ConfigTableProps>(({ suppliers, onEdit, onDelete }) => {
  // Custom hooks
  const { editingIndex, editData, startEditing, stopEditing, updateEditData } = useEditState();
  const { errors, clearErrors, setFieldError, clearFieldError } = useErrorManager();
  const { validateField, validateForm } = useFormValidation(setFieldError);

  // Real-time validation handlers
  const handleNameChange = useCallback((value: string) => {
    updateEditData('name', value);
    clearFieldError('name');

    if (value.trim()) {
      const validationResult = validateSupplierName(value);
      if (!validationResult.isValid) {
        setFieldError('name', validationResult.error || 'Invalid supplier name');
      }
    }
  }, [updateEditData, clearFieldError, setFieldError]);

  const handleCountryChange = useCallback((value: string) => {
    updateEditData('country', value);
    clearFieldError('country');

    if (value.trim()) {
      const validationResult = validateCountry(value);
      if (!validationResult.isValid) {
        setFieldError('country', validationResult.error || 'Invalid country');
      }
    }
  }, [updateEditData, clearFieldError, setFieldError]);

  // Edit handlers
  const handleEditClick = useCallback((index: number, name: string, country: string) => {
    clearErrors();
    startEditing(index, name, country);
  }, [clearErrors, startEditing]);

  const handleSaveEdit = useCallback((index: number) => {
    clearErrors();
    
    if (!validateForm(editData)) {
      return;
    }

    const validationResult = validateSupplier({ 
      name: editData.name.trim(), 
      country: editData.country.trim() 
    });
    
    if (!validationResult.isValid) {
      setFieldError('edit', validationResult.error || 'Invalid supplier data');
      return;
    }

    if (onEdit) {
      onEdit(index, editData.name.trim(), editData.country.trim());
      stopEditing();
    }
  }, [clearErrors, validateForm, editData, setFieldError, onEdit, stopEditing]);

  const handleCancelEdit = useCallback(() => {
    clearErrors();
    stopEditing();
  }, [clearErrors, stopEditing]);

  const handleDeleteClick = useCallback((index: number) => {
    clearErrors();
    const supplierToDelete = suppliers[index];
    const confirmDelete = window.confirm(
      `Are you sure you want to delete supplier "${supplierToDelete.name}" from "${supplierToDelete.country}"?`
    );
    
    if (confirmDelete && onDelete) {
      onDelete(index);
    }
  }, [clearErrors, suppliers, onDelete]);

  // Memoized table rows
  const tableRows = useMemo(() => {
    return suppliers.map((supplier, index) => {
      const isEditing = editingIndex === index;
      
      return (
        <TableRow
          key={`${supplier.name}-${index}`}
          supplier={supplier}
          index={index}
          isEditing={isEditing}
          editData={editData}
          errors={errors}
          onNameChange={handleNameChange}
          onCountryChange={handleCountryChange}
          onSave={() => handleSaveEdit(index)}
          onCancel={handleCancelEdit}
          onEdit={() => handleEditClick(index, supplier.name, supplier.country)}
          onDelete={() => handleDeleteClick(index)}
        />
      );
    });
  }, [
    suppliers, 
    editingIndex, 
    editData, 
    errors, 
    handleNameChange, 
    handleCountryChange, 
    handleSaveEdit, 
    handleCancelEdit, 
    handleEditClick, 
    handleDeleteClick
  ]);

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
          {tableRows}
        </tbody>
      </table>
    </div>
  );
});

ConfigTable.displayName = 'ConfigTable';

export default ConfigTable;