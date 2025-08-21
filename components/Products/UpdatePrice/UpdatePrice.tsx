"use client"

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Product } from '@/types/product'
import { 
  validateUpdatePrice, 
  validateUpdatePriceField, 
  getUpdatePriceError, 
  hasUpdatePriceError
} from '@/schemas/updatePriceSchema'

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

const FormField = React.memo(({
  label,
  children,
  required = false
}: {
  label: string
  children: React.ReactNode
  required?: boolean
}) => (
  <div className="field">
    <label className="label is-size-7">
      {label}
      {required && <span className="has-text-danger"> *</span>}
    </label>
    <div className="control">{children}</div>
  </div>
))
FormField.displayName = 'FormField'

const ErrorMessage = React.memo(({ 
  errors, 
  fieldName 
}: { 
  errors: Record<string, string[]>
  fieldName: string
}) => {
  const fieldErrors = errors[fieldName] || []
  
  let error = fieldErrors[0]
  if (fieldErrors.length > 1) {
    const formatError = fieldErrors.find(e => e.includes('valid number'))
    if (formatError) {
      error = formatError
    }
  }
  
  console.log(`ErrorMessage for ${fieldName}: error="${error}", fieldErrors=`, fieldErrors)
  
  if (!error) return null
  
  return (
    <p className="help is-danger is-size-7 mt-1">
      {error}
    </p>
  )
})
ErrorMessage.displayName = 'ErrorMessage'

const InputField = React.memo(({
  value,
  onChange,
  placeholder,
  type = 'text',
  required = true,
  hasError = false
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
  required?: boolean
  hasError?: boolean
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    console.log(`InputField handleChange: "${newValue}"`)
    onChange(newValue)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow all input, let validation handle errors
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Trigger validation on focus to show errors immediately
    const currentValue = e.target.value
    if (currentValue) {
      // This will trigger validation through the onChange callback
      onChange(currentValue)
    }
  }

  return (
    <input 
      className={`input is-size-7 ${hasError ? 'is-danger' : ''}`}
      type={type}
      value={value}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      onFocus={handleFocus}
      placeholder={placeholder}
      required={required}
      aria-invalid={hasError}
      step={undefined}
      min={undefined}
    />
  )
})
InputField.displayName = 'InputField'

const PriceUpdateRow = React.memo(({
  index,
  data,
  onUpdate,
  onRemove,
  canRemove,
  errors
}: {
  index: number
  data: PriceUpdate
  onUpdate: (index: number, field: keyof PriceUpdate, value: string) => void
  onRemove: (index: number) => void
  canRemove: boolean
  errors: Record<string, string[]>
}) => (
  <div className="columns is-gapless mb-3">
    <div className="column is-4 mr-2">
      <FormField label="Product SKU" required>
        <InputField
          value={data.productSku}
          onChange={(value) => onUpdate(index, 'productSku', value)}
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
          onChange={(value) => onUpdate(index, 'cost', value)}
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
          onChange={(value) => onUpdate(index, 'effectiveDate', value)}
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
))
PriceUpdateRow.displayName = 'PriceUpdateRow'

const FormHeader = React.memo(({
  onClose,
  onSave,
  onAdd,
  isFormValid,
  totalRows,
  isValidating = false
}: {
  onClose: () => void
  onSave: () => void
  onAdd: () => void
  isFormValid: boolean
  totalRows: number
  isValidating?: boolean
}) => (
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

const UpdatePrice = ({ products, onClose, onSave }: UpdatePriceProps) => {
    const [priceUpdates, setPriceUpdates] = useState<PriceUpdate[]>([
    { productSku: '', cost: '', effectiveDate: '' }
  ])
  
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [isValidating, setIsValidating] = useState(false)

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

  const handleAddRow = useCallback(() => {
    setPriceUpdates(prev => [...prev, { productSku: '', cost: '', effectiveDate: '' }])
  }, [])

  const handleRemoveRow = useCallback((index: number) => {
    setPriceUpdates(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleUpdateField = useCallback((index: number, field: keyof PriceUpdate, value: string) => {
    setPriceUpdates(prev => {
      const updated = prev.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
      
      const fieldKey = `${index}.${field}`
      
      // Clear error for this field when user types
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors }
        delete newErrors[fieldKey]
        return newErrors
      })
      
      return updated
    })
  }, [])



  // Validate all forms and show errors
  const validateAllForms = useCallback(() => {
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
  }, [priceUpdates, products])

  const handleSave = useCallback(() => {
    setIsValidating(true)
    
    // Validate all forms first
    const isValid = validateAllForms()
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
  }, [priceUpdates, validateAllForms, onSave])

  return (
    <div className="card is-size-7">
      <FormHeader 
        onClose={onClose}
        onSave={handleSave}
        onAdd={handleAddRow}
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
          
          {priceUpdates.map((update, index) => (
            <PriceUpdateRow
              key={index}
              index={index}
              data={update}
              onUpdate={handleUpdateField}
              onRemove={handleRemoveRow}
              canRemove={priceUpdates.length > 1}
              errors={errors}
            />
          ))}
          
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