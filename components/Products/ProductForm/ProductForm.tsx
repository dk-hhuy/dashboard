"use client"

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Product, ProductFormData } from '@/types/product'
import { validateProductForm, validateField } from '@/schemas/productSchema'
import ErrorMessage from '@/components/Shared/ErrorMessage'

// ============================================================================
// CONSTANTS & TYPES
// ============================================================================

const STATUS_OPTIONS = ['In Stock', 'Out Stock'] as const;

interface ProductFormProps {
  product?: Product
  onClose: () => void
  onSave: (productData: ProductFormData[]) => void
  onAddMore?: () => void
}

interface FormData {
  productName: string
  productDescription: string
  productSku: string
  productCategory: string
  productSupplier: string
  productStatus: string
  productPrice: string
  productEffectiveDate: string
  productFulfillmentTime: string
  productImage: string
  uploadedImage?: File
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

// Custom hook for form validation
const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

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

  const markFieldAsTouched = useCallback((fieldKey: string) => {
    setTouchedFields(prev => new Set([...prev, fieldKey]))
  }, [])

  const validateSingleField = useCallback((index: number, field: keyof FormData, value: string) => {
    const fieldKey = `${index}.${field}`
    
    if (typeof value === 'string') {
      const validation = validateField(field as keyof ProductFormData, value)
      if (!validation.success && validation.errors && field in validation.errors) {
        const fieldErrors = validation.errors[field as keyof typeof validation.errors]
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          setFieldError(fieldKey, fieldErrors[0])
        }
      } else {
        clearFieldError(fieldKey)
      }
    }
  }, [setFieldError, clearFieldError])

  const validateAllForms = useCallback((formData: FormData[]) => {
    const newErrors: Record<string, string[]> = {}
    
    formData.forEach((data, index) => {
      const { uploadedImage: _, ...dataWithoutFile } = data
      const hasData = Object.values(dataWithoutFile).some(value => value.trim() !== '')
      
      if (!hasData) {
        return
      }
      
      const validation = validateProductForm(data)
      if (!validation.success) {
        Object.keys(validation.errors).forEach(field => {
          const fieldKey = `${index}.${field}`
          newErrors[fieldKey] = validation.errors[field]
        })
      }
    })
    
    formData.forEach((data, index) => {
      const { uploadedImage: _, ...dataWithoutFile } = data
      const hasData = Object.values(dataWithoutFile).some(value => value.trim() !== '')
      
      if (!hasData) {
        const requiredFields = ['productName', 'productSku', 'productDescription', 'productCategory', 'productStatus', 'productSupplier', 'productPrice', 'productEffectiveDate', 'productFulfillmentTime']
        requiredFields.forEach(field => {
          newErrors[`${index}.${field}`] = [`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`]
        })
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [])

  return {
    errors,
    touchedFields,
    clearErrors,
    setFieldError,
    clearFieldError,
    markFieldAsTouched,
    validateSingleField,
    validateAllForms
  }
}

// Custom hook for multi-form management
const useMultiForm = (initialData: FormData[], isEditMode: boolean) => {
  const [formData, setFormData] = useState<FormData[]>(initialData)

  const updateFormField = useCallback((index: number, field: keyof FormData, value: string | File) => {
    setFormData(prev => prev.map((data, i) => 
      i === index ? { ...data, [field]: value } : data
    ))
  }, [])

  const addForm = useCallback(() => {
    const newForm: FormData = {
      productName: '',
      productDescription: '',
      productSku: '',
      productCategory: '',
      productSupplier: '',
      productStatus: STATUS_OPTIONS[0],
      productPrice: '',
      productEffectiveDate: new Date().toISOString().split('T')[0],
      productFulfillmentTime: '',
      productImage: '/images/glass1.png',
      uploadedImage: undefined
    }
    
    setFormData(prev => [...prev, newForm])
  }, [])

  const removeForm = useCallback((index: number) => {
    setFormData(prev => prev.filter((_, i) => i !== index))
  }, [])

  const isFormValid = useMemo(() => {
    if (isEditMode) {
      const validation = validateProductForm(formData[0])
      return validation.success
    }
    
    return formData.every((data) => {
      const { uploadedImage: _, ...dataWithoutFile } = data
      const hasData = Object.values(dataWithoutFile).some(value => value.trim() !== '')
      
      if (!hasData) {
        return true
      }
      
      const validation = validateProductForm(data)
      return validation.success
    })
  }, [formData, isEditMode])

  return {
    formData,
    updateFormField,
    addForm,
    removeForm,
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
      {required && <span style={{ color: 'red' }}> *</span>}
    </label>
    <div className="control">
      {children}
    </div>
  </div>
))
FormField.displayName = 'FormField'

// Input Field Component
const InputField = React.memo<{
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
  hasError?: boolean
  disabled?: boolean
}>(({ value, onChange, placeholder, type = 'text', required = false, hasError = false, disabled = false }) => (
  <input 
    className={`input is-size-7 ${hasError ? 'is-danger' : ''}`}
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    required={required}
    disabled={disabled}
  />
))
InputField.displayName = 'InputField'

// Textarea Field Component
const TextareaField = React.memo<{
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hasError?: boolean
}>(({ value, onChange, placeholder, hasError = false }) => (
  <textarea 
    className={`textarea is-size-7 ${hasError ? 'is-danger' : ''}`}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={3}
  />
))
TextareaField.displayName = 'TextareaField'

// Select Field Component
const SelectField = React.memo<{
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  hasError?: boolean
}>(({ value, onChange, options, hasError = false }) => (
  <div className={`select is-fullwidth is-size-7 ${hasError ? 'is-danger' : ''}`}>
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
))
SelectField.displayName = 'SelectField'

// Image Upload Field Component
const ImageUploadField = React.memo<{
  value: string
  onChange: (value: string) => void
  onFileSelect: (file: File) => void
}>(({ value, onChange, onFileSelect }) => (
  <div className="field">
    <div className="control">
      <input 
        className="input is-size-7"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter image URL or upload file"
      />
    </div>
    <div className="control mt-2">
      <input 
        className="input is-size-7"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            onFileSelect(file)
            onChange(file.name)
          }
        }}
      />
    </div>
  </div>
))
ImageUploadField.displayName = 'ImageUploadField'

