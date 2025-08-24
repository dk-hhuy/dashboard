import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Product } from '@/types/product'
import { z } from 'zod'
import { validateImageFile } from '@/schemas/importSchema'
import { useToast } from '@/components/Shared'

interface DetailAddImageProps {
  product: Product
  onUpload: (product: Product) => void
  onClose: () => void
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert file to base64 string
 * @param file - File to convert
 * @returns Promise<string> - Base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Validate và xử lý images sau khi upload
 * @param files - Array files đã được accept
 * @param currentImages - Array images hiện tại của product
 * @param setErrors - Function set errors
 * @param setIsUploading - Function set uploading state
 * @param onUpload - Callback khi upload thành công
 * @param showToast - Toast notification function
 */
const validateAndUpload = async (
  files: File[],
  currentImages: string[],
  currentProduct: Product,
  setErrors: (errors: Record<string, string[]>) => void,
  setIsUploading: (uploading: boolean) => void,
  onUpload: (product: Product) => void,
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
) => {
  console.log(`Processing ${files.length} image files...`)
  
  try {
    const newImages: string[] = []
    const errors: Record<string, string[]> = {}
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log(`Processing image ${i + 1}/${files.length}: ${file.name}`)
      
      // Validate file
      const fileValidation = validateImageFile(file)
      if (!fileValidation.success) {
        console.error(`Image validation failed for ${file.name}:`, fileValidation.errors)
        errors[`image_${i}`] = fileValidation.errors.file || ['Invalid image file']
        continue
      }
      
      // Convert to base64
      try {
        const base64 = await fileToBase64(file)
        newImages.push(base64)
        console.log(`Successfully processed image ${i + 1}: ${file.name}`)
      } catch (error) {
        console.error(`Error converting image ${file.name} to base64:`, error)
        errors[`image_${i}`] = ['Failed to process image file']
      }
    }
    
    // Check if we have any errors
    if (Object.keys(errors).length > 0) {
      setErrors(errors)
      setIsUploading(false)
      showToast('Some images failed validation. Please check the errors below.', 'warning')
      return
    }
    
    // Check total image count limit
    const totalImages = currentImages.length + newImages.length
    if (totalImages > 10) {
      setErrors({ 
        general: [`Maximum 10 images allowed. You have ${currentImages.length} existing images and trying to add ${newImages.length} more.`] 
      })
      setIsUploading(false)
      showToast(`Maximum 10 images allowed. Please remove some existing images first.`, 'warning')
      return
    }
    
    // Success - update product
    const updatedProduct = {
      ...currentProduct,
      productImages: [...currentImages, ...newImages]
    }
    
    setIsUploading(false)
    onUpload(updatedProduct)
    
  } catch (error) {
    console.error('Image processing error:', error)
    setErrors({ general: ['An unexpected error occurred while processing images.'] })
    setIsUploading(false)
    showToast('Error processing images. Please try again.', 'error')
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DetailAddImage = ({ product, onUpload, onClose }: DetailAddImageProps) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [currentProduct, setCurrentProduct] = useState<Product>(product)
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const { showToast } = useToast()

  // Sync currentProduct with product prop when it changes, but only if no unsaved changes
  useEffect(() => {
    if (!hasUnsavedChanges) {
      setCurrentProduct(product)
    }
  }, [product, hasUnsavedChanges])

  // ============================================================================
  // FILE DROP HANDLER
  // ============================================================================
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('=== IMAGE DROP DETECTED ===')
    console.log('Accepted files:', acceptedFiles.map(f => f.name))
    
    setIsUploading(true)
    setErrors({})
    
    // Ensure product.productImages is always an array
    const existingImages = Array.isArray(currentProduct.productImages) ? currentProduct.productImages : []
    
    validateAndUpload(
      acceptedFiles,
      existingImages,
      currentProduct,
      setErrors,
      setIsUploading,
      (updatedProduct: Product) => {
        setCurrentProduct(updatedProduct)
        setHasUnsavedChanges(true)
        showToast(`Successfully added ${acceptedFiles.length} image(s). Click "Save Changes" to apply.`, 'success')
      },
      showToast
    )
  }, [currentProduct, onUpload, showToast])

  // ============================================================================
  // DROPZONE CONFIGURATION
  // ============================================================================
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']
    },
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024, // 5MB per file
    multiple: true
  })

  // ============================================================================
  // RENDER METHODS
  // ============================================================================
  
  /**
   * Render header với title và close button
   */
  const renderHeader = () => (
    <div className="level is-size-7">
      <div className="level-left">
        <div className="level-item">
          <h4 className="title is-4 mb-0 is-size-6">
            Add Images to Product
            {hasUnsavedChanges && (
              <span className="tag is-warning is-light ml-2 is-size-7">
                <span className="icon is-small">
                  <i className="material-icons is-size-7">warning</i>
                </span>
                <span>Unsaved Changes</span>
              </span>
            )}
          </h4>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">
          <button 
            className={`button is-small is-size-7 mr-2 ${hasUnsavedChanges ? 'is-success' : 'is-success is-light'}`}
            onClick={handleSaveChanges}
            disabled={!hasUnsavedChanges}
          >
            <span className="icon is-small">
              <i className="material-icons is-size-7">save</i>
            </span>
            <span>Save Changes</span>
          </button>
          <button 
            className="button is-small is-danger is-light is-size-7"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )

  /**
   * Render dropzone area
   */
  const renderDropzone = () => (
    <div 
      {...getRootProps()} 
      className={`dropzone ${isDragActive ? 'is-active' : ''} ${errors.file ? 'has-error' : ''}`}
      style={{
        border: `2px dashed ${errors.file ? '#ff3860' : '#ccc'}`,
        borderRadius: '4px',
        padding: '40px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa',
        marginTop: '20px',
        transition: 'all 0.3s ease'
      }}
    >
      <input {...getInputProps()} />
      
      {/* Upload Icon */}
      <div className="icon is-large mb-3">
        <i className="material-icons is-size-7" style={{ fontSize: '48px', color: '#666' }}>
          {isDragActive ? 'cloud_upload' : 'add_photo_alternate'}
        </i>
      </div>
      
      {/* Dropzone Text */}
      <p className="is-size-7 mb-2">
        {isDragActive 
          ? 'Drop the images here...' 
          : 'Drag & drop images here, or click to select'
        }
      </p>
      
      {/* Supported Formats */}
      <p className="is-size-7 has-text-grey-light">
        Supported formats: PNG, JPG, JPEG, WebP, GIF, SVG (Max 5MB per file)
      </p>
      
      {/* Current Image Count */}
      <p className="is-size-7 has-text-info mt-2">
        Current images: {Array.isArray(currentProduct.productImages) ? currentProduct.productImages.length : 0}/10
      </p>
      
      {/* Error Display */}
      {errors.file && (
        <p className="help is-danger is-size-7 mt-2">
          {errors.file.join(', ')}
        </p>
      )}
      
      {errors.general && (
        <p className="help is-danger is-size-7 mt-2">
          {errors.general.join(', ')}
        </p>
      )}
    </div>
  )

  /**
   * Handle delete image
   */
  const handleDeleteImage = (indexToDelete: number) => {
    console.log('Deleting image at index:', indexToDelete)
    console.log('Current images before delete:', currentProduct.productImages)
    
    const images = Array.isArray(currentProduct.productImages) ? currentProduct.productImages : []
    const updatedImages = images.filter((_, index) => index !== indexToDelete)
    
    console.log('Updated images after delete:', updatedImages)
    
    const updatedProduct = {
      ...currentProduct,
      productImages: updatedImages
    }
    
    setCurrentProduct(updatedProduct)
    setHasUnsavedChanges(true)
    showToast(`Image ${indexToDelete + 1} deleted successfully!`, 'success')
  }

  /**
   * Handle save changes
   */
  const handleSaveChanges = () => {
    onUpload(currentProduct)
    setHasUnsavedChanges(false)
    showToast('Changes saved successfully!', 'success')
  }

  /**
   * Handle close modal
   */
  const handleClose = () => {
    // Reset state when closing
    setCurrentProduct(product)
    setHasUnsavedChanges(false)
    setErrors({})
    onClose()
  }

  /**
   * Render current images preview
   */
  const renderCurrentImages = () => {
    const images = Array.isArray(currentProduct.productImages) ? currentProduct.productImages : []
    console.log('Rendering current images:', images)
    console.log('Current product state:', currentProduct)
    
    if (images.length === 0) {
      return (
        <div className="content is-size-7 mt-4">
          <p className="has-text-grey-light">No images added yet.</p>
        </div>
      )
    }
    
    return (
      <div className="content is-size-7 mt-4">
        <h5 className="title is-5 is-size-7">Current Images ({images.length}/10):</h5>
        <div className="columns is-multiline is-mobile">
          {images.map((image, index) => (
            <div key={index} className="column is-2-desktop is-3-tablet is-4-mobile">
              <div 
                className="box p-2 position-relative"
                style={{ 
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  const overlay = e.currentTarget.querySelector('.image-overlay') as HTMLElement
                  if (overlay) {
                    overlay.style.opacity = '1'
                  }
                }}
                onMouseLeave={(e) => {
                  const overlay = e.currentTarget.querySelector('.image-overlay') as HTMLElement
                  if (overlay) {
                    overlay.style.opacity = '0'
                  }
                }}
              >
                {/* Image */}
                <img 
                  src={image} 
                  alt={`Product image ${index + 1}`}
                  style={{ 
                    width: '100%', 
                    height: '80px', 
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />

                {/* Overlay Modal with Delete Button */}
                <div
                  className="image-overlay"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    right: '8px',
                    bottom: '8px', // Cover the entire box including text
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteImage(index)
                  }}
                >
                  <i 
                    className="material-icons is-size-7"
                    style={{
                      fontSize: '24px',
                      color: '#ff3860',
                      cursor: 'pointer',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                    title="Delete image"
                  >
                    close
                  </i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /**
   * Render documentation section
   */
  const renderDocumentation = () => (
    <div className="content is-size-7 mt-4">
      {/* Image Requirements */}
      <h5 className="title is-5 is-size-7">Image Requirements:</h5>
      <ul className="is-size-7">
        <li><strong>Format:</strong> PNG, JPG, JPEG, WebP, GIF, SVG</li>
        <li><strong>Size:</strong> Maximum 5MB per image</li>
        <li><strong>Count:</strong> Maximum 10 images per product</li>
        <li><strong>Quality:</strong> High resolution recommended for better display</li>
      </ul>
      
      {/* Tips */}
      <h5 className="title is-5 is-size-7">Tips:</h5>
      <ul className="is-size-7">
        <li>First image will be used as the main product image</li>
        <li>Use square or 4:3 aspect ratio for best display</li>
        <li>Ensure good lighting and clear product visibility</li>
        <li>Remove background for professional look</li>
      </ul>
    </div>
  )

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="card is-size-7">
      <div className="card-content">
        {renderHeader()}
        {renderDropzone()}
        {renderCurrentImages()}
        {renderDocumentation()}
        
        {/* Loading State */}
        {isUploading && (
          <div className="has-text-centered mt-4">
            <div className="icon is-large">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
            <p className="is-size-7 mt-2">Processing images...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailAddImage