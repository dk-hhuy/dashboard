'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import NavBar from '@/components/Shared/NavBar'
import ProtectedRoute from '@/components/Shared/ProtectedRoute'
import SearchProduct from '@/components/Products/SearchProduct'
import OutInStock from '@/components/Products/OutInStock'
import TableResult from '@/components/Shared/TableResult'
import HoverZoomModal from '@/components/Shared/HoverZoomModal'
import ProductAction from '@/components/Products/ProductAction'
import ProductsTable from '@/components/Products/ProductsTable'
import ProductFormModal from '@/components/Products/Modals/ProductFormModal'
import ImportProductModal from '@/components/Products/Modals/ImportProductModal'
import UpdatePriceModal from '@/components/Products/Modals/UpdatePriceModal'
import { products } from '@/constants/index_product'
import { exportSelectedProductsData } from '@/lib/utils_product'
import { exportProducts, exportSelectedProducts, ExportFormat } from '@/lib/exportUtils'
import { useProductFilter } from '@/hooks/useProductFilter'
import { Product, ProductFormData } from '@/types/product'
import { useToast } from '@/components/Shared/ToastProvider'
import ConfigSupplierModal from '@/components/Products/Modals/ConfigSupplierModal'
import ItemsPerPageSelector from '@/components/Shared/ItemsPerPageSelector'

// Constants
const IMAGE_HOVER_DELAY = 100

