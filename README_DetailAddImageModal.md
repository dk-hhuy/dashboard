# DetailAddImageModal Component

## Tổng quan

`DetailAddImageModal` là một modal component được thiết kế để thêm hình ảnh vào sản phẩm, tương tự như `ImportProductModal` nhưng tập trung vào việc upload hình ảnh.

## Tính năng

- **Drag & Drop**: Hỗ trợ kéo thả hình ảnh vào dropzone
- **Multiple Upload**: Có thể upload nhiều hình ảnh cùng lúc (tối đa 10 hình)
- **Validation**: Kiểm tra định dạng và kích thước file
- **Preview**: Hiển thị hình ảnh hiện tại của sản phẩm
- **Toast Notifications**: Thông báo kết quả upload
- **Responsive Design**: Giao diện responsive với Bulma CSS

## Cấu trúc Files

```
components/Products/
├── DetailAddImage/
│   ├── DetailAddImage.tsx          # Main component
│   └── index.ts                    # Export
├── Modals/
│   ├── DetailAddImageModal/
│   │   ├── DetailAddImageModal.tsx # Modal wrapper
│   │   └── index.ts                # Export
│   └── index.ts                    # Modal exports
└── index.ts                        # Main exports
```

## Cách sử dụng

### 1. Import Component

```tsx
import { DetailAddImageModal } from '@/components/Products'
```

### 2. Sử dụng trong Component

```tsx
import React, { useState } from 'react'
import { DetailAddImageModal } from '@/components/Products'
import { Product } from '@/types/product'

const MyComponent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product>({
    mainimage: '/images/default.png',
    productSku: 'PRODUCT-001',
    name: 'Product Name',
    description: 'Product Description',
    category: 'Category',
    fulfillmentTime: '1-2 days',
    priceHistory: [{ oldCost: '10.00', effectiveDate: '2024-01-01' }],
    supplier: ['Supplier'],
    productStatus: 'In Stock',
    productImages: []
  })

  const handleOpenModal = () => setIsModalVisible(true)
  const handleCloseModal = () => setIsModalVisible(false)
  
  const handleUploadImages = (updatedProduct: Product) => {
    console.log('Product updated:', updatedProduct)
    setCurrentProduct(updatedProduct)
    setIsModalVisible(false)
  }

  return (
    <div>
      <button onClick={handleOpenModal}>
        Add Images
      </button>

      <DetailAddImageModal
        isVisible={isModalVisible}
        product={currentProduct}
        onClose={handleCloseModal}
        onUpload={handleUploadImages}
      />
    </div>
  )
}
```

## Props

### DetailAddImageModal Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isVisible` | `boolean` | ✅ | Hiển thị/ẩn modal |
| `product` | `Product` | ✅ | Sản phẩm cần thêm hình ảnh |
| `onClose` | `() => void` | ✅ | Callback khi đóng modal |
| `onUpload` | `(product: Product) => void` | ✅ | Callback khi upload thành công |

### DetailAddImage Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `product` | `Product` | ✅ | Sản phẩm cần thêm hình ảnh |
| `onUpload` | `(product: Product) => void` | ✅ | Callback khi upload thành công |
| `onClose` | `() => void` | ✅ | Callback khi đóng |

## Yêu cầu hình ảnh

- **Định dạng**: PNG, JPG, JPEG, WebP, GIF, SVG
- **Kích thước**: Tối đa 5MB per file
- **Số lượng**: Tối đa 10 hình ảnh per sản phẩm
- **Chất lượng**: Khuyến nghị độ phân giải cao

## Validation

Component tự động validate:
- Định dạng file
- Kích thước file
- Số lượng hình ảnh
- Tính hợp lệ của file

## Error Handling

- Hiển thị lỗi validation trong dropzone
- Toast notifications cho các lỗi
- Graceful handling của các lỗi không mong muốn

## Styling

Component sử dụng:
- **Bulma CSS Framework** cho styling
- **Material Icons** cho icons
- **Custom CSS** cho dropzone và animations

## Dependencies

```json
{
  "react-dropzone": "^14.2.3",
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

## Ví dụ hoàn chỉnh

Xem file `test_detail_add_image_modal.tsx` để có ví dụ hoàn chỉnh về cách sử dụng component.

## Lưu ý

1. Component cần `useToast` hook từ `@/components/Shared`
2. Cần có `validateImageFile` function từ `@/schemas/importSchema`
3. Product type phải có `productImages` field (optional string array)
4. Modal sử dụng React Portal để render vào document.body 