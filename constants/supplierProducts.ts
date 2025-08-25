import { SupplierProduct } from '@/types/product'

// Supplier Products Data
// Mỗi sản phẩm có thể có nhiều supplier với thông tin chi tiết khác nhau
export const supplierProducts: { [productSku: string]: SupplierProduct[] } = {
  "SFGTWH": [
    {
      supplierId: "SUP001",
      supplierName: "GlassCraft Inc",
      supplierSku: "GC-SFGTWH-001",
      price: 12.99,
      quality: "Premium"
    },
    {
      supplierId: "SUP002", 
      supplierName: "Premium Supplies",
      supplierSku: "PS-SFGTWH-002",
      price: 15.99,
      quality: "Premium"
    },
    {
      supplierId: "SUP003",
      supplierName: "Budget Glass Co",
      supplierSku: "BG-SFGTWH-003", 
      price: 8.99,
      quality: "Economy"
    }
  ],
  "URTWH": [
    {
      supplierId: "SUP004",
      supplierName: "SparkleCraft",
      supplierSku: "SC-URTWH-001",
      price: 18.99,
      quality: "Premium"
    },
    {
      supplierId: "SUP005",
      supplierName: "Luxury Items",
      supplierSku: "LI-URTWH-002",
      price: 22.99,
      quality: "Premium"
    }
  ],
  "UTMWH": [
    {
      supplierId: "SUP006",
      supplierName: "Travel Gear Pro",
      supplierSku: "TGP-UTMWH-001",
      price: 14.99,
      quality: "Standard"
    },
    {
      supplierId: "SUP007",
      supplierName: "Budget Travel",
      supplierSku: "BT-UTMWH-002",
      price: 9.99,
      quality: "Economy"
    }
  ]
}

 