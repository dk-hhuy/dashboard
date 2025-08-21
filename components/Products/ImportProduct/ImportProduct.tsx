import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { Product } from '@/types/product'
import { 
  validateImportFile, 
  validateImportedProducts, 
  getImportError, 
  hasImportError 
} from '@/schemas/importSchema'
import { useToast } from '@/components/Shared'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ImportProductProps {
  onImport: (products: Product[]) => void;
  onClose?: () => void;
}

interface ProcessedProduct {
  mainimage: string;
  productSku: string;
  name: string;
  description: string;
  category: string;
  fulfillmentTime: string;
  priceHistory: Array<{ oldCost: string; effectiveDate: string }>;
  supplier: string[];
  productStatus: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Tạo price history từ dữ liệu input
 * @param priceHistory - Dữ liệu price history có sẵn
 * @param price - Giá sản phẩm đơn giản
 * @param rowNumber - Số thứ tự row để log
 * @returns Array price history
 */
const createPriceHistory = (
  priceHistory: any, 
  price: string, 
  rowNumber?: number
): Array<{ oldCost: string; effectiveDate: string }> => {
  if (priceHistory) {
    try {
      return JSON.parse(priceHistory)
    } catch (error) {
      console.warn(`Invalid priceHistory JSON for row ${rowNumber}:`, priceHistory)
    }
  }
  
  // Format price to ensure it's a valid number
  const formatPrice = (priceValue: string): string => {
    if (!priceValue) return '0.00'
    
    // Remove any existing $ and clean the price
    const cleanPrice = priceValue.toString().replace('$', '').trim()
    const numericPrice = parseFloat(cleanPrice)
    
    if (isNaN(numericPrice)) {
      console.warn(`Invalid price format for row ${rowNumber}:`, priceValue)
      return '0.00'
    }
    
    // Return as number string without $ prefix
    return numericPrice.toFixed(2)
  }
  
  return [{
    oldCost: formatPrice(price),
    effectiveDate: new Date().toISOString().split('T')[0]
  }]
}

/**
 * Xử lý supplier data từ nhiều format khác nhau
 * @param supplier - Dữ liệu supplier (string, array, hoặc comma-separated)
 * @returns Array suppliers
 */
const processSupplierData = (supplier: any): string[] => {
  if (!supplier) return ['Default Supplier']
  
  if (Array.isArray(supplier)) {
    return supplier
  }
  
  // Xử lý comma-separated string
  return supplier.split(',').map((s: string) => s.trim()).filter(Boolean)
}

/**
 * Transform raw data thành Product object
 * @param row - Dữ liệu raw từ file
 * @param index - Index của row
 * @returns Product object
 */
const transformToProduct = (row: any, index: number): ProcessedProduct => {
  const rowNumber = index + 1
  
  return {
    mainimage: row.mainimage || row.image || '/images/glass1.png',
    productSku: row.productSku || row.sku || row.SKU || '',
    name: row.name || row.productName || row.Name || '',
    description: row.description || row.desc || row.Description || '',
    category: row.category || row.Category || 'Tumbler',
    fulfillmentTime: row.fulfillmentTime || row.fulfillment || '1-2 days',
    priceHistory: createPriceHistory(
      row.priceHistory, 
      row.price || row.Price || row.cost, 
      rowNumber
    ),
    supplier: processSupplierData(row.supplier),
    productStatus: row.productStatus || row.status || row.Status || 'In Stock'
  }
}

