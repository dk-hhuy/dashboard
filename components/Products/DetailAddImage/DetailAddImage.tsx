import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Product } from '@/types/product'
import { z } from 'zod'
import { validateImageFile } from '@/schemas/importSchema'

interface DetailAddImageProps {
  product: Product
  onUpload: (product: Product) => void
  onClose: () => void
}

const DetailAddImage = ({ product, onUpload, onClose }: DetailAddImageProps) => {
    const [currentProduct, setCurrentProduct] = useState<Product>(product)
    const [isLoading, setIsLoading] = useState(false)  
    const [errors, setErrors] = useState<Record<string, string[]>>({})

    // ============================================================================
    // DROPZONE HANDLER
    // ============================================================================

    // ============================================================================
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': [ '.png', '.jpg', 'jpeg', '.webp', '.gif', '.svg']
        },
        maxFiles: 10,
        onDrop: (acceptedFiles) => {
            const newImages = acceptedFiles.map((file) => {

                // Validate file trước khi xử lý
                const fileValidation = validateImageFile(file)
                if (!fileValidation.success) {
                    setErrors(fileValidation.errors as Record<string, string[]>)
                }
                const reader = new FileReader()
                reader.onload = () => {
                    const base64 = reader.result as string
                    return {
                        file, base64
                    }
                }
                reader.readAsDataURL(file)
            })

            // Ensure product.productImages is always an array
            const existingImages = Array.isArray(product.productImages) ? product.productImages : []
            const newProductImages = [...existingImages, ...newImages]
            const updatedProduct = {
                ...product,
                productImages: newProductImages
            }

            // Update the product state
            // Filter out any undefined or void values from newProductImages
            setCurrentProduct({
                ...updatedProduct,
                productImages: newProductImages.filter((img): img is string => typeof img === 'string')
            })
        }



    })

    

  return (
    <div>

    </div>
  )
}

export default DetailAddImage