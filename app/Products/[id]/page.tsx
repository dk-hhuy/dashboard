'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Dialog, Tab } from '@headlessui/react'
import NavBar from '@/components/Shared/NavBar'
import ProtectedRoute from '@/components/Shared/ProtectedRoute'
import { products } from '@/constants/index_product'
import { Product } from '@/types/product'
import { useToast } from '@/components/Shared/ToastProvider'

const ProductDetail = () => {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  useEffect(() => {
    const productSku = params.id as string
    const foundProduct = products.find(p => p.productSku === productSku)
    
    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      showToast(`Product ${productSku} not found!`, 'error')
      router.push('/Products')
    }
    setIsLoading(false)
  }, [params.id, router, showToast])

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
                  <div className="is-flex-shrink-0 mr-6 is-flex is-flex-direction-column is-justify-content-center">
                    <div className="has-text-centered">
                      <figure className="image is-clickable" style={{ width: '350px', height: '350px' }} onClick={() => setIsImageModalOpen(true)}>
                        <Image 
                          src={product.mainimage || '/images/glass1.png'} 
                          alt={product.name}
                          width={350}
                          height={350}
                          className="has-shadow"
                          style={{ 
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%'
                          }}
                        />
                      </figure>
                      <p className="help mt-2">Click to enlarge</p>
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
                      <button className="button is-primary is-size-7">
                        <span className="icon is-size-7">
                          <i className="material-icons is-size-7">edit</i>
                        </span>
                        <span>Edit Product</span>
                      </button>
                      <button className="button is-info is-size-7">
                        <span className="icon is-size-7">
                          <i className="material-icons is-size-7">history</i>
                        </span>
                        <span>Update Price</span>
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
        <Dialog open={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} className="modal is-active">
          <div className="modal-background" onClick={() => setIsImageModalOpen(false)}></div>
          <Dialog.Panel className="modal-card is-size-7">
            <header className="modal-card-head">
              <Dialog.Title className="modal-card-title is-size-7">{product.name}</Dialog.Title>
              <button 
                className="delete is-size-7" 
                onClick={() => setIsImageModalOpen(false)}
              ></button>
            </header>
            <section className="modal-card-body has-text-centered is-size-7">
              <Image 
                src={product.mainimage || '/images/glass1.png'} 
                alt={product.name}
                width={400}
                height={400}
                style={{ 
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            </section>
          </Dialog.Panel>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}

export default ProductDetail