  /**
   * Validate và xử lý products sau khi import
   * @param products - Array products đã xử lý
   * @param fileType - Loại file (CSV, Excel, JSON)
   * @param setErrors - Function set errors
   * @param setIsValidating - Function set validating state
   * @param onImport - Callback khi import thành công
   * @param showToast - Toast notification function
   */
  const validateAndImport = (
    products: ProcessedProduct[],
    fileType: string,
    setErrors: (errors: Record<string, string[]>) => void,
    setIsValidating: (validating: boolean) => void,
    onImport: (products: Product[]) => void,
    showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
  ) => {
    console.log(`Validating ${products.length} products from ${fileType}...`)
    
    const validation = validateImportedProducts(products)
    console.log('Validation result:', validation)
    
    if (!validation.success) {
      console.error('Validation failed with errors:', validation.errors)
      setErrors(validation.errors as Record<string, string[]>)
      setIsValidating(false)
      showToast(`Import validation failed. Please check the data format. Check console for details.`, 'error')
      return
    }
    
    setIsValidating(false)
    onImport(products)
  }

// ============================================================================
// FILE PROCESSING FUNCTIONS
// ============================================================================

  /**
   * Xử lý file CSV sử dụng Papa Parse
   * @param file - File CSV
   * @param setErrors - Function set errors
   * @param setIsValidating - Function set validating state
   * @param onImport - Callback khi import thành công
   * @param showToast - Toast notification function
   */
  const processCSV = (
    file: File,
    setErrors: (errors: Record<string, string[]>) => void,
    setIsValidating: (validating: boolean) => void,
    onImport: (products: Product[]) => void,
    showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
  ) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      try {
        console.log('=== CSV PROCESSING START ===')
        console.log('CSV Headers:', results.meta.fields)
        console.log('Total data rows:', results.data.length)
        
        if (results.errors.length > 0) {
          console.warn('Papa Parse warnings:', results.errors)
        }
        
        // Transform CSV data thành Product objects
        const products: ProcessedProduct[] = results.data.map((row: any, index) => {
          const rowNumber = index + 1
          console.log(`Processing CSV row ${rowNumber}/${results.data.length}...`)
          
          const product = transformToProduct(row, index)
          console.log(`Processed CSV Product ${rowNumber}:`, product)
          
          return product
        })
        
        console.log('=== CSV PROCESSING COMPLETE ===')
        validateAndImport(products, 'CSV', setErrors, setIsValidating, onImport, showToast)
        
              } catch (error) {
          console.error('CSV Processing Error:', error)
          showToast(`Error processing CSV file: ${error}`, 'error')
          setIsValidating(false)
        }
    },
          error: (error) => {
        console.error('Papa Parse Error:', error)
        showToast(`Error parsing CSV file: ${error.message}`, 'error')
        setIsValidating(false)
      }
  })
}

  /**
   * Xử lý file Excel sử dụng XLSX library
   * @param file - File Excel
   * @param setErrors - Function set errors
   * @param setIsValidating - Function set validating state
   * @param onImport - Callback khi import thành công
   * @param showToast - Toast notification function
   */
  const processExcel = (
    file: File,
    setErrors: (errors: Record<string, string[]>) => void,
    setIsValidating: (validating: boolean) => void,
    onImport: (products: Product[]) => void,
    showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
  ) => {
  const reader = new FileReader()
  
  reader.onload = (e) => {
    try {
      console.log('=== EXCEL PROCESSING START ===')
      console.log('Excel file:', file.name, 'Size:', file.size, 'bytes')
      
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      
      console.log('Workbook sheets:', workbook.SheetNames)
      
      // Lấy sheet đầu tiên
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      
      console.log('Processing sheet:', sheetName)
      
      // Chuyển đổi thành JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      console.log('Excel JSON data:', jsonData)
      
              if (jsonData.length === 0) {
          showToast('Excel file is empty or has no data!', 'warning')
          setIsValidating(false)
          return
        }
      
      // Transform Excel data thành Product objects
      const products: ProcessedProduct[] = jsonData.map((row: any, index) => {
        console.log(`Processing Excel row ${index + 1}/${jsonData.length}...`)
        
        const product = transformToProduct(row, index)
        console.log(`Processed Excel Product ${index + 1}:`, product)
        
        return product
      })
      
              console.log('=== EXCEL PROCESSING COMPLETE ===')
        validateAndImport(products, 'Excel', setErrors, setIsValidating, onImport, showToast)
      
          } catch (error) {
        console.error('Excel Processing Error:', error)
        showToast(`Error processing Excel file: ${error}`, 'error')
        setIsValidating(false)
      }
  }
  
  reader.readAsArrayBuffer(file)
}

  /**
   * Xử lý file JSON
   * @param file - File JSON
   * @param setErrors - Function set errors
   * @param setIsValidating - Function set validating state
   * @param onImport - Callback khi import thành công
   * @param showToast - Toast notification function
   */
  const processJSON = (
    file: File,
    setErrors: (errors: Record<string, string[]>) => void,
    setIsValidating: (validating: boolean) => void,
    onImport: (products: Product[]) => void,
    showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void
  ) => {
  const reader = new FileReader()
  
  reader.onload = (e) => {
    try {
      console.log('=== JSON PROCESSING START ===')
      
      const jsonText = e.target?.result as string
      console.log('Raw JSON content length:', jsonText.length)
      console.log('Raw JSON content preview:', jsonText.substring(0, 200) + '...')
      
      // Clean JSON text - remove any trailing characters
      const cleanedJsonText = jsonText.trim()
      console.log('Cleaned JSON content length:', cleanedJsonText.length)
      
      const jsonData = JSON.parse(cleanedJsonText)
      console.log('Parsed JSON data:', jsonData)
      
      // Đảm bảo data là array
      const products = Array.isArray(jsonData) ? jsonData : [jsonData]
      console.log('Products array length:', products.length)
      
      // Transform JSON data thành Product objects
      const validProducts: ProcessedProduct[] = products.map((item: any, index) => {
        console.log(`Processing JSON item ${index + 1}:`, item)
        
        const product = {
          mainimage: item.mainimage || '/images/glass1.png',
          productSku: item.productSku,
          name: item.name,
          description: item.description || '',
          category: item.category || 'Tumbler',
          fulfillmentTime: item.fulfillmentTime || '1-2 days',
          priceHistory: item.priceHistory || [{
            oldCost: item.price || '$0.00',
            effectiveDate: new Date().toISOString().split('T')[0]
          }],
          supplier: Array.isArray(item.supplier) ? item.supplier : [item.supplier || 'Default Supplier'],
          productStatus: item.productStatus || 'In Stock'
        }
        
        console.log(`Processed JSON Product ${index + 1}:`, product)
        return product
      })
      
              console.log('=== JSON PROCESSING COMPLETE ===')
        validateAndImport(validProducts, 'JSON', setErrors, setIsValidating, onImport, showToast)
      
          } catch (error) {
        console.error('JSON Processing Error:', error)
        console.error('Error details:', {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        })
        
        // Show more specific error message
        let errorMessage = 'Error processing JSON file'
        if (error instanceof SyntaxError) {
          errorMessage = 'Invalid JSON format. Please check your JSON file.'
        } else if (error instanceof Error) {
          errorMessage = `JSON processing error: ${error.message}`
        }
        
        showToast(errorMessage, 'error')
        setIsValidating(false)
      }
  }
  
  reader.readAsText(file)
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ImportProduct = ({ onImport, onClose }: ImportProductProps) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /** Validation errors state */
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  
  /** Loading state khi đang validate/process file */
  const [isValidating, setIsValidating] = useState(false)
  
  /** Toast notification hook */
  const { showToast } = useToast()

  // ============================================================================
  // FILE DROP HANDLER
  // ============================================================================
  
  /**
   * Xử lý khi user drop file vào dropzone
   * @param acceptedFiles - Array files được accept
   */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('=== FILE DROP DETECTED ===')
    console.log('Accepted files:', acceptedFiles.map(f => f.name))
    
    setIsValidating(true)
    setErrors({})
    
    acceptedFiles.forEach((file) => {
      console.log(`Processing file: ${file.name} (${file.size} bytes)`)
      
      // Validate file trước khi xử lý
      const fileValidation = validateImportFile(file)
      if (!fileValidation.success) {
        console.error('File validation failed:', fileValidation.errors)
        setErrors(fileValidation.errors as Record<string, string[]>)
        setIsValidating(false)
        showToast(`File validation failed: ${fileValidation.errors.file?.join(', ')}`, 'error')
        return
      }
      
      // Xác định loại file và xử lý tương ứng
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      console.log('File extension:', fileExtension)
      
              switch (fileExtension) {
          case 'csv':
            processCSV(file, setErrors, setIsValidating, onImport, showToast)
            break
          case 'xlsx':
          case 'xls':
            processExcel(file, setErrors, setIsValidating, onImport, showToast)
            break
          case 'json':
            processJSON(file, setErrors, setIsValidating, onImport, showToast)
            break
        default:
          const errorMsg = 'Unsupported file format. Please use CSV, Excel (.xlsx, .xls), or JSON files.'
          console.error(errorMsg)
          setErrors({ file: [errorMsg] })
          setIsValidating(false)
          showToast(errorMsg, 'error')
      }
    })
  }, [onImport, showToast])

  // ============================================================================
  // DROPZONE CONFIGURATION
  // ============================================================================
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/json': ['.json']
    },
    multiple: false
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
          <h4 className="title is-4 mb-0 is-size-6">Import Products</h4>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">
          {onClose && (
            <button 
              className="button is-small is-danger is-light is-size-7"
              onClick={onClose}
            >
              Close
            </button>
          )}
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
      className={`dropzone ${isDragActive ? 'is-active' : ''} ${hasImportError(errors, 'file') ? 'has-error' : ''}`}
      style={{
        border: `2px dashed ${hasImportError(errors, 'file') ? '#ff3860' : '#ccc'}`,
        borderRadius: '4px',
        padding: '40px 20px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa',
        marginTop: '20px'
      }}
    >
      <input {...getInputProps()} />
      
      {/* Upload Icon */}
      <div className="icon is-large mb-3">
        <i className="material-icons is-size-7" style={{ fontSize: '48px', color: '#666' }}>
          cloud_upload
        </i>
      </div>
      
      {/* Dropzone Text */}
      <p className="is-size-7 mb-2">
        {isDragActive 
          ? 'Drop the file here...' 
          : 'Drag & drop files here, or click to select'
        }
      </p>
      
      {/* Supported Formats */}
      <p className="is-size-7 has-text-grey-light">
        Supported formats: CSV, Excel (.xlsx, .xls), JSON
      </p>
      
      {/* Error Display */}
      {hasImportError(errors, 'file') && (
        <p className="help is-danger is-size-7 mt-2">
          {getImportError(errors, 'file')}
        </p>
      )}
    </div>
  )

  /**
   * Render documentation section
   */
  const renderDocumentation = () => (
    <div className="content is-size-7 mt-4">
      {/* File Format Requirements */}
      <h5 className="title is-5 is-size-7">File Format Requirements:</h5>
      <ul className="is-size-7">
        <li><strong>CSV:</strong> First row should contain headers. Papa Parse will automatically detect and parse CSV format.</li>
        <li><strong>JSON:</strong> Array of product objects with required fields</li>
        <li><strong>Excel:</strong> First sheet should contain product data with headers</li>
      </ul>
      
      {/* Required Fields */}
      <h5 className="title is-5 is-size-7">Required Fields:</h5>
      <ul className="is-size-7">
        <li><code>productSku</code> (required) - Product SKU identifier</li>
        <li><code>name</code> (required) - Product name</li>
        <li><code>description</code> (optional) - Product description</li>
        <li><code>category</code> (optional, default: "Tumbler") - Product category</li>
        <li><code>fulfillmentTime</code> (optional, default: "1-2 days") - Fulfillment time</li>
                    <li><code>price</code> or <code>priceHistory</code> (optional) - Product price (format: number, e.g., 8.99, 25, 19.5)</li>
        <li><code>supplier</code> (optional, comma-separated) - Product suppliers</li>
        <li><code>productStatus</code> (optional, default: "In Stock") - Stock status</li>
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
        {renderDocumentation()}
      </div>
    </div>
  )
}

export default ImportProduct