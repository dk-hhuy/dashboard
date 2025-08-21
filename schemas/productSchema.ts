import { Product, ProductFormData } from '@/types/product'
import { z } from 'zod'

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const VALIDATION_CONFIG = {
  // Field length limits
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_SKU_LENGTH: 3,
  MAX_SKU_LENGTH: 20,
  MIN_SUPPLIER_LENGTH: 2,
  MAX_SUPPLIER_LENGTH: 50,
  MIN_SUPPLIERS: 1,
  MAX_SUPPLIERS: 5,
  MIN_PRICE: 0.01
} as const

// ============================================================================
// REGEX PATTERNS
// ============================================================================

const REGEX_PATTERNS = {
  // SKU pattern: letters, numbers, hyphens, underscores
  SKU: /^[a-zA-Z0-9_-]+$/,
  
  // Price pattern: optional $, numbers, optional 1-2 decimals
  PRICE: /^(\$)?\d+(\.\d{1,2})?$/,
  
  // Fulfillment time pattern: X-Y days or X days
  FULFILLMENT_TIME: /^\d+(-\d+)?\s*days?$/,
  
  // Image URL pattern: http/https, relative path, or data URL
  IMAGE_URL: /^(https?:\/\/|\.\/|\/|data:image\/)/
} as const

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Schema cho supplier validation
 * Hỗ trợ comma-separated string và validate từng supplier
 */
const SupplierSchema = z.string()
  .min(1, 'At least one supplier is required')
  .refine((val) => {
    const suppliers = val.split(',').map(s => s.trim()).filter(Boolean)
    return suppliers.length >= VALIDATION_CONFIG.MIN_SUPPLIERS && 
           suppliers.length <= VALIDATION_CONFIG.MAX_SUPPLIERS
  }, `Enter ${VALIDATION_CONFIG.MIN_SUPPLIERS}-${VALIDATION_CONFIG.MAX_SUPPLIERS} suppliers separated by commas`)
  .refine((val) => {
    const suppliers = val.split(',').map(s => s.trim()).filter(Boolean)
    return suppliers.every(supplier => 
      supplier.length >= VALIDATION_CONFIG.MIN_SUPPLIER_LENGTH && 
      supplier.length <= VALIDATION_CONFIG.MAX_SUPPLIER_LENGTH
    )
  }, `Each supplier must be ${VALIDATION_CONFIG.MIN_SUPPLIER_LENGTH}-${VALIDATION_CONFIG.MAX_SUPPLIER_LENGTH} characters`)

// ============================================================================
// MAIN SCHEMA
// ============================================================================

/**
 * Schema cho product form validation
 * Validate tất cả fields của product form với rules cụ thể
 */
export const ProductFormSchema = z.object({
  // Basic product information
  productName: z.string()
    .min(VALIDATION_CONFIG.MIN_NAME_LENGTH, `Product name must be at least ${VALIDATION_CONFIG.MIN_NAME_LENGTH} characters`)
    .max(VALIDATION_CONFIG.MAX_NAME_LENGTH, `Product name must be less than ${VALIDATION_CONFIG.MAX_NAME_LENGTH} characters`)
    .trim(),
        
  productDescription: z.string()
    .min(VALIDATION_CONFIG.MIN_DESCRIPTION_LENGTH, `Product description must be at least ${VALIDATION_CONFIG.MIN_DESCRIPTION_LENGTH} characters`)
    .max(VALIDATION_CONFIG.MAX_DESCRIPTION_LENGTH, `Product description must be less than ${VALIDATION_CONFIG.MAX_DESCRIPTION_LENGTH} characters`)
    .trim(),
        
  productSku: z.string()
    .min(VALIDATION_CONFIG.MIN_SKU_LENGTH, `Product SKU must be at least ${VALIDATION_CONFIG.MIN_SKU_LENGTH} characters`)
    .max(VALIDATION_CONFIG.MAX_SKU_LENGTH, `Product SKU must be less than ${VALIDATION_CONFIG.MAX_SKU_LENGTH} characters`)
    .regex(REGEX_PATTERNS.SKU, 'SKU must contain only letters, numbers, hyphens, and underscores')
    .trim(),
        
  productCategory: z.string()
    .min(1, 'Product category is required')
    .trim(),
        
  // Business logic fields
  productSupplier: SupplierSchema,
        
  productFulfillmentTime: z.string()
    .min(1, 'Product fulfillment time is required')
    .regex(REGEX_PATTERNS.FULFILLMENT_TIME, 'Format: X-Y days or X days (e.g., "1-2 days", "3 days")'),
        
  productStatus: z.enum(['In Stock', 'Out Stock'], {
    message: 'Please select a valid status'
  }),
    
  // Price and date fields
  productPrice: z.string()
    .min(1, 'Product price is required')
    .regex(REGEX_PATTERNS.PRICE, 'Price must be a valid number (e.g., 10.99, 25, 19.5)')
    .refine((val) => {
      const numericPrice = parseFloat(val.replace('$', ''))
      return numericPrice >= VALIDATION_CONFIG.MIN_PRICE
    }, `Price must be at least $${VALIDATION_CONFIG.MIN_PRICE}`),
        
  productEffectiveDate: z.string()
    .min(1, 'Effective date is required')
    .refine((val) => {
      const date = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date >= today
    }, 'Effective date cannot be in the past'),
    
  // Optional fields
  productImage: z.string().optional()
})

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate a single field
 * @param fieldName - Name of the field to validate
 * @param value - Value to validate
 * @returns Validation result with success/error status
 */
export const validateField = (fieldName: keyof ProductFormData, value: string) => {
  try {
    const fieldSchema = ProductFormSchema.pick({ [fieldName]: true })
    fieldSchema.parse({ [fieldName]: value })
    return { success: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: { 
          [fieldName]: (error as z.ZodError<any>).issues.map((e: any) => e.message) 
        }
      }
    }
    return { 
      success: false, 
      errors: { [fieldName]: ['Validation error occurred'] } 
    }
  }
}

/**
 * Validate entire form
 * @param data - Form data to validate
 * @returns Validation result with success/error status
 */
export const validateProductForm = (data: Partial<ProductFormData>) => {
  try {
    ProductFormSchema.parse(data)
    return { success: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      ;(error as z.ZodError<any>).issues.forEach((err: any) => {
        const field = err.path[0] as string
        if (!errors[field]) {
          errors[field] = []
        }
        errors[field].push(err.message)
      })
      return { success: false, errors }
    }
    return { 
      success: false, 
      errors: { general: ['Validation error occurred'] } 
    }
  }
}

// ============================================================================
// CUSTOM VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate SKU uniqueness
 * @param sku - SKU to check
 * @param existingProducts - Array of existing products
 * @param currentSku - Current SKU (for edit mode)
 * @returns Promise<boolean> - True if SKU is unique
 */
export const validateSKUUnique = async (
  sku: string, 
  existingProducts: Product[], 
  currentSku?: string
): Promise<boolean> => {
  if (currentSku && sku === currentSku) return true
  const exists = existingProducts.some(p => p.productSku === sku)
  return !exists
}

/**
 * Validate price format
 * @param price - Price string to validate
 * @returns Boolean indicating if price format is valid
 */
export const validatePriceFormat = (price: string): boolean => {
  if (!REGEX_PATTERNS.PRICE.test(price)) return false
  
  const numericPrice = parseFloat(price.replace('$', ''))
  return numericPrice >= VALIDATION_CONFIG.MIN_PRICE
}

/**
 * Validate image URL format
 * @param url - URL string to validate
 * @returns Boolean indicating if URL format is valid
 */
export const validateImageURL = (url: string): boolean => {
  if (!url) return true // Optional field
  
  return REGEX_PATTERNS.IMAGE_URL.test(url)
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get error message for specific field
 * @param errors - Error object
 * @param fieldName - Field name to get error for
 * @returns Error message or null
 */
export const getFieldError = (errors: Record<string, string[]>, fieldName: string): string | null => {
  return errors[fieldName]?.[0] || null
}

/**
 * Check if field has error
 * @param errors - Error object
 * @param fieldName - Field name to check
 * @returns Boolean indicating if field has error
 */
export const hasFieldError = (errors: Record<string, string[]>, fieldName: string): boolean => {
  return !!errors[fieldName]?.length
}

/**
 * Format price to standard format
 * @param price - Raw price value
 * @returns Formatted price string
 */
export const formatPrice = (price: string): string => {
  if (!price) return '0.00'
  
  const cleanPrice = price.toString().replace('$', '').trim()
  const numericPrice = parseFloat(cleanPrice)
  
  if (isNaN(numericPrice)) return '0.00'
  
  return numericPrice.toFixed(2)
}

/**
 * Parse suppliers from comma-separated string
 * @param supplierString - Comma-separated supplier string
 * @returns Array of supplier strings
 */
export const parseSuppliers = (supplierString: string): string[] => {
  if (!supplierString) return []
  
  return supplierString
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}