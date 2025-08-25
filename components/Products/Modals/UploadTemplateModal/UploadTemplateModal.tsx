import React, { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useDropzone } from 'react-dropzone'
import { Product } from '@/types/product'
import { useToast } from '@/components/Shared/ToastProvider'

interface UploadTemplateModalProps {
  isVisible: boolean
  product: Product
  onClose: () => void
  onUpload: (updatedProduct: Product) => void
}

const UploadTemplateModal: React.FC<UploadTemplateModalProps> = ({
  isVisible,
  product,
  onClose,
  onUpload
}) => {
  const { showToast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  // Convert file to image function
  const convertFileToImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }
      
      canvas.width = 800
      canvas.height = 600
      
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#333'
      ctx.font = '24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`File: ${file.name}`, canvas.width / 2, canvas.height / 2 - 20)
      
      ctx.font = '16px Arial'
      ctx.fillText(`Type: ${file.type}`, canvas.width / 2, canvas.height / 2 + 10)
      ctx.fillText(`Size: ${(file.size / 1024).toFixed(1)} KB`, canvas.width / 2, canvas.height / 2 + 30)
      
      ctx.font = '48px Arial'
      if (file.type === 'application/pdf') {
        ctx.fillText('📄', canvas.width / 2, canvas.height / 2 + 80)
      } else if (file.type === 'image/vnd.adobe.photoshop') {
        ctx.fillText('🎨', canvas.width / 2, canvas.height / 2 + 80)
      } else if (file.type === 'application/postscript') {
        ctx.fillText('📐', canvas.width / 2, canvas.height / 2 + 80)
      } else {
        ctx.fillText('📁', canvas.width / 2, canvas.height / 2 + 80)
      }
      
      const base64 = canvas.toDataURL('image/png')
      resolve(base64)
    })
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Validate files
    const validFiles = acceptedFiles.filter(file => {
      const isValidType = [
        'image/vnd.adobe.photoshop', // PSD
        'application/postscript',    // AI
        'image/png',                 // PNG
        'image/jpeg',                // JPEG
        'image/jpg',                 // JPG
        'application/pdf'            // PDF
      ].includes(file.type)
      
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB per file
      
      return isValidType && isValidSize
    })

    if (validFiles.length === 0) {
      showToast('No valid template files found. Please select PSD, AI, PNG, JPG, or PDF files under 5MB each.', 'error')
      return
    }

    // Check total file size
    const totalSize = validFiles.reduce((sum, file) => sum + file.size, 0)
    const maxTotalSize = 5 * 1024 * 1024 // 5MB total
    if (totalSize > maxTotalSize) {
      showToast('Total file size exceeds 5MB limit. Please select smaller files.', 'error')
      return
    }

    setUploadedFiles(validFiles)
    showToast(`${validFiles.length} file(s) selected successfully!`, 'success')
  }, [showToast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/vnd.adobe.photoshop': ['.psd'],
      'application/postscript': ['.ai'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    multiple: true
  })

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      showToast('Please select files to upload', 'warning')
      return
    }

    setIsUploading(true)

    try {
      const newTemplates: string[] = []
      
      for (const file of uploadedFiles) {
        try {
          let convertedBase64: string
          
          if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
            convertedBase64 = await new Promise<string>((resolve) => {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.readAsDataURL(file)
            })
          } else {
            convertedBase64 = await convertFileToImage(file)
          }
          
          newTemplates.push(convertedBase64)
        } catch (error) {
          console.error('Error processing file:', file.name, error)
          showToast(`Failed to process ${file.name}. Skipping...`, 'warning')
        }
      }

      if (newTemplates.length > 0) {
        const updatedProduct = {
          ...product,
          productTemplate: [...(product.productTemplate || []), ...newTemplates]
        }
        
        onUpload(updatedProduct)
        showToast(`${newTemplates.length} template(s) uploaded successfully!`, 'success')
        onClose()
      }
    } catch (error) {
      console.error('Upload error:', error)
      showToast('Failed to upload templates. Please try again.', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setUploadedFiles([])
    onClose()
  }

  if (!isVisible) return null

  return createPortal(
    <div className="modal is-active" style={{ zIndex: 10000 }}>
      <div className="modal-background" onClick={handleClose}></div>
      <div className="modal-card" style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
        <header className="modal-card-head">
          <p className="modal-card-title is-size-7">Upload Template Files</p>
          <button 
            className="delete is-size-7" 
            onClick={handleClose}
            aria-label="close"
          ></button>
        </header>
        
        <section className="modal-card-body">
          <div className="content is-size-7">
            <div className="mb-4">
              <h4 className="title is-5 is-size-7">Product: {product.name}</h4>
              <p className="has-text-grey-light is-size-7">
                Current templates: {product.productTemplate?.length || 0}
              </p>
            </div>

            {/* Dropzone */}
            <div 
              {...getRootProps()} 
              className={`box has-text-centered p-6 ${isDragActive ? 'has-background-primary-light' : 'has-background-light'}`}
              style={{ 
                border: '2px dashed #dbdbdb',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <input {...getInputProps()} />
              <span className="icon is-large has-text-grey-light mb-3">
                <i className="material-icons is-size-1">cloud_upload</i>
              </span>
              <p className="is-size-7 mb-2">
                {isDragActive 
                  ? 'Drop the files here...' 
                  : 'Drag & drop template files here, or click to select'
                }
              </p>
              <p className="has-text-grey-light is-size-7">
                Supported formats: PSD, AI, PNG, JPG, PDF (max 5MB each)
              </p>
            </div>

            {/* File List */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h5 className="title is-6 is-size-7">Selected Files:</h5>
                <div className="box">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="is-flex is-justify-content-space-between is-align-items-center mb-2">
                      <div>
                        <p className="is-size-7 has-text-weight-semibold">{file.name}</p>
                        <p className="has-text-grey-light is-size-7">
                          {file.type} • {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button 
                        className="button is-small is-danger is-size-7"
                        onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== index))}
                      >
                        <span className="icon is-small">
                          <i className="material-icons is-size-7">delete</i>
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        
        <footer className="modal-card-foot">
          <button 
            className="button is-primary is-size-7"
            onClick={handleUpload}
            disabled={isUploading || uploadedFiles.length === 0}
          >
            {isUploading ? (
              <>
                <span className="icon is-small">
                  <i className="material-icons is-size-7">hourglass_empty</i>
                </span>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <span className="icon is-small">
                  <i className="material-icons is-size-7">upload</i>
                </span>
                <span>Upload Templates</span>
              </>
            )}
          </button>
          <button 
            className="button is-size-7" 
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </button>
        </footer>
      </div>
    </div>,
    document.body
  )
}

export default UploadTemplateModal 