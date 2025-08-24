'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Dialog, Tab } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/Shared/NavBar'
import ProtectedRoute from '@/components/Shared/ProtectedRoute'
import { products } from '@/constants/index_product'
import { Product } from '@/types/product'
import { useToast } from '@/components/Shared/ToastProvider'
import { DetailAddImageModal } from '@/components/Products'


const ProductDetail = () => {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
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
    // Try to get products from localStorage first, then fallback to constants
    let allProducts = products
    try {
      const storedProducts = localStorage.getItem('productsData')
      if (storedProducts) {
        allProducts = JSON.parse(storedProducts)
      }
    } catch (error) {
      console.warn('Failed to load products from localStorage:', error)
    }
    
    const foundProduct = allProducts.find(p => p.productSku === productSku)
    
    if (foundProduct) {
      // Only auto-fix if productImages field is completely missing (not just empty)
      const originalProduct = products.find(p => p.productSku === productSku)
      if (originalProduct && !foundProduct.hasOwnProperty('productImages')) {
        console.log(` Product ${productSku} missing productImages field, using data from constants`)
        const updatedProduct = {
          ...foundProduct,
          productImages: originalProduct.productImages || []
        }
        setProduct(updatedProduct)
        
        // Update localStorage with the corrected data
        try {
          const updatedProducts = allProducts.map((p: Product) => 
            p.productSku === productSku ? updatedProduct : p
          )
          localStorage.setItem('productsData', JSON.stringify(updatedProducts))
          console.log(` Updated localStorage for product ${productSku}`)
        } catch (error) {
          console.warn('Failed to update localStorage:', error)
        }
      } else {
        setProduct(foundProduct)
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
    
    showToast('Images added successfully!', 'success')
    setIsAddImageModalOpen(false)
  }

  useEffect(() => {
    const productSku = params.id as string
    setIsLoading(true)
    loadProduct(productSku)
  }, [params.id, loadProduct])

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
                <div className="is-flex is-align-items-stretch" style={{ maxWidth: '800px' }}>
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
                          <figure className="image is-clickable" style={{ width: '350px', height: '350px', overflow: 'hidden' }} onClick={() => setIsImageModalOpen(true)}>
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
                                  width={350}
                                  height={350}
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
                      <button className="button is-info is-size-7">
                        <span className="icon is-size-7">
                          <i className="material-icons is-size-7">history</i>
                        </span>
                        <span>Upload Template</span>
                      </button>
                      <button className="button is-warning is-size-7">
                        <span className="icon is-size-7">
                          <i className="material-icons is-size-7">inventory</i>
                        </span>
                        <span>Stock Status</span>
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
                      Specifications
                    </Tab>
                    <Tab className={({ selected }) => `tab is-size-7 ${selected ? 'is-active' : ''}`}>
                      Fulfillment Info
                    </Tab>
                    <Tab className={({ selected }) => `tab is-size-7 ${selected ? 'is-active' : ''}`}>
                      Reviews
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
                      <div className="content is-size-7">
                        <h4 className="title is-4 is-size-7">Specifications</h4>
                        <div className="columns">
                          <div className="column is-6">
                            <table className="table is-fullwidth is-size-7">
                              <tbody>
                                <tr>
                                  <td className="is-size-7"><strong>Product Name:</strong></td>
                                  <td className="is-size-7">{product.name}</td>
                                </tr>
                                <tr>
                                  <td className="is-size-7"><strong>SKU:</strong></td>
                                  <td className="is-size-7">{product.productSku}</td>
                                </tr>
                                <tr>
                                  <td className="is-size-7"><strong>Category:</strong></td>
                                  <td className="is-size-7">{product.category}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="column is-6">
                            <table className="table is-fullwidth is-size-7">
                              <tbody>
                                <tr>
                                  <td className="is-size-7"><strong>Status:</strong></td>
                                  <td className="is-size-7">{product.productStatus}</td>
                                </tr>
                                <tr>
                                  <td className="is-size-7"><strong>Fulfillment:</strong></td>
                                  <td className="is-size-7">{product.fulfillmentTime}</td>
                                </tr>
                                <tr>
                                  <td className="is-size-7"><strong>Suppliers:</strong></td>
                                  <td className="is-size-7">{product.supplier.join(', ')}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
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