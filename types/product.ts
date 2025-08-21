export interface Product {
  mainimage: string
  productSku: string
  name: string
  description: string
  category: string
  fulfillmentTime: string
  priceHistory: Array<{ oldCost: string; effectiveDate: string }>
  supplier: string[]
  productStatus: string
}

export interface ProductFormData {
  productSku: string
  name: string
  description: string
  category: string
  supplier: string[]
  productStatus: string
  fulfillmentTime: string
  priceHistory: Array<{ oldCost: string; effectiveDate: string }>
  productImage?: string
  uploadedImage?: File
}

export type StockFilter = 'in' | 'out' | null 