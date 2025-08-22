import { z } from 'zod'

// Validation schema for supplier name
export const SupplierNameSchema = z
  .string()
  .min(1, 'Supplier name is required')
  .min(2, 'Supplier name must be at least 2 characters')
  .max(100, 'Supplier name must be less than 100 characters')
  .regex(/^[a-zA-Z0-9\s\-_&.()]+$/, 'Supplier name can only contain letters, numbers, spaces, hyphens, underscores, ampersands, dots, and parentheses')
  .trim()

// Validation schema for country
export const CountrySchema = z
  .string()
  .min(1, 'Country is required')
  .min(2, 'Country must be at least 2 characters')
  .max(50, 'Country must be less than 50 characters')
  .regex(/^[a-zA-Z\s\-()]+$/, 'Country can only contain letters, spaces, hyphens, and parentheses')
  .trim()

// Validation schema for supplier
export const SupplierSchema = z.object({
  name: SupplierNameSchema,
  country: CountrySchema
})

// Validation schema for adding supplier
export const AddSupplierSchema = z.object({
  name: SupplierNameSchema,
  country: CountrySchema
})

// Validation schema for updating supplier
export const UpdateSupplierSchema = z.object({
  index: z.number().min(0, 'Invalid index'),
  name: SupplierNameSchema,
  country: CountrySchema
})

// Validation schema for deleting supplier
export const DeleteSupplierSchema = z.object({
  index: z.number().min(0, 'Invalid index')
})

// Type exports
export type SupplierName = z.infer<typeof SupplierNameSchema>
export type Country = z.infer<typeof CountrySchema>
export type Supplier = z.infer<typeof SupplierSchema>
export type AddSupplier = z.infer<typeof AddSupplierSchema>
export type UpdateSupplier = z.infer<typeof UpdateSupplierSchema>
export type DeleteSupplier = z.infer<typeof DeleteSupplierSchema>

// Validation functions
export const validateSupplierName = (name: string) => {
  try {
    SupplierNameSchema.parse(name)
    return { isValid: true, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0].message }
    }
    return { isValid: false, error: 'Invalid supplier name' }
  }
}

export const validateCountry = (country: string) => {
  try {
    CountrySchema.parse(country)
    return { isValid: true, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0].message }
    }
    return { isValid: false, error: 'Invalid country' }
  }
}

export const validateSupplier = (supplier: { name: string; country: string }) => {
  try {
    SupplierSchema.parse(supplier)
    return { isValid: true, error: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.issues[0].message }
    }
    return { isValid: false, error: 'Invalid supplier data' }
  }
}

export const validateAddSupplier = (name: string, country: string) => {
    try {
        AddSupplierSchema.parse({ name, country })
        return { isValid: true, error: null }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { isValid: false, error: error.issues[0].message }
        }
        return { isValid: false, error: 'Invalid supplier data' }
    }
}

export const validateDeleteSupplier = (index: number) => {
    try {
        DeleteSupplierSchema.parse({ index })
        return { isValid: true, error: null }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { isValid: false, error: error.issues[0].message }
        }
        return { isValid: false, error: 'Invalid supplier data' }
    }
}

export const validateUpdateSupplier = (index: number, name: string, country: string) => {
    try {
        UpdateSupplierSchema.parse({ index, name, country })
        return { isValid: true, error: null }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { isValid: false, error: error.issues[0].message }
        }
        return { isValid: false, error: 'Invalid supplier data' }
    }
}