// Main Products Component
const Products = () => {
  // Toast hook
  const { showToast } = useToast()
  
  // State management
  const [productsData, setProductsData] = useState(products)
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showImportProduct, setShowImportProduct] = useState(false)
  const [showUpdatePrice, setShowUpdatePrice] = useState(false)
  const [updatedProductSkus, setUpdatedProductSkus] = useState<Set<string>>(new Set())
  const searchParams = useSearchParams()
  const [showUpdatedOnly, setShowUpdatedOnly] = useState(searchParams.get('updated') === 'true')
  const [showConfigSupplier, setShowConfigSupplier] = useState(false)
  const [selectedProductSkus, setSelectedProductSkus] = useState<Set<string>>(new Set())

  // Custom hook for filtering and pagination
  const {
    activeStockFilter,
    filteredProducts,
    displayProducts,
    currentPage,
    startIndex,
    endIndex,
    itemsPerPage,
    handleStockFilter,
    handleSearch,
    handlePageChange,
    handleItemsPerPageChange
  } = useProductFilter(productsData, updatedProductSkus, showUpdatedOnly, 12)

  const handleSelectionChange = useCallback((selectedProducts: Set<string>) => {
    setSelectedProductSkus(selectedProducts);
  }, [])

  // Export selected products handler
  const handleExportSelected = useCallback((format: ExportFormat = 'json') => {
    if (selectedProductSkus.size === 0) {
      showToast('No products selected for export!', 'warning');
      return;
    }
    
    const exportedCount = exportSelectedProducts(productsData, selectedProductSkus, format);
    showToast(`Exported ${exportedCount} selected products as ${format.toUpperCase()}!`, 'success');
  }, [selectedProductSkus, productsData, showToast]);

  // Export all products handler
  const handleExportAll = useCallback((format: ExportFormat = 'json') => {
    exportProducts(productsData, format);
    showToast(`Exported ${productsData.length} products as ${format.toUpperCase()}!`, 'success');
  }, [productsData, showToast]);

  // Image hover handlers with debouncing
  const handleImageHover = useCallback((src: string) => {
    if (window.imageHoverTimeout) {
      clearTimeout(window.imageHoverTimeout)
    }
    
    window.imageHoverTimeout = setTimeout(() => {
      setHoveredImage(src)
    }, IMAGE_HOVER_DELAY)
  }, [])

  const handleImageLeave = useCallback(() => {
    if (window.imageHoverTimeout) {
      clearTimeout(window.imageHoverTimeout)
      window.imageHoverTimeout = null
    }
    setHoveredImage(null)
  }, [])

  // Action handlers
  const handleActionClick = useCallback((action: string, productSku: string) => {
    console.log(`${action} clicked for product: ${productSku}`)
    
    switch (action) {
      case 'Edit':
        const productToEdit = productsData.find(p => p.productSku === productSku)
        if (productToEdit) {
          setEditingProduct(productToEdit)
          setShowProductForm(true)
        }
        break
      case 'Delete':
        if (confirm(`Are you sure you want to delete product: ${productSku}?`)) {
          // Remove product from productsData
          const updatedProducts = productsData.filter(p => p.productSku !== productSku)
          setProductsData(updatedProducts)
          
          // Remove from updatedProductSkus if it exists there
          setUpdatedProductSkus(prev => {
            const newSet = new Set(prev)
            newSet.delete(productSku)
            return newSet
          })
          
          // Product deleted successfully
          showToast(`Product **${productSku}** deleted successfully!`, 'success')
        }
        break
      case 'Detail':
        showToast(`Detail product: ${productSku} - No functionality implemented yet`, 'info')
        break
      default:
        console.warn(`Unknown action: ${action}`)
    }
  }, [productsData, showToast])

  const handleAddProduct = useCallback(() => {
    setEditingProduct(null) // No product = Add mode
    setShowProductForm(true)
  }, [])

  const handleImportProduct = useCallback(() => {
    setShowImportProduct(true)
  }, [])

  const handleImportClose = useCallback(() => {
    setShowImportProduct(false)
  }, [])

  const handleUpdatePrice = useCallback(() => {
    setShowUpdatePrice(true)
  }, [])

  const handleUpdatePriceClose = useCallback(() => {
    setShowUpdatePrice(false)
  }, [])

  const handleToggleShowUpdated = useCallback(() => {
    setShowUpdatedOnly(prev => {
      const newValue = !prev
      return newValue
    })
  }, [])

  const handleConfig = useCallback(() => {
    setShowConfigSupplier(true)
  }, [])

  const handleConfigClose = useCallback(() => {
    setShowConfigSupplier(false)
  }, [])

  const handleUpdatePriceSave = useCallback((priceUpdates: any[]) => {
    
    // Update products with new prices
    const updatedProducts = [...productsData]
    const newlyUpdatedSkus = new Set<string>()
    const updatedProductsList: Product[] = []
    
    priceUpdates.forEach(update => {
      const productIndex = updatedProducts.findIndex(p => p.productSku === update.productSku)
      if (productIndex !== -1) {
        const currentProduct = updatedProducts[productIndex]
        const newPrice = update.cost
        const newEffectiveDate = update.effectiveDate
        
        // Get latest price from current product
        const latestPrice = currentProduct.priceHistory[currentProduct.priceHistory.length - 1]?.oldCost || '0.00'
        const latestDate = currentProduct.priceHistory[currentProduct.priceHistory.length - 1]?.effectiveDate || ''
        
        // Check if price or effective date has changed
        const priceChanged = newPrice !== latestPrice
        const dateChanged = newEffectiveDate !== latestDate
        const shouldUpdatePriceHistory = priceChanged || dateChanged
        
        if (shouldUpdatePriceHistory) {
          updatedProducts[productIndex] = {
            ...currentProduct,
            priceHistory: [
              ...currentProduct.priceHistory,
              {
                oldCost: newPrice,
                effectiveDate: newEffectiveDate
              }
            ]
          }
          newlyUpdatedSkus.add(update.productSku)
          updatedProductsList.push(updatedProducts[productIndex])
        }
      }
    })
    
    setProductsData(updatedProducts)
    
    // Track updated product SKUs
    setUpdatedProductSkus(prev => {
      const newSet = new Set([...prev, ...newlyUpdatedSkus])
      return newSet
    })
    
    showToast(`Successfully updated prices for **${priceUpdates.length}** products!`, 'success')
    setShowUpdatePrice(false)
  }, [productsData, showToast])

  // Form handlers
  const handleFormClose = useCallback(() => {
    setShowProductForm(false)
    setEditingProduct(null)
  }, [])

  // Helper function to convert File to base64
  const convertFileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }, [])



  const handleFormSave = useCallback(async (productsFormData: ProductFormData[]) => {
    console.log('Saving products:', productsFormData)
    
    if (editingProduct) {
      // Edit mode - only one product
      const productData = productsFormData[0]
      
      // Check if productData exists
      if (!productData) {
        showToast('No product data found for editing.', 'error')
        return
      }
      
      const productIndex = productsData.findIndex(p => p.productSku === productData.productSku)
      
      // Check if product exists
      if (productIndex === -1) {
        showToast('Product not found for editing.', 'error')
        return
      }
      
      // Determine image source
      let imageSource = '/images/glass1.png' // Default image
      
      if (productData.uploadedImage) {
        try {
          // Convert uploaded file to base64
          imageSource = await convertFileToBase64(productData.uploadedImage)
        } catch (error) {
          showToast('Error processing uploaded image. Using default image.', 'warning')
        }
      } else if (productData.productImage && productData.productImage !== '/images/glass1.png') {
        // Use manually entered image path
        imageSource = productData.productImage
      }
      
      // Edit existing product
      const updatedProducts = [...productsData]
      const currentProduct = updatedProducts[productIndex]
      const newPrice = productData.priceHistory?.[0]?.oldCost || '0.00'
      const newEffectiveDate = productData.priceHistory?.[0]?.effectiveDate || new Date().toISOString().split('T')[0]
      
      // Get latest price from current product
      const latestPrice = currentProduct.priceHistory[currentProduct.priceHistory.length - 1]?.oldCost || '0.00'
      const latestDate = currentProduct.priceHistory[currentProduct.priceHistory.length - 1]?.effectiveDate || ''
      
      // Check if price or effective date has changed
      const priceChanged = newPrice !== latestPrice
      const dateChanged = newEffectiveDate !== latestDate
      const shouldUpdatePriceHistory = priceChanged || dateChanged
      
      updatedProducts[productIndex] = {
        ...currentProduct,
        mainimage: imageSource, // Update image
        name: productData.name,
        description: productData.description,
        category: productData.category,
        supplier: productData.supplier,
        productStatus: productData.productStatus,
        fulfillmentTime: productData.fulfillmentTime,
        priceHistory: shouldUpdatePriceHistory 
          ? [
              ...currentProduct.priceHistory,
              { 
                oldCost: newPrice,
                effectiveDate: newEffectiveDate
              }
            ]
          : currentProduct.priceHistory // Keep existing price history if no changes
      }
      
      setProductsData(updatedProducts)
      
      // Add edited product to updatedProductSkus
      setUpdatedProductSkus(prev => {
        const newSet = new Set([...prev, productData.productSku])
        return newSet
      })
      
      showToast(`Product **${productData.productSku}** updated successfully!`, 'success')
    } else {
      // Add mode - multiple products
      const newProducts: Product[] = []
      const addedSkus: string[] = []
      
      for (const productData of productsFormData) {
        // Check if productData exists
        if (!productData) {
          showToast('Invalid product data found. Skipping...', 'warning')
          continue
        }
        
        // Determine image source
        let imageSource = '/images/glass1.png' // Default image
        
        if (productData.uploadedImage) {
          try {
            // Convert uploaded file to base64
            imageSource = await convertFileToBase64(productData.uploadedImage)
          } catch (error) {
            showToast('Error processing uploaded image. Using default image.', 'warning')
          }
        } else if (productData.productImage && productData.productImage !== '/images/glass1.png') {
          // Use manually entered image path
          imageSource = productData.productImage
        }
        
        // Get price data from form
        const newPrice = productData.priceHistory?.[0]?.oldCost || '0.00'
        const newEffectiveDate = productData.priceHistory?.[0]?.effectiveDate || new Date().toISOString().split('T')[0]
        
        // Add new product
        const newProduct: Product = {
          mainimage: imageSource, // Use processed image
          productSku: productData.productSku,
          name: productData.name,
          description: productData.description,
          category: productData.category,
          supplier: productData.supplier,
          productStatus: productData.productStatus,
          fulfillmentTime: productData.fulfillmentTime,
          priceHistory: [{
            oldCost: newPrice,
            effectiveDate: newEffectiveDate
          }]
        }
        
        newProducts.push(newProduct)
        addedSkus.push(productData.productSku)
      }
      
      // Update local state
      const updatedProductsData = [...productsData, ...newProducts]
      setProductsData(updatedProductsData)
      
      // Add new products to updatedProductSkus
      setUpdatedProductSkus(prev => {
        const newSet = new Set([...prev, ...addedSkus])
        return newSet
      })
      
      if (newProducts.length === 1) {
        showToast(`Product **${addedSkus[0]}** added successfully!`, 'success')
      } else {
        showToast(`**${newProducts.length}** products added successfully!`, 'success')
      }
    }
    
    setShowProductForm(false)
    setEditingProduct(null)
  }, [productsData, editingProduct, convertFileToBase64, showToast])



  const handleImportProducts = useCallback((importedProducts: Product[]) => {
    let successCount = 0
    let failedCount = 0
    const updatedProducts = [...productsData]
    const updatedSkus = new Set<string>()
    
    // Process each imported product
    importedProducts.forEach(importedProduct => {
      const existingProductIndex = productsData.findIndex(p => p.productSku === importedProduct.productSku)
      
      if (existingProductIndex === -1) {
        // New product - add it
        updatedProducts.push(importedProduct)
        updatedSkus.add(importedProduct.productSku)
        successCount++
      } else {
        // Existing product - check for differences
        const existingProduct = productsData[existingProductIndex]
        const differences: string[] = []
        
        // Compare each field
        if (existingProduct.name !== importedProduct.name) differences.push('name')
        if (existingProduct.description !== importedProduct.description) differences.push('description')
        if (existingProduct.category !== importedProduct.category) differences.push('category')
        if (existingProduct.fulfillmentTime !== importedProduct.fulfillmentTime) differences.push('fulfillmentTime')
        if (existingProduct.productStatus !== importedProduct.productStatus) differences.push('productStatus')
        if (JSON.stringify(existingProduct.supplier) !== JSON.stringify(importedProduct.supplier)) differences.push('supplier')
        if (existingProduct.mainimage !== importedProduct.mainimage) differences.push('mainimage')
        
        // Compare price history (check if the latest price or effective date is different)
        const existingLatestPrice = existingProduct.priceHistory[existingProduct.priceHistory.length - 1]?.oldCost || '0.00'
        const existingLatestDate = existingProduct.priceHistory[existingProduct.priceHistory.length - 1]?.effectiveDate || ''
        const importedLatestPrice = importedProduct.priceHistory[importedProduct.priceHistory.length - 1]?.oldCost || '0.00'
        const importedLatestDate = importedProduct.priceHistory[importedProduct.priceHistory.length - 1]?.effectiveDate || ''
        
        const priceChanged = existingLatestPrice !== importedLatestPrice
        const dateChanged = existingLatestDate !== importedLatestDate
        if (priceChanged || dateChanged) differences.push('price')
        
        if (differences.length > 0) {
          // Update only the different fields
          const updatedProduct = { ...existingProduct }
          
          if (differences.includes('name')) updatedProduct.name = importedProduct.name
          if (differences.includes('description')) updatedProduct.description = importedProduct.description
          if (differences.includes('category')) updatedProduct.category = importedProduct.category
          if (differences.includes('fulfillmentTime')) updatedProduct.fulfillmentTime = importedProduct.fulfillmentTime
          if (differences.includes('productStatus')) updatedProduct.productStatus = importedProduct.productStatus
          if (differences.includes('supplier')) updatedProduct.supplier = importedProduct.supplier
          if (differences.includes('mainimage')) updatedProduct.mainimage = importedProduct.mainimage
          if (differences.includes('price')) {
            // Add new price to history if different
            updatedProduct.priceHistory.push({
              oldCost: importedLatestPrice,
              effectiveDate: importedLatestDate || new Date().toISOString().split('T')[0]
            })
          }
          
          updatedProducts[existingProductIndex] = updatedProduct
          updatedSkus.add(importedProduct.productSku)
          successCount++
        } else {
          // No differences - skip this product
          failedCount++
        }
      }
    })
    
    // Update state
    setProductsData(updatedProducts)
    setUpdatedProductSkus(prev => {
      const newSet = new Set([...prev, ...Array.from(updatedSkus)])
      return newSet
    })
    
    // Show result toast
    if (successCount > 0 && failedCount > 0) {
      showToast(`Import completed! **${successCount}** products updated/added, **${failedCount}** products skipped (no changes).`, 'success')
    } else if (successCount > 0) {
      showToast(`Import completed! **${successCount}** products updated/added successfully.`, 'success')
    } else if (failedCount > 0 && failedCount === importedProducts.length) {
      showToast(`Import failed! **${failedCount}** products skipped - no changes detected. All products already exist.`, 'error')
    } else {
      showToast(`Import failed! **${failedCount}** products skipped - no changes detected.`, 'error')
    }
    
    setShowImportProduct(false)
  }, [productsData, showToast])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.imageHoverTimeout) {
        clearTimeout(window.imageHoverTimeout)
        window.imageHoverTimeout = null
      }
    }
  }, [])

  return (
    <ProtectedRoute>
      <div className="is-size-7" style={{ minHeight: '100vh', paddingTop: '3rem' }}>
        <NavBar />

        <div>
          <div className="is-fluid">
            <div className="columns is-gapless">
              <div className="column">
                <div className="box is-fullwidth is-size-7">
                  {/* Header Section */}
                  <div className="level is-size-7">
                    <motion.h4
                      className="title is-4 is-size-6 level-left"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.4 }}
                    >
                      PRODUCT STOCK ({filteredProducts.length} products)
                    </motion.h4>

                    <div className="level-right">
                      <SearchProduct onSearch={handleSearch} />
                    </div>
                  </div>

                  {/* Table Section */}
                  <div className="is-size-7 mt-7">
                    <div className="is-size-7 mb-5">
                      <div className="is-flex is-align-items-center is-justify-content-space-between is-size-7">
                        <OutInStock 
                          activeStockFilter={activeStockFilter}
                          onStockFilterChange={handleStockFilter}
                          showUpdatedOnly={showUpdatedOnly}
                          onToggleShowUpdated={handleToggleShowUpdated}
                          productsData={productsData}
                          updatedProductSkus={updatedProductSkus}
                        />
                        <ProductAction 
                          onAddProduct={handleAddProduct}
                          onUpdatePrice={handleUpdatePrice}
                          onImport={handleImportProduct}
                          onExport={handleExportAll}
                          onExportSelected={handleExportSelected}
                          selectedCount={selectedProductSkus.size}
                          onConfig={handleConfig}
                        />
                      </div>
                    </div>
                    <ProductsTable 
                      products={displayProducts} 
                      allProducts={filteredProducts}
                      onImageHover={handleImageHover}
                      onImageLeave={handleImageLeave}
                      onActionClick={handleActionClick}
                      showUpdatedOnly={showUpdatedOnly}
                      activeStockFilter={activeStockFilter}
                      updatedProductSkus={updatedProductSkus}
                      onSelectionChange={handleSelectionChange}
                    />
                    
                    {/* Pagination */}
                    <TableResult 
                      currentPage={currentPage}
                      setCurrentPage={handlePageChange}
                      itemsPerPage={itemsPerPage}
                      startIndex={startIndex}
                      endIndex={endIndex}
                      totalItems={filteredProducts.length}
                      onItemsPerPageChange={handleItemsPerPageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {hoveredImage && (
          <HoverZoomModal src={hoveredImage} isVisible={true} />
        )}

        <ProductFormModal
          isVisible={showProductForm}
          editingProduct={editingProduct}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />

        <ImportProductModal
          isVisible={showImportProduct}
          onClose={handleImportClose}
          onImport={handleImportProducts}
        />

        <UpdatePriceModal
          isVisible={showUpdatePrice}
          products={productsData}
          onClose={handleUpdatePriceClose}
          onSave={handleUpdatePriceSave}
        />

        <ConfigSupplierModal
          isVisible={showConfigSupplier}
          onClose={handleConfigClose}
        />
      </div>
    </ProtectedRoute>
  )
}

export default Products