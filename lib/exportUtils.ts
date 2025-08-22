import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Product } from '@/types/product';

// Export format types
export type ExportFormat = 'json' | 'csv' | 'excel';

// Interface for export options
export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeHeaders?: boolean;
}

// Convert product data to flat structure for CSV/Excel
const flattenProductData = (products: Product[]) => {
  return products.map(product => {
    const baseData: Record<string, string> = {
      'Product SKU': product.productSku,
      'Name': product.name,
      'Description': product.description,
      'Category': product.category,
      'Fulfillment Time': product.fulfillmentTime,
      'Status': product.productStatus,
      'Main Image': product.mainimage,
      'Suppliers': Array.isArray(product.supplier) ? product.supplier.join(', ') : product.supplier,
    };

    // Add price history data
    if (product.priceHistory && product.priceHistory.length > 0) {
      // Get the latest price (last item in array as we push new prices to the end)
      const latestPrice = product.priceHistory[product.priceHistory.length - 1];
      baseData['Latest Price'] = latestPrice.oldCost;
      baseData['Latest Date'] = latestPrice.effectiveDate;
      
      // Add min/max prices
      const prices = product.priceHistory.map(p => parseFloat(p.oldCost.replace('$', '')));
      baseData['Min Price'] = `$${Math.min(...prices).toFixed(2)}`;
      baseData['Max Price'] = `$${Math.max(...prices).toFixed(2)}`;
    } else {
      baseData['Latest Price'] = '$0.00';
      baseData['Latest Date'] = '';
      baseData['Min Price'] = '$0.00';
      baseData['Max Price'] = '$0.00';
    }

    return baseData;
  });
};

// Export to JSON format
export const exportToJSON = (products: Product[], filename: string = 'products') => {
  const data = JSON.stringify(products, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  saveAs(blob, `${filename}.json`);
  
  // Also log to console for debugging
  console.log(`Exporting ${products.length} products to JSON:`);
  console.log(data);
};

// Export to CSV format
export const exportToCSV = (products: Product[], filename: string = 'products') => {
  const flatData = flattenProductData(products);
  
  if (flatData.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(flatData[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...flatData.map(row => 
      headers.map(header => {
        const value = row[header as keyof typeof row];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
  
  console.log(`Exporting ${products.length} products to CSV: ${filename}.csv`);
};

// Export to Excel format
export const exportToExcel = (products: Product[], filename: string = 'products') => {
  const flatData = flattenProductData(products);
  
  if (flatData.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(flatData);

  // Auto-size columns
  const columnWidths = Object.keys(flatData[0]).map(key => ({
    wch: Math.max(key.length, ...flatData.map(row => String(row[key as keyof typeof row]).length))
  }));
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}.xlsx`);
  
  console.log(`Exporting ${products.length} products to Excel: ${filename}.xlsx`);
};

// Main export function
export const exportProducts = (
  products: Product[], 
  format: ExportFormat = 'json',
  filename?: string
) => {
  const defaultFilename = `products_${new Date().toISOString().split('T')[0]}`;
  const finalFilename = filename || defaultFilename;

  switch (format) {
    case 'json':
      exportToJSON(products, finalFilename);
      break;
    case 'csv':
      exportToCSV(products, finalFilename);
      break;
    case 'excel':
      exportToExcel(products, finalFilename);
      break;
    default:
      console.warn(`Unsupported format: ${format}`);
  }
};

// Export selected products with format selection
export const exportSelectedProducts = (
  allProducts: Product[],
  selectedProductSkus: Set<string>,
  format: ExportFormat = 'json',
  filename?: string
) => {
  const selectedProducts = allProducts.filter(product => 
    selectedProductSkus.has(product.productSku)
  );

  if (selectedProducts.length === 0) {
    console.warn('No products selected for export');
    return;
  }

  const defaultFilename = `selected_products_${new Date().toISOString().split('T')[0]}`;
  const finalFilename = filename || defaultFilename;

  exportProducts(selectedProducts, format, finalFilename);
  
  return selectedProducts.length;
}; 