// Form Header Component
const FormHeader = React.memo<{
  onClose: () => void
  onSave: () => void
  handleAddMore: () => void
  isFormValid: boolean
  isEditMode: boolean
  isValidating?: boolean
  totalRows?: number
}>(({ onClose, onSave, handleAddMore, isFormValid, isEditMode, isValidating = false, totalRows = 1 }) => (
  <div className="card-header is-size-7">
    <div className="card-header-title is-size-7">
      <h4 className="title is-4 mb-0 is-size-6">
        {isEditMode ? 'Edit Product' : `Add New Products (${totalRows} items)`}
      </h4>
    </div>
    <div className="card-header-icon is-size-7">
      <div className="buttons">
        {!isEditMode && (
          <button 
            className="button is-info is-small is-size-7"
            onClick={handleAddMore}
            type="button"
          >
            <span>Add Row</span>
          </button>
        )}
        <button 
          className={`button is-success is-small is-size-7 ${isValidating ? 'is-loading' : ''}`}
          onClick={onSave}
          disabled={isValidating}
          type="button"
        >
          <span>{isEditMode ? 'Save' : 'Save All'}</span>
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

// Single Product Form Row Component
const ProductFormRow = React.memo<{
  index: number
  data: FormData
  onUpdate: (index: number, field: keyof FormData, value: string | File) => void
  onRemove: (index: number) => void
  canRemove: boolean
  errors: Record<string, string[]>
  touchedFields: Set<string>
  onFieldChange: (index: number, field: keyof FormData, value: string) => void
  isEditMode: boolean
}>(({ 
  index, 
  data, 
  onUpdate, 
  onRemove, 
  canRemove, 
  errors, 
  touchedFields,
  onFieldChange,
  isEditMode
}) => {
  const hasFieldError = useCallback((fieldName: string) => {
    const fieldKey = `${index}.${fieldName}`
    return errors[fieldKey] && errors[fieldKey].length > 0
  }, [index, errors])

  const updateField = useCallback((field: keyof FormData, value: string) => {
    onUpdate(index, field, value)
    onFieldChange(index, field, value)
  }, [index, onUpdate, onFieldChange])

  return (
    <div className="box mb-3" style={{ border: '1px solid #dbdbdb' }}>
      <div className="level is-mobile mb-3">
        <div className="level-left">
          <div className="level-item">
            <h5 className="title is-5 mb-0 is-size-6">Product {index + 1}</h5>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            {canRemove && (
              <button 
                className="button is-small is-danger is-light"
                onClick={() => onRemove(index)}
                type="button"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="columns is-multiline">
        {/* Product Name */}
        <div className="column is-6">
          <FormField label="Product Name" required>
            <InputField
              value={data.productName}
              onChange={(value) => updateField('productName', value)}
              placeholder="Enter product name"
              required
              hasError={hasFieldError('productName')}
            />
            <ErrorMessage errors={errors} fieldName={`${index}.productName`} />
          </FormField>
        </div>

        {/* Product SKU */}
        <div className="column is-6">
          <FormField label="Product SKU" required>
            <InputField
              value={data.productSku}
              onChange={(value) => updateField('productSku', value)}
              placeholder="Enter product SKU"
              required
              hasError={hasFieldError('productSku')}
              disabled={isEditMode}
            />
            {isEditMode && (
              <div className="help is-info is-size-7 mt-1">
                SKU cannot be modified in edit mode
              </div>
            )}
            <ErrorMessage errors={errors} fieldName={`${index}.productSku`} />
          </FormField>
        </div>

        {/* Product Description */}
        <div className="column is-12">
          <FormField label="Product Description" required>
            <TextareaField
              value={data.productDescription}
              onChange={(value) => updateField('productDescription', value)}
              placeholder="Enter product description"
              hasError={hasFieldError('productDescription')}
            />
            <ErrorMessage errors={errors} fieldName={`${index}.productDescription`} />
          </FormField>
        </div>

        {/* Product Category */}
        <div className="column is-6">
          <FormField label="Product Category" required>
            <InputField
              value={data.productCategory}
              onChange={(value) => updateField('productCategory', value)}
              placeholder="Enter product category"
              hasError={hasFieldError('productCategory')}
            />
            <ErrorMessage errors={errors} fieldName={`${index}.productCategory`} />
          </FormField>
        </div>

        {/* Product Status */}
        <div className="column is-6">
          <FormField label="Product Status" required>
            <SelectField
              value={data.productStatus}
              onChange={(value) => updateField('productStatus', value)}
              options={STATUS_OPTIONS}
              hasError={hasFieldError('productStatus')}
            />
            <ErrorMessage errors={errors} fieldName={`${index}.productStatus`} />
          </FormField>
        </div>

        {/* Product Supplier */}
        <div className="column is-6">
          <FormField label="Product Supplier" required>
            <InputField
              value={data.productSupplier}
              onChange={(value) => updateField('productSupplier', value)}
              placeholder="Enter suppliers (comma separated)"
              hasError={hasFieldError('productSupplier')}
            />
            <ErrorMessage errors={errors} fieldName={`${index}.productSupplier`} />
          </FormField>
        </div>

        {/* Product Price */}
        <div className="column is-6">
          <FormField label="Product Price" required>
            <InputField
              value={data.productPrice}
              onChange={(value) => updateField('productPrice', value)}
              placeholder="Enter product price (e.g., $10.99)"
              type="text"
              required
              hasError={hasFieldError('productPrice')}
            />
            <ErrorMessage errors={errors} fieldName={`${index}.productPrice`} />
          </FormField>
        </div>

        {/* Product Effective Date */}
        <div className="column is-6">
          <FormField label="Effective Date" required>
            <InputField
              value={data.productEffectiveDate}
              onChange={(value) => updateField('productEffectiveDate', value)}
              placeholder="YYYY-MM-DD"
              type="date"
              required
              hasError={hasFieldError('productEffectiveDate')}
            />
            <ErrorMessage errors={errors} fieldName={`${index}.productEffectiveDate`} />
          </FormField>
        </div>

        {/* Product Fulfillment Time */}
        <div className="column is-6">
          <FormField label="Product Fulfillment Time" required>
            <InputField
              value={data.productFulfillmentTime}
              onChange={(value) => updateField('productFulfillmentTime', value)}
              placeholder="e.g., 1-2 days"
              required
              hasError={hasFieldError('productFulfillmentTime')}
            />
            <ErrorMessage errors={errors} fieldName={`${index}.productFulfillmentTime`} />
          </FormField>
        </div>

        {/* Product Image */}
        <div className="column is-6">
          <FormField label="Product Image">
            <ImageUploadField
              value={data.productImage}
              onChange={(value) => updateField('productImage', value)}
              onFileSelect={(file) => {
                onUpdate(index, 'uploadedImage', file)
                updateField('productImage', file.name)
              }}
            />
            <ErrorMessage errors={errors} fieldName={`${index}.productImage`} />
          </FormField>
        </div>
      </div>
    </div>
  )
})
ProductFormRow.displayName = 'ProductFormRow'

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ProductForm = ({ product, onClose, onSave, onAddMore }: ProductFormProps) => {
  // Determine if this is edit mode or add mode
  const isEditMode = !!product
  
  // Initialize form data
  const initialFormData: FormData[] = [{
    productName: product?.name || '',
    productDescription: product?.description || '',
    productSku: product?.productSku || '',
    productCategory: product?.category || '',
    productSupplier: product?.supplier?.join(', ') || '',
    productStatus: product?.productStatus || STATUS_OPTIONS[0],
    productPrice: product?.priceHistory?.[0]?.oldCost || '',
    productEffectiveDate: product?.priceHistory?.[0]?.effectiveDate || new Date().toISOString().split('T')[0],
    productFulfillmentTime: product?.fulfillmentTime || '',
    productImage: '/images/glass1.png',
    uploadedImage: undefined
  }]

  // Custom hooks
  const { 
    errors, 
    touchedFields, 
    clearErrors, 
    setFieldError, 
    clearFieldError, 
    markFieldAsTouched, 
    validateSingleField, 
    validateAllForms 
  } = useFormValidation()

  const { 
    formData, 
    updateFormField, 
    addForm, 
    removeForm, 
    isFormValid 
  } = useMultiForm(initialFormData, isEditMode)

  const [isValidating, setIsValidating] = useState(false)

  // Update effective date to today when in edit mode
  useEffect(() => {
    if (isEditMode) {
      updateFormField(0, 'productEffectiveDate', new Date().toISOString().split('T')[0])
    }
  }, [isEditMode, updateFormField])

  // Handle field change with validation
  const handleFieldChange = useCallback((index: number, field: keyof FormData, value: string) => {
    const fieldKey = `${index}.${field}`
    markFieldAsTouched(fieldKey)
    validateSingleField(index, field, value)
  }, [markFieldAsTouched, validateSingleField])

  // Handle add more form
  const handleAddMore = useCallback(() => {
    addForm()
  }, [addForm])

  // Handle remove form
  const handleRemoveForm = useCallback((index: number) => {
    removeForm(index)
    
    // Clear errors and touched fields for this form
    clearErrors()
  }, [removeForm, clearErrors])

  // Handle save
  const handleSave = useCallback(() => {
    setIsValidating(true)
    
    // Validate all forms first
    const isValid = validateAllForms(formData)
    if (!isValid) {
      setIsValidating(false)
      return
    }
    
    if (isEditMode) {
      // Single product edit mode
      const data = formData[0]
      const productFormData: ProductFormData = {
        name: data.productName,
        description: data.productDescription,
        productSku: data.productSku,
        category: data.productCategory,
        supplier: data.productSupplier.split(',').map(s => s.trim()).filter(Boolean),
        productStatus: data.productStatus as 'In Stock' | 'Out Stock',
        fulfillmentTime: data.productFulfillmentTime,
        productImage: data.productImage,
        uploadedImage: data.uploadedImage,
        priceHistory: [{
          oldCost: data.productPrice,
          effectiveDate: data.productEffectiveDate
        }]
      }
      
      onSave([productFormData])
    } else {
      // Multiple products add mode
      const productsData: ProductFormData[] = formData.map(data => ({
        name: data.productName,
        description: data.productDescription,
        productSku: data.productSku,
        category: data.productCategory,
        supplier: data.productSupplier.split(',').map(s => s.trim()).filter(Boolean),
        productStatus: data.productStatus as 'In Stock' | 'Out Stock',
        fulfillmentTime: data.productFulfillmentTime,
        productImage: data.productImage,
        uploadedImage: data.uploadedImage,
        priceHistory: [{
          oldCost: data.productPrice,
          effectiveDate: data.productEffectiveDate
        }]
      }))
      
      onSave(productsData)
    }
    
    setIsValidating(false)
  }, [formData, isFormValid, isEditMode, onSave, validateAllForms])

  // Memoized form rows
  const formRows = useMemo(() => {
    return formData.map((data, index) => (
      <ProductFormRow
        key={index}
        index={index}
        data={data}
        onUpdate={updateFormField}
        onRemove={handleRemoveForm}
        canRemove={!isEditMode && formData.length > 1}
        errors={errors}
        touchedFields={touchedFields}
        onFieldChange={handleFieldChange}
        isEditMode={isEditMode}
      />
    ))
  }, [formData, updateFormField, handleRemoveForm, isEditMode, errors, touchedFields, handleFieldChange])

  return (
    <div className="card is-size-7">
      <FormHeader 
        onClose={onClose} 
        onSave={handleSave} 
        handleAddMore={handleAddMore}
        isFormValid={isFormValid}
        isEditMode={isEditMode}
        isValidating={isValidating}
        totalRows={formData.length}
      />
      
      <div className="card-content is-size-7" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <div className="content">
          {!isEditMode && (
            <div className="notification is-info is-light is-size-7">
              <strong>Instructions:</strong> Enter product information for each product. 
              Click "Add Row" to add more products to create.
            </div>
          )}
          
          {formRows}
          
          {formData.length === 0 && (
            <div className="has-text-centered has-text-grey-light is-size-7">
              No products to show. Click "Add Row" to start.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductForm