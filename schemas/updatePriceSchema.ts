import { z } from 'zod'

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const VALIDATION_CONFIG = {
  MIN_PRICE: 0.01,
  MAX_PRICE: 999999.99,
  MIN_SKU_LENGTH: 3,
  MAX_SKU_LENGTH: 20
} as const

// ============================================================================
// REGEX PATTERNS
// ============================================================================

const REGEX_PATTERNS = {
  // Price pattern: optional $, numbers, optional 1-2 decimals
  PRICE: /^(\$)?\d+(\.\d{1,2})?$/,
  // SKU pattern: letters, numbers, hyphens, underscores
  SKU: /^[a-zA-Z0-9_-]+$/
} as const

// ============================================================================
// MAIN SCHEMA
// ============================================================================

/**
 * Schema cho update price form
 * Validate price update với rules cụ thể
 */
export const UpdatePriceSchema = z.object({
  // Product identification
  productSku: z.string()
    .min(1, 'Product SKU is required')
    .min(VALIDATION_CONFIG.MIN_SKU_LENGTH, `Product SKU must be at least ${VALIDATION_CONFIG.MIN_SKU_LENGTH} characters`)
    .max(VALIDATION_CONFIG.MAX_SKU_LENGTH, `Product SKU must be less than ${VALIDATION_CONFIG.MAX_SKU_LENGTH} characters`)
    .regex(REGEX_PATTERNS.SKU, 'SKU must contain only letters, numbers, hyphens, and underscores')
    .trim(),
    
  // Price information
  cost: z.string()
    .min(1, 'Cost is required')
    .regex(REGEX_PATTERNS.PRICE, 'Cost must be a valid number (e.g., 10.99, 25, 19.5)')
    .refine((val) => {
      const numericPrice = parseFloat(val.replace('$', ''))
      return numericPrice >= VALIDATION_CONFIG.MIN_PRICE && 
             numericPrice <= VALIDATION_CONFIG.MAX_PRICE
    }, `Cost must be between $${VALIDATION_CONFIG.MIN_PRICE} and $${VALIDATION_CONFIG.MAX_PRICE}`),
    
  // Date information
  effectiveDate: z.string()
    .min(1, 'Effective date is required')
    .refine((val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Effective date must be a valid date')
    .refine((val) => {
      const date = new Date(val)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date >= today
    }, 'Effective date cannot be in the past')
})

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate update price form
 * @param data - Form data to validate
 * @returns Validation result with success/error status
 */
export const validateUpdatePrice = (data: any) => {
  try {
    UpdatePriceSchema.parse(data)
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

/**
 * Validate single field
 * @param fieldName - Field name to validate
 * @param value - Value to validate
 * @returns Validation result with success/error status
 */
export const validateUpdatePriceField = (fieldName: string, value: string) => {
  try {
    const fieldSchema = UpdatePriceSchema.pick({ [fieldName]: true })
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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get error message for specific field
 * @param errors - Error object
 * @param fieldName - Field name to get error for
 * @returns Error message or null
 */
export const getUpdatePriceError = (errors: Record<string, string[]>, fieldName: string): string | null => {
  return errors[fieldName]?.[0] || null
}

/**
 * Check if field has error
 * @param errors - Error object
 * @param fieldName - Field name to check
 * @returns Boolean indicating if field has error
 */
export const hasUpdatePriceError = (errors: Record<string, string[]>, fieldName: string): boolean => {
  return !!errors[fieldName]?.length
}



 