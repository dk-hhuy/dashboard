import { z } from 'zod'

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const VALIDATION_CONFIG = {
  // File validation
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FILE_TYPES: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'text/csv', // .csv
    'application/csv',
    'application/json' // .json
  ] as const,

  // Image Validation
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10 MB
  SUPPORTED_IMAGE_TYPES: [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif'
  ] as const,

  // Template file validation
  MAX_TEMPLATE_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_TEMPLATE_FILE_TYPES: [
    'image/vnd.adobe.photoshop', // .psd
    'application/postscript', // .ai
    'image/png', // .png
    'image/jpeg', // .jpg
    'image/jpg', // .jpg
    'application/pdf' // .pdf
  ] as const,


  // Product validation
  MIN_PRODUCTS: 1,
  MAX_PRODUCTS: 100,
  MIN_SKU_LENGTH: 3,
  MAX_SKU_LENGTH: 20,
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 1,
  MAX_DESCRIPTION_LENGTH: 500,
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
  FULFILLMENT_TIME: /^\d+(-\d+)?\s*days?$/
} as const

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Schema cho price history entry
 * Mỗi entry chứa giá cũ và ngày hiệu lực
 */
const PriceHistoryEntrySchema = z.object({
  oldCost: z.string()
    .min(1, 'Cost is required')
    .regex(REGEX_PATTERNS.PRICE, 'Cost must be a valid number (e.g., 10.99, 25, 19.5)')
    .refine((val) => {
      const numericCost = parseFloat(val.replace('$', ''))
      return numericCost >= VALIDATION_CONFIG.MIN_PRICE
    }, `Cost must be at least $${VALIDATION_CONFIG.MIN_PRICE}`),
    
  effectiveDate: z.string()
    .min(1, 'Effective date is required')
    .refine((val) => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Effective date must be a valid date')
})

/**
 * Schema cho supplier array
 * Hỗ trợ cả array và comma-separated string
 */
const SupplierSchema = z.array(z.string())
  .min(VALIDATION_CONFIG.MIN_SUPPLIERS, `At least ${VALIDATION_CONFIG.MIN_SUPPLIERS} supplier is required`)
  .max(VALIDATION_CONFIG.MAX_SUPPLIERS, `Maximum ${VALIDATION_CONFIG.MAX_SUPPLIERS} suppliers allowed`)

// ============================================================================
// MAIN SCHEMAS
// ============================================================================

/**
 * Schema cho file upload validation
 * Kiểm tra file size, type và format
 */
export const ImportFileSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a file' })
    .refine((file) => file.size > 0, 'File cannot be empty')
    .refine((file) => file.size <= VALIDATION_CONFIG.MAX_FILE_SIZE, 
      `File size must be less than ${VALIDATION_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`)
    .refine((file) => (VALIDATION_CONFIG.SUPPORTED_FILE_TYPES as readonly string[]).includes(file.type), 
      'File must be Excel (.xlsx, .xls), CSV, or JSON format'),
})

/**
 * Schema cho image file validation
 * Kiểm tra file size, type và format
 */
export const ImageFileSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a file' })

  .refine((file) => file.size > 0, 'File cannot be empty')
  .refine((file) => file.size <= VALIDATION_CONFIG.MAX_IMAGE_SIZE, 
    `Image size must be less than ${VALIDATION_CONFIG.MAX_IMAGE_SIZE / (1024 * 1024)}MB`)
  .refine((file) => (VALIDATION_CONFIG.SUPPORTED_IMAGE_TYPES as readonly string[]).includes(file.type),
    'Image must be a valid type (png, jpg, webp, gif)'),
})

/**
 * Schema cho template file upload validation
 * Hỗ trợ PSD, AI, PNG, JPG, PDF với size ≤ 50MB
 */
export const TemplateFileSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a template file' })
    .refine((file) => file.size > 0, 'Template file cannot be empty')
    .refine((file) => file.size <= VALIDATION_CONFIG.MAX_TEMPLATE_FILE_SIZE, 
      `Template file size must be less than ${VALIDATION_CONFIG.MAX_TEMPLATE_FILE_SIZE / (1024 * 1024)}MB`)
    .refine((file) => {
      // Check file type by MIME type
      const isValidMimeType = (VALIDATION_CONFIG.SUPPORTED_TEMPLATE_FILE_TYPES as readonly string[]).includes(file.type)
      
      // Also check file extension as fallback for some file types
      const fileName = file.name.toLowerCase()
      const isValidExtension = fileName.endsWith('.psd') || 
                              fileName.endsWith('.ai') || 
                              fileName.endsWith('.png') || 
                              fileName.endsWith('.jpg') || 
                              fileName.endsWith('.jpeg') || 
                              fileName.endsWith('.pdf')
      
      return isValidMimeType || isValidExtension
    }, 'Template file must be PSD, AI, PNG, JPG, or PDF format'),
})

/**
 * Schema cho imported product data
 * Validate từng field của product với rules cụ thể
 */
export const ImportedProductSchema = z.object({
  // Required fields
  productSku: z.string()
    .min(VALIDATION_CONFIG.MIN_SKU_LENGTH, `Product SKU must be at least ${VALIDATION_CONFIG.MIN_SKU_LENGTH} characters`)
    .max(VALIDATION_CONFIG.MAX_SKU_LENGTH, `Product SKU must be less than ${VALIDATION_CONFIG.MAX_SKU_LENGTH} characters`)
    .regex(REGEX_PATTERNS.SKU, 'SKU must contain only letters, numbers, hyphens, and underscores')
    .trim(),
    
  name: z.string()
    .min(VALIDATION_CONFIG.MIN_NAME_LENGTH, `Product name must be at least ${VALIDATION_CONFIG.MIN_NAME_LENGTH} characters`)
    .max(VALIDATION_CONFIG.MAX_NAME_LENGTH, `Product name must be less than ${VALIDATION_CONFIG.MAX_NAME_LENGTH} characters`)
    .trim(),
    
  // Optional fields with defaults
  description: z.string()
    .min(VALIDATION_CONFIG.MIN_DESCRIPTION_LENGTH, 'Product description is required')
    .max(VALIDATION_CONFIG.MAX_DESCRIPTION_LENGTH, `Product description must be less than ${VALIDATION_CONFIG.MAX_DESCRIPTION_LENGTH} characters`)
    .trim(),
    
  category: z.string()
    .min(1, 'Product category is required')
    .trim(),
    
  fulfillmentTime: z.string()
    .min(1, 'Product fulfillment time is required')
    .trim(),
    
  // Complex fields
  priceHistory: z.array(PriceHistoryEntrySchema)
    .min(1, 'At least one price history entry is required'),
    
  supplier: SupplierSchema,
    
  productStatus: z.enum(['In Stock', 'Out Stock'], {
    message: 'Please select a valid status'
  }),
    
  mainimage: z.string().optional().default('/images/glass1.png')
})

/**
 * Schema cho array of imported products
 * Validate số lượng products và từng product
 */
export const ImportedProductsArraySchema = z.array(ImportedProductSchema)
  .min(VALIDATION_CONFIG.MIN_PRODUCTS, `At least ${VALIDATION_CONFIG.MIN_PRODUCTS} product is required`)
  .max(VALIDATION_CONFIG.MAX_PRODUCTS, `Maximum ${VALIDATION_CONFIG.MAX_PRODUCTS} products can be imported at once`)

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate file upload
 * @param file - File to validate
 * @returns Validation result with success/error status
 */
export const validateImportFile = (file: File) => {
  try {
    ImportFileSchema.parse({ file })
    return { success: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: { 
          file: (error as z.ZodError<any>).issues.map((e: any) => e.message) 
        }
      }
    }
    return { 
      success: false, 
      errors: { file: ['Validation error occurred'] } 
    }
  }
}

/**
 * Validate image file
 * @param file - Image file to validate
 * @returns Validation result with success/error status
 */
export const validateImageFile = (file: File) => {
  try {
    ImageFileSchema.parse({file})
    return { success: true, errors: {} }

  } catch (error) {
    if ( error instanceof z.ZodError) {
      return {
        success: false,
        errors: {
          file: (error as z.ZodError<any>).issues.map((e: any) => e.message)
        }
      }
    }
    return {
      success: false,
      errors: { file: ['Validation error occurred'] } 
    }
  }
}

/**
 * Validate template file upload
 * @param file - Template file to validate (PSD, AI, PNG, JPG, PDF)
 * @returns Validation result with success/error status
 */
export const validateTemplateFile = (file: File) => {
  try {
    TemplateFileSchema.parse({ file })
    return { success: true, errors: {} }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: {
          file: (error as z.ZodError<any>).issues.map((e: any) => e.message)
        }
      }
    }
    return {
      success: false,
      errors: { file: ['Template file validation error occurred'] }
    }
  }
}

/**
 * Validate imported products array
 * @param products - Array of products to validate
 * @returns Validation result with success/error status
 */
export const validateImportedProducts = (products: any[]) => {
  try {
    console.log('Validating products with schema:', products.length, 'products')
    ImportedProductsArraySchema.parse(products)
    return { success: true, errors: {} }
  } catch (error) {
    console.error('Validation error caught:', error)
    
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      console.log('Zod error issues:', (error as z.ZodError<any>).issues)
      
      ;(error as z.ZodError<any>).issues.forEach((err: any) => {
        const field = err.path.join('.')
        console.log(`Error for field ${field}:`, err.message)
        
        if (!errors[field]) {
          errors[field] = []
        }
        errors[field].push(err.message)
      })
      
      console.log('Processed errors object:', errors)
      return { success: false, errors }
    }
    
    console.error('Non-Zod error:', error)
    return { 
      success: false, 
      errors: { general: ['Validation error occurred'] } 
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
export const getImportError = (errors: Record<string, string[]>, fieldName: string): string | null => {
  return errors[fieldName]?.[0] || null
}



/**
 * Check if field has error
 * @param errors - Error object
 * @param fieldName - Field name to check
 * @returns Boolean indicating if field has error
 */
export const hasImportError = (errors: Record<string, string[]>, fieldName: string): boolean => {
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
 * Parse suppliers from various formats
 * @param supplier - Supplier data (string, array, or comma-separated)
 * @returns Array of supplier strings
 */
export const parseSuppliers = (supplier: any): string[] => {
  if (!supplier) return ['Default Supplier']
  
  if (Array.isArray(supplier)) {
    return supplier
  }
  
  return supplier.split(',').map((s: string) => s.trim()).filter(Boolean)
} 