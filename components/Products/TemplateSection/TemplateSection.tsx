import React, { useState } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { Product } from '@/types/product'
import UploadTemplateModal from '@/components/Products/Modals/UploadTemplateModal'

interface TemplateSectionProps {
  product: Product
  onUploadTemplate: (updatedProduct: Product) => void
}

const TemplateSection: React.FC<TemplateSectionProps> = ({ product, onUploadTemplate }) => {
  const [previewTemplate, setPreviewTemplate] = useState<{ 
    src: string; 
    index: number; 
    x: number; 
    y: number 
  } | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true)
  }

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false)
  }

  return (
    <div className="content is-size-7">
      <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
        <h4 className="title is-4 is-size-7">
          Templates 
          <span className="has-text-grey-light ml-2 is-size-7">
            ({product.productTemplate?.length || 0} total)
          </span>
        </h4>
        <button 
          className="button is-primary is-small is-size-7"
          onClick={handleOpenUploadModal}
        >
          <span className="icon is-small">
            <i className="material-icons is-size-7">upload_file</i>
          </span>
          <span>Upload Template</span>
        </button>
      </div>
      
      <div className="mt-4">
        {product.productTemplate && product.productTemplate.length > 0 ? (
          <div className="box p-4 has-background-light" style={{ overflow: 'visible' }}>
            <div className="is-flex is-flex-wrap-nowrap is-overflow-x-auto templates-scroll" style={{ overflow: 'visible' }}>
              {product.productTemplate.map((template, index) => (
                <div key={index} className="box mr-3 mb-0 is-flex-shrink-0" style={{ minWidth: '120px', padding: '0.5rem' }}>
                  <div className="is-flex is-flex-direction-column is-align-items-center" style={{ width: '100%' }}>
                    <figure className="image is-96x96 mb-2" style={{ width: '100%', height: '96px' }}>
                      <div 
                        className="has-shadow has-radius"
                        style={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          cursor: 'pointer',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect()
                          const previewData = {
                            src: template || '/images/glass1.png',
                            index,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 10
                          }
                          setPreviewTemplate(previewData)
                        }}
                        onMouseLeave={() => {
                          setPreviewTemplate(null)
                        }}
                      >
                        <Image
                          src={template || '/images/glass1.png'}
                          alt={`Template ${index + 1}`}
                          width={96}
                          height={96}
                          style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                            borderRadius: '6px',
                            display: 'block'
                          }}
                        />
                      </div>
                    </figure>
                  </div>
                </div>
              ))}
            </div>
            <div className="has-text-centered mt-3">
              <p className="has-text-grey-light is-size-7">
                {product.productTemplate.length} template(s) available • Scroll to view all
              </p>
            </div>
          </div>
        ) : (
          <div className="has-text-centered p-6">

            <p className="has-text-grey-light is-size-7 mb-3">No templates available</p>
            <button 
              className="button is-primary is-small is-size-7"
              onClick={handleOpenUploadModal}
            >
              <span className="icon is-small">
                <i className="material-icons is-size-7">upload_file</i>
              </span>
              <span>Upload Template</span>
            </button>
          </div>
        )}
      </div>

      {/* Template Preview Portal */}
      {previewTemplate && typeof window !== 'undefined' && (() => {
        return createPortal(
          <div
            style={{
              position: 'fixed',
              top: previewTemplate.y - 200,
              left: previewTemplate.x - 100,
              width: '200px',
              height: '200px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 99999,
              padding: '8px',
              pointerEvents: 'none'
            }}
          >
            <Image
              src={previewTemplate.src}
              alt={`Template ${previewTemplate.index + 1} Preview`}
              width={200}
              height={200}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                borderRadius: '4px'
              }}
            />
            <div 
              style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '10px solid white'
              }}
            />
          </div>,
          document.body
        )
      })()}

      {/* Upload Template Modal */}
      <UploadTemplateModal
        isVisible={isUploadModalOpen}
        product={product}
        onClose={handleCloseUploadModal}
        onUpload={onUploadTemplate}
      />
    </div>
  )
}

export default TemplateSection 