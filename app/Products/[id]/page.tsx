'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Dialog, Tab } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/Shared/NavBar'
import ProtectedRoute from '@/components/Shared/ProtectedRoute'
import TemplateSection from '@/components/Products/TemplateSection'
import VideoSection from '@/components/Products/VideoSection'
import SupplierSection from '@/components/Products/SupplierSection'
import { products } from '@/constants/index_product'
import { Product } from '@/types/product'
import { useToast } from '@/components/Shared/ToastProvider'
import { DetailAddImageModal } from '@/components/Products'


const ProductDetail = () => {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [templateUpdateKey, setTemplateUpdateKey] = useState(0)

  
  // Use product images or fallback to main image
  const productImages = useMemo(() => {
    if (!product) return ['/images/glass1.png']
    
    const images = product.productImages || [product.mainimage || '/images/glass1.png']
    // Filter out empty strings and undefined values
    const filteredImages = images.filter(img => img && img.trim() !== '')
    
    // Ensure we always have at least one image
    return filteredImages.length > 0 ? filteredImages : ['/images/glass1.png']
  }, [product])
  
  // Reset currentImageIndex when productImages changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [productImages])
  
  // Ensure currentImageIndex is within bounds
  const safeImageIndex = Math.max(0, Math.min(currentImageIndex, productImages.length - 1))
  
  const [direction, setDirection] = useState(0)

  const handleBackImage = () => {
    setDirection(-1)
    setCurrentImageIndex(prev => Math.max(0, prev - 1))
  }

  const handleForwardImage = () => {
    setDirection(1)
    setCurrentImageIndex(prev => Math.min(productImages.length - 1, prev + 1))
  }

  const loadProduct = useCallback((productSku: string) => {
    console.log('🔍 Loading product:', productSku)
    
    // Always try localStorage first
    let allProducts = products
    let dataSource = 'constants'
    
    try {
      const storedProducts = localStorage.getItem('productsData')
      if (storedProducts) {
        allProducts = JSON.parse(storedProducts)
        dataSource = 'localStorage'
        console.log('📦 Loaded from localStorage:', allProducts.length, 'products')
      } else {
        console.log('📦 No localStorage data, using constants')
      }
    } catch (error) {
      console.warn('Failed to load products from localStorage:', error)
    }
    
    const foundProduct = allProducts.find(p => p.productSku === productSku)
    console.log('🔍 Found product:', foundProduct ? {
      sku: foundProduct.productSku,
      name: foundProduct.name,
      mainimage: foundProduct.mainimage,
      productImages: foundProduct.productImages?.length || 0,
      dataSource: dataSource
    } : 'NOT FOUND')
    
    if (foundProduct) {
      // If data is from localStorage, use it directly (no auto-fix)
      if (dataSource === 'localStorage') {
        console.log('✅ Using product from localStorage (no auto-fix)')
        setProduct(foundProduct)
      } else {
        // Data is from constants, apply auto-fix if needed
        console.log('🔧 Data from constants, checking for auto-fix')
        const originalProduct = products.find(p => p.productSku === productSku)
        let needsUpdate = false
        let updatedProduct = { ...foundProduct }
        
        if (originalProduct) {
          // Check for missing productImages field
          if (!foundProduct.hasOwnProperty('productImages')) {
            updatedProduct.productImages = originalProduct.productImages || []
            needsUpdate = true
            console.log('🔧 Auto-fix: Added missing productImages')
          }
          
          // Check for missing productTemplate field
          if (!foundProduct.hasOwnProperty('productTemplate')) {
            updatedProduct.productTemplate = originalProduct.productTemplate || []
            needsUpdate = true
            console.log('🔧 Auto-fix: Added missing productTemplate')
          }
          
          // Check for missing productVideos field
          if (!foundProduct.hasOwnProperty('productVideos')) {
            updatedProduct.productVideos = originalProduct.productVideos || []
            needsUpdate = true
            console.log('🔧 Auto-fix: Added missing productVideos')
          }
        }
        
        if (needsUpdate) {
          console.log('🔧 Applying auto-fix and updating localStorage')
          setProduct(updatedProduct)
          
          // Update localStorage with the corrected data
          try {
            const updatedProducts = allProducts.map((p: Product) => 
              p.productSku === productSku ? updatedProduct : p
            )
            localStorage.setItem('productsData', JSON.stringify(updatedProducts))
            console.log('💾 Updated localStorage with auto-fixed data')
          } catch (error) {
            console.warn('Failed to update localStorage:', error)
          }
        } else {
          console.log('✅ Using product from constants (no auto-fix needed)')
          setProduct(foundProduct)
        }
      }
      setIsLoading(false)
    } else {
      showToast(`Product ${productSku} not found!`, 'error')
      router.push('/Products')
    }
  }, [router, showToast])

  // Handle add image modal
  const handleOpenAddImageModal = () => {
    setIsAddImageModalOpen(true)
  }

  const handleCloseAddImageModal = () => {
    setIsAddImageModalOpen(false)
  }

  const handleUploadImages = (updatedProduct: Product) => {
    console.log('🖼️ handleUploadImages called with:', updatedProduct)
    
    // Update local state
    setProduct(updatedProduct)
    
    // Update localStorage
    try {
      const storedProducts = localStorage.getItem('productsData')
      if (storedProducts) {
        const allProducts = JSON.parse(storedProducts)
        const updatedProducts = allProducts.map((p: Product) => 
          p.productSku === updatedProduct.productSku ? updatedProduct : p
        )
        localStorage.setItem('productsData', JSON.stringify(updatedProducts))
        console.log('💾 Updated localStorage with new product data')
        
        // Signal that data has been updated
        try {
          sessionStorage.setItem('productUpdated', Date.now().toString())
          console.log('💾 Set sessionStorage signal for Products page')
        } catch (error) {
          console.warn('Failed to set sessionStorage signal:', error)
        }
      }
    } catch (error) {
      console.warn('Failed to update localStorage:', error)
    }
    
    // Reset image index if needed
    if (updatedProduct.productImages && updatedProduct.productImages.length > 0) {
      setCurrentImageIndex(0)
    } else {
      setCurrentImageIndex(0)
    }
    
    showToast('Images updated successfully!', 'success')
    setIsAddImageModalOpen(false)
  }





    // Handle upload template
  const handleUploadTemplate = (updatedProduct: Product) => {
    // Update local state
    setProduct(updatedProduct)
    
    // Update localStorage
    try {
      const storedProducts = localStorage.getItem('productsData')
      if (storedProducts) {
        const allProducts = JSON.parse(storedProducts)
        const updatedProducts = allProducts.map((p: Product) => 
          p.productSku === updatedProduct.productSku ? updatedProduct : p
        )
        
        // Try to save to localStorage
        try {
          localStorage.setItem('productsData', JSON.stringify(updatedProducts))
        } catch (quotaError) {
          if (quotaError instanceof Error && quotaError.name === 'QuotaExceededError') {
            console.warn('localStorage quota exceeded, trying to clean up...')
            
            // Try to remove old templates to free up space
            const cleanedProduct = {
              ...updatedProduct,
              productTemplate: (updatedProduct.productTemplate || []).slice(-5) // Keep only last 5 templates
            }
            
            const cleanedProducts = allProducts.map((p: Product) => 
              p.productSku === updatedProduct.productSku ? cleanedProduct : p
            )
            
            try {
              localStorage.setItem('productsData', JSON.stringify(cleanedProducts))
              showToast('Storage limit reached. Only keeping last 5 templates.', 'warning')
            } catch (finalError) {
              console.error('Failed to save even after cleanup:', finalError)
              showToast('Storage limit exceeded. Please clear some templates first.', 'error')
            }
          } else {
            throw quotaError
          }
        }
      }
    } catch (error) {
      console.warn('Failed to update localStorage:', error)
      showToast('Failed to save templates. Please try again.', 'error')
    }
    
    // Force re-render TemplateSection component
    setTemplateUpdateKey(prev => prev + 1)
  }

  useEffect(() => {
    const productSku = params.id as string
    const timestamp = searchParams.get('t')
    console.log('🔄 Component mounted/URL changed, loading product:', productSku, 'timestamp:', timestamp)
    setIsLoading(true)
    
    // Force reload from localStorage when timestamp is present
    if (timestamp) {
      console.log('🔄 Timestamp detected, forcing fresh load from localStorage')
      // Clear any potential cache by getting fresh data
      try {
        const storedProducts = localStorage.getItem('productsData')
        if (storedProducts) {
          const allProducts = JSON.parse(storedProducts)
          const foundProduct = allProducts.find((p: Product) => p.productSku === productSku)
          if (foundProduct) {
            console.log('🔄 Found updated product in localStorage:', {
              sku: foundProduct.productSku,
              mainimage: foundProduct.mainimage,
              productImages: foundProduct.productImages?.length || 0
            })
            setProduct(foundProduct)
            setIsLoading(false)
            return
          }
        }
      } catch (error) {
        console.warn('Failed to force load from localStorage:', error)
      }
    }
    
    // Add a small delay to ensure localStorage is updated
    const delay = timestamp ? 100 : 0 // If timestamp exists, add delay
    setTimeout(() => {
      loadProduct(productSku)
    }, delay)
  }, [params.id, searchParams, loadProduct])

  // Listen for storage changes and window focus to update product data
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'productsData' && e.newValue) {
        const productSku = params.id as string
        loadProduct(productSku)
      }
    }

    const handleFocus = () => {
      const productSku = params.id as string
      loadProduct(productSku)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [params.id, loadProduct])

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="is-size-7" style={{ minHeight: '100vh', paddingTop: '6rem' }}>
          <NavBar />
          <div className="container">
            <div className="has-text-centered p-6">
              <div className="loader"></div>
              <p className="mt-4 is-size-7">Loading product details...</p>
            </div>
                  </div>
      </div>
      

    </ProtectedRoute>
  )
}

  if (!product) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="is-size-7" style={{ minHeight: '100vh', paddingTop: '5rem' }}>
        <NavBar />
        
        <div className="container" style={{ maxWidth: '70%' }}>
          <div className="card">
            <div className="card-content">
              <div className="is-flex is-justify-content-center">
                <div className="is-flex is-align-items-stretch" style={{ maxWidth: '900px' }}>
                  {/* Product Image */}
                  <div className="is-flex-shrink-0" style={{ marginRight: '4rem' }}>
                    <div className="is-flex is-flex-direction-column is-justify-content-center">
                      <div className="is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
                        <motion.button 
                          className="button is-small is-white is-size-7" 
                          style={{ border: 'none', background: 'transparent' }} 
                          disabled={safeImageIndex === 0} 
                          onClick={handleBackImage}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <span className="icon">
                            <i className="material-icons is-size-6">chevron_left</i>
                          </span>
                        </motion.button>
                      
                        <div className="has-text-centered is-flex is-flex-direction-column is-justify-content-center">
                          <figure className="image is-clickable" style={{ width: '300px', height: '300px', overflow: 'hidden' }} onClick={() => setIsImageModalOpen(true)}>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={currentImageIndex}
                                initial={{ x: direction * 350, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -direction * 350, opacity: 0 }}
                                transition={{ 
                                  type: "spring", 
                                  stiffness: 500, 
                                  damping: 25,
                                  duration: 0.15
                                }}
                                style={{ width: '100%', height: '100%' }}
                              >
                                <Image 
                                  src={productImages[safeImageIndex] || '/images/glass1.png'}
                                  alt={`${product?.name || 'Product'} - Image ${safeImageIndex + 1}`}
                                  width={300}
                                  height={300}
                                  className="has-shadow"
                                  style={{ 
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '12px'
                                  }}
                                />
                              </motion.div>
                            </AnimatePresence>
                          </figure>
                          <p className="help mt-2">Click to enlarge</p>
                          <p className="help is-size-7">{safeImageIndex + 1} / {productImages.length}</p>
                        </div>

                        <motion.button 
                          className="button is-small is-white is-size-7"
                          style={{ border: 'none', background: 'transparent' }}
                          onClick={handleForwardImage}
                          disabled={safeImageIndex === productImages.length - 1}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <span className="icon">
                            <i className="material-icons is-size-6">chevron_right</i>
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="content is-flex is-flex-direction-column is-justify-content-space-between is-align-items-flex-end" style={{ flex: 1 }}>
                    <div className="has-text-right" style={{ width: '100%' }}>
                      <h1 className="title is-2 is-size-7 mb-3">{product.name}</h1>
                      <p className="subtitle is-6 has-text-grey is-size-7 mb-4">SKU: {product.productSku}</p>
                      
                      <div className="tags mb-4 is-justify-content-flex-end">
                        <span className="tag is-info is-size-7">{product.category}</span>
                        <span className={`tag is-size-7 ${product.productStatus === 'In Stock' ? 'is-success' : 'is-danger'}`}>
                          {product.productStatus}
                        </span>
                      </div>

                      <p className="has-text-grey-dark mb-4 is-size-7">{product.description}</p>

                      <div className="has-text-right">
                        <div className="field mb-3">
                          <label className="label is-size-7 has-text-weight-semibold">Fulfillment Time</label>
                          <div className="control">
                            <p className="is-size-7 has-text-grey-dark">{product.fulfillmentTime}</p>
                          </div>
                        </div>
                        <div className="field mb-3">
                          <label className="label is-size-7 has-text-weight-semibold">Suppliers</label>
                          <div className="control">
                            <div className="tags is-justify-content-flex-end">
                              {product.supplier.map((supplier, index) => (
                                <span key={index} className="tag is-info is-light is-size-7 mb-1">{supplier}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="field mb-3">
                          <label className="label is-size-7 has-text-weight-semibold">Last Updated</label>
                          <div className="control">
                            <p className="is-size-7 has-text-grey-dark">
                              {product.priceHistory.length > 0 
                                ? product.priceHistory[product.priceHistory.length - 1].effectiveDate 
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="field mb-3">
                          <label className="label is-size-7 has-text-weight-semibold">Price Changes</label>
                          <div className="control">
                            <p className="is-size-7 has-text-grey-dark">
                              {product.priceHistory.length} time(s)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="buttons is-justify-content-flex-end">
                      <button 
                        className="button is-primary is-size-7"
                        onClick={handleOpenAddImageModal}
                      >
                        <span className="icon is-size-7">
                          <i className="material-icons is-size-7">add_photo_alternate</i>
                        </span>
                        <span>Add Image</span>
                      </button>

                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details Tabs */}
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid #dbdbdb' }}>
                <Tab.Group>
                  <Tab.List className="tabs is-centered is-size-7">
                    <Tab className={({ selected }) => `tab is-size-7 ${selected ? 'is-active' : ''}`}>
                      Price History
                    </Tab>
                    <Tab className={({ selected }) => `tab is-size-7 ${selected ? 'is-active' : ''}`}>
                      Templates
                    </Tab>
                    <Tab className={({ selected }) => `tab is-size-7 ${selected ? 'is-active' : ''}`}>
                      Videos
                    </Tab>
                    <Tab className={({ selected }) => `tab is-size-7 ${selected ? 'is-active' : ''}`}>
                      Suppliers List
                    </Tab>
                  </Tab.List>
                  <Tab.Panels className="mt-4">
                    <Tab.Panel>
                      <div className="content is-size-7">
                        <h4 className="title is-4 is-size-7">Price History</h4>
                        <div className="table-container">
                          <table className="table is-fullwidth is-striped is-hoverable is-size-7 mx-auto" style={{ maxWidth: '600px' }}>
                            <thead>
                              <tr>
                                <th className="is-size-7 has-text-centered">Date</th>
                                <th className="is-size-7 has-text-centered">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {product.priceHistory.map((price, index) => (
                                <tr key={index}>
                                  <td className="is-size-7 has-text-centered">{price.effectiveDate}</td>
                                  <td className="has-text-weight-bold is-size-7 has-text-centered has-text-success">${price.oldCost}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </Tab.Panel>
                                                    <Tab.Panel>
              <TemplateSection 
                key={templateUpdateKey}
                product={product}
                onUploadTemplate={handleUploadTemplate}
              />
            </Tab.Panel>
                    <Tab.Panel>
                      <VideoSection product={product} />
                    </Tab.Panel>
                    <Tab.Panel>
                      <SupplierSection product={product} />
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className="content is-size-7">
                        <h4 className="title is-4 is-size-7">Fulfillment Information</h4>
                        <div className="columns">
                          <div className="column is-6">
                            <div className="notification is-info is-light">
                              <h5 className="title is-5 is-size-7">Order Processing</h5>
                              <ul className="is-size-7">
                                <li><strong>Fulfillment Time:</strong> {product.fulfillmentTime}</li>
                                <li><strong>Stock Status:</strong> {product.productStatus}</li>
                                <li><strong>Last Price Update:</strong> {
                                  product.priceHistory.length > 0 
                                    ? product.priceHistory[product.priceHistory.length - 1].effectiveDate 
                                    : 'N/A'
                                }</li>
                              </ul>
                            </div>
                          </div>
                          <div className="column is-6">
                            <div className="notification is-warning is-light">
                              <h5 className="title is-5 is-size-7">Supplier Information</h5>
                              <ul className="is-size-7">
                                <li><strong>Primary Supplier:</strong> {product.supplier[0] || 'N/A'}</li>
                                <li><strong>Backup Suppliers:</strong> {product.supplier.slice(1).join(', ') || 'None'}</li>
                                <li><strong>Category:</strong> {product.category}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="notification is-success is-light mt-4">
                          <h5 className="title is-5 is-size-7">Quick Actions</h5>
                          <div className="buttons">
                            <button className="button is-small is-primary is-size-7">
                              <span className="icon is-size-7">
                                <i className="material-icons is-size-7">schedule</i>
                              </span>
                              <span>Update Fulfillment Time</span>
                            </button>
                            <button className="button is-small is-info is-size-7">
                              <span className="icon is-size-7">
                                <i className="material-icons is-size-7">inventory_2</i>
                              </span>
                              <span>Check Stock Level</span>
                            </button>
                            <button className="button is-small is-warning is-size-7">
                              <span className="icon is-size-7">
                                <i className="material-icons is-size-7">phone</i>
                              </span>
                              <span>Contact Supplier</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className="content is-size-7">
                        <h4 className="title is-4 is-size-7">Customer Reviews</h4>
                        <div className="notification is-info is-light">
                          <p className="is-size-7">No reviews yet. Be the first to review this product!</p>
                        </div>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {product && (
          <Dialog open={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} className="modal is-active">
          <div className="modal-background" onClick={() => setIsImageModalOpen(false)}></div>
          <Dialog.Panel className="modal-card is-size-7">
            <header className="modal-card-head">
              <Dialog.Title className="modal-card-title is-size-7">{product?.name || 'Product Image'}</Dialog.Title>
              <button 
                className="delete is-size-7" 
                onClick={() => setIsImageModalOpen(false)}
              ></button>
            </header>
            <section className="modal-card-body has-text-centered is-size-7">
                       <Image
           src={productImages[safeImageIndex] || '/images/glass1.png'}
           alt={`${product?.name || 'Product'} - Image ${safeImageIndex + 1}`}
           width={400}
           height={400}
           style={{
             objectFit: 'cover',
             borderRadius: '8px'
           }}
         />
         <p className="help mt-3 is-size-7">{safeImageIndex + 1} / {productImages.length}</p>
            </section>
          </Dialog.Panel>
        </Dialog>
        )}

        {/* DetailAddImageModal */}
        {product && (
          <DetailAddImageModal
            isVisible={isAddImageModalOpen}
            product={product}
            onClose={handleCloseAddImageModal}
            onUpload={handleUploadImages}
          />
        )}
        

      </div>
    </ProtectedRoute>
  )
}

export default ProductDetail