"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { Product } from '@/types/product'
import { 
  validateUpdatePrice, 
  validateUpdatePriceField, 
  getUpdatePriceError, 
  hasUpdatePriceError
} from '@/schemas/updatePriceSchema'
import ErrorMessage from '@/components/Shared/ErrorMessage'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface UpdatePriceProps {
  products: Product[]
  onClose: () => void
  onSave: (priceUpdates: PriceUpdate[]) => void
}

interface PriceUpdate {
  productSku: string
  cost: string
  effectiveDate: string
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

// Custom hook for price update validation
const usePriceValidation = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const setFieldError = useCallback((fieldKey: string, errorMessage: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldKey]: [errorMessage]
    }))
  }, [])

  const clearFieldError = useCallback((fieldKey: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
        delete newErrors[fieldKey]
        return newErrors
    })
  }, [])

  const validateAllForms = useCallback((priceUpdates: PriceUpdate[], products: Product[]) => {
    const newErrors: Record<string, string[]> = {}
    
    // Check if any row has data
    const hasAnyData = priceUpdates.some(update => 
      update.productSku.trim() !== '' ||
      update.cost.trim() !== '' ||
      update.effectiveDate.trim() !== ''
    )
    
    // Check each row and show errors for incomplete rows
    priceUpdates.forEach((update, index) => {
      const hasData = update.productSku.trim() !== '' || update.cost.trim() !== '' || update.effectiveDate.trim() !== ''
      
      if (!hasData) {
        // Show errors for all required fields in this row
        const requiredFields = ['productSku', 'cost', 'effectiveDate']
        requiredFields.forEach(field => {
          newErrors[`${index}.${field}`] = [`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`]
        })
      }
    })
    
    // If no rows have data at all, return false
    if (!hasAnyData) {
      setErrors(newErrors)
      return false
    }
    
    // Validate rows that have data
    priceUpdates.forEach((update, index) => {
      const hasData = update.productSku.trim() !== '' || update.cost.trim() !== '' || update.effectiveDate.trim() !== ''
      
      if (hasData) {
        const validation = validateUpdatePrice(update)
        if (!validation.success) {
          Object.keys(validation.errors).forEach(field => {
            const fieldKey = `${index}.${field}`
            newErrors[fieldKey] = validation.errors[field]
          })
        }
      }
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }
    
    // Check for duplicate SKUs
    const validUpdates = priceUpdates.filter(update => 
      update.productSku.trim() !== '' &&
      update.cost.trim() !== '' &&
      update.effectiveDate.trim() !== ''
    )
    
    const skus = validUpdates.map(update => update.productSku)
    const uniqueSkus = new Set(skus)
    if (skus.length !== uniqueSkus.size) {
      setErrors({ general: ['Duplicate SKUs found. Each product can only be updated once.'] })
      return false
    }
    
    const invalidSkus = validUpdates.filter(update => 
      !products.some(product => product.productSku === update.productSku)
    )
    
    if (invalidSkus.length > 0) {
      const invalidSkuList = invalidSkus.map(u => u.productSku).join(', ')
      setErrors({ general: [`Invalid SKUs: ${invalidSkuList}. These products do not exist.`] })
      return false
    }
    
    return true
  }, [])

  return {
    errors,
    clearErrors,
    setFieldError,
    clearFieldError,
    validateAllForms
  }
}

// Custom hook for price update management
const usePriceUpdate = () => {
  const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([
    { productSku: '', cost: '', effectiveDate: '' }
  ])

  const addRow = useCallback(() => {
    setPriceUpdates(prev => [...prev, { productSku: '', cost: '', effectiveDate: '' }])
  }, [])

  const removeRow = useCallback((index: number) => {
    setPriceUpdates(prev => prev.filter((_, i) => i !== index))
  }, [])

  const updateField = useCallback((index: number, field: keyof PriceUpdate, value: string) => {
    setPriceUpdates(prev => {
      const updated = prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
      return updated
    })
  }, [])

  const isFormValid = useMemo(() => {
    const validUpdates = priceUpdates.filter(update => 
      update.productSku.trim() !== '' &&
      update.cost.trim() !== '' &&
      update.effectiveDate.trim() !== ''
    )
    
    if (validUpdates.length === 0) return false
    
    // Validate each update individually
    const allValid = validUpdates.every(update => {
      const validation = validateUpdatePrice(update)
      return validation.success
    })
    
    return allValid
  }, [priceUpdates])

  return {
    priceUpdates,
    addRow,
    removeRow,
    updateField,
    isFormValid
  }
}

// ============================================================================
// EXTRACTED COMPONENTS
// ============================================================================

// Form Field Component
const FormField = React.memo<{
  label: string
  children: React.ReactNode
  required?: boolean
}>(({ label, children, required = false }) => (
  <div className="field">
    <label className="label is-size-7">
      {label}
      {required && <span className="has-text-danger"> *</span>}
    </label>
    <div className="control">{children}</div>
  </div>
))
FormField.displayName = 'FormField'

// Input Field Component
const InputField = React.memo<{
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
  required?: boolean
  hasError?: boolean
}>(({ value, onChange, placeholder, type = 'text', required = true, hasError = false }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
  }, [onChange])

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    // Trigger validation on focus to show errors immediately
    const currentValue = e.target.value
    if (currentValue) {
      onChange(currentValue)
    }
  }, [onChange])

  return (
    <input 
      className={`input is-size-7 ${hasError ? 'is-danger' : ''}`}
      type={type}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder={placeholder}
      required={required}
      aria-invalid={hasError}
    />
  )
})
InputField.displayName = 'InputField'

// Price Update Row Component
const PriceUpdateRow = React.memo<{
  index: number
  data: PriceUpdate
  onUpdate: (index: number, field: keyof PriceUpdate, value: string) => void
  onRemove: (index: number) => void
  canRemove: boolean
  errors: Record<string, string[]>
  onFieldChange: (index: number, field: keyof PriceUpdate, value: string) => void
}>(({ 
  index, 
  data, 
  onUpdate, 
  onRemove, 
  canRemove, 
  errors,
  onFieldChange
}) => {
  const handleFieldChange = useCallback((field: keyof PriceUpdate, value: string) => {
    onUpdate(index, field, value)
    onFieldChange(index, field, value)
  }, [index, onUpdate, onFieldChange])

  return (
    <div className="columns is-gapless mb-3">
      <div className="column is-4 mr-2">
        <FormField label="Product SKU" required>
          <InputField
            value={data.productSku}
            onChange={(value) => handleFieldChange('productSku', value)}
            placeholder="Enter product SKU"
            required
            hasError={hasUpdatePriceError(errors, `${index}.productSku`)}
          />
          <ErrorMessage errors={errors} fieldName={`${index}.productSku`} />
        </FormField>
      </div>
      
      <div className="column is-3 mr-2">
        <FormField label="Cost" required>
          <InputField
            value={data.cost}
            onChange={(value) => handleFieldChange('cost', value)}
            placeholder="Enter cost (e.g., 10.99)"
            type="text"
            required
            hasError={hasUpdatePriceError(errors, `${index}.cost`)}
          />
          <ErrorMessage errors={errors} fieldName={`${index}.cost`} />
        </FormField>
      </div>
      
      <div className="column is-3 mr-2">
        <FormField label="Effective Date" required>
          <InputField
            value={data.effectiveDate}
            onChange={(value) => handleFieldChange('effectiveDate', value)}
            placeholder="YYYY-MM-DD"
            type="date"
            required
            hasError={hasUpdatePriceError(errors, `${index}.effectiveDate`)}
          />
          <ErrorMessage errors={errors} fieldName={`${index}.effectiveDate`} />
        </FormField>
      </div>
      
      <div className="column is-2">
        <div className="field">
          <label className="label is-size-7">&nbsp;</label>
          <div className="control">
            {canRemove && (
              <button
                className="button is-danger is-small is-size-7"
                onClick={() => onRemove(index)}
                type="button"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
PriceUpdateRow.displayName = 'PriceUpdateRow'

// Form Header Component
const FormHeader = React.memo<{
  onClose: () => void
  onSave: () => void
  onAdd: () => void
  isFormValid: boolean
  totalRows: number
  isValidating?: boolean
}>(({ onClose, onSave, onAdd, isFormValid, totalRows, isValidating = false }) => (
  <div className="card-header is-size-7">
    <div className="card-header-title is-size-7">
      <h4 className="title is-4 mb-0 is-size-6">Update Product Prices ({totalRows} items)</h4>
    </div>
    <div className="card-header-icon is-size-7">
      <div className="buttons">
        <button
          className="button is-info is-small is-size-7"
          onClick={onAdd}
          type="button"
        >
          <span>Add Row</span>
        </button>
        <button
          className={`button is-success is-small is-size-7 ${isValidating ? 'is-loading' : ''}`}
          onClick={onSave}
          disabled={isValidating}
          type="button"
        >
          <span>Save All</span>
        </button>
        <button
          className="button is-light is-danger is-small is-size-7"
          onClick={onClose}
          type="button"
        >
          <span>Close</span>
        </button>
      </div>
    </div>
  </div>
))
FormHeader.displayName = 'FormHeader'

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UpdatePrice = ({ products, onClose, onSave }: UpdatePriceProps) => {
  // Custom hooks
  const { errors, clearErrors, setFieldError, clearFieldError, validateAllForms } = usePriceValidation()
  const { priceUpdates, addRow, removeRow, updateField, isFormValid } = usePriceUpdate()
  
  const [isValidating, setIsValidating] = useState(false)

  // Handle field change with error clearing
  const handleFieldChange = useCallback((index: number, field: keyof PriceUpdate, value: string) => {
    const fieldKey = `${index}.${field}`
    clearFieldError(fieldKey)
  }, [clearFieldError])

  // Handle save
  const handleSave = useCallback(() => {
    setIsValidating(true)
    
    // Validate all forms first
    const isValid = validateAllForms(priceUpdates, products)
    if (!isValid) {
      setIsValidating(false)
      return
    }
    
    const validUpdates = priceUpdates.filter(update => 
      update.productSku.trim() !== '' &&
      update.cost.trim() !== '' &&
      update.effectiveDate.trim() !== ''
    )
    
    setIsValidating(false)
    onSave(validUpdates)
  }, [priceUpdates, validateAllForms, onSave, products])

  // Memoized price update rows
  const priceUpdateRows = useMemo(() => {
    return priceUpdates.map((update, index) => (
      <PriceUpdateRow
        key={index}
        index={index}
        data={update}
        onUpdate={updateField}
        onRemove={removeRow}
        canRemove={priceUpdates.length > 1}
        errors={errors}
        onFieldChange={handleFieldChange}
      />
    ))
  }, [priceUpdates, updateField, removeRow, errors, handleFieldChange])

  return (
    <div className="card is-size-7">
      <FormHeader 
        onClose={onClose}
        onSave={handleSave}
        onAdd={addRow}
        isFormValid={isFormValid}
        totalRows={priceUpdates.length}
        isValidating={isValidating}
      />
      
      <div className="card-content is-size-7">
        <div className="content">
          <div className="notification is-info is-light is-size-7">
            <strong>Instructions:</strong> Enter product SKU, new cost, and effective date for each product. 
            Click "Add Row" to add more products to update.
          </div>
          
          {hasUpdatePriceError(errors, 'general') && (
            <div className="notification is-danger is-light is-size-7">
              <strong>Validation Error:</strong> {getUpdatePriceError(errors, 'general')}
            </div>
          )}
          
          {priceUpdateRows}
          
          {priceUpdates.length === 0 && (
            <div className="has-text-centered has-text-grey-light is-size-7">
              No price updates to show. Click "Add Row" to start.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UpdatePrice 