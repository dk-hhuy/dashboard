import { products } from '@/constants/index_product';
import { Product } from '@/types/product';

// Product utility functions
export const calculateAllProducts = (productsData?: Product[]) => {
  return productsData || products;
};

export const calculateAllProductsInStock = (productsData?: Product[]) => {
  const data = productsData || products;
  return data.filter(product => product.productStatus === "In Stock");
};

export const calculateAllProductsOutStock = (productsData?: Product[]) => {
  const data = productsData || products;
  return data.filter(product => product.productStatus === "Out Stock");
};

// Find minimum price from specific product
export const findMinPrice = (productSku: string): string => {
  const product = products.find(p => p.productSku === productSku);
  if (!product || !product.priceHistory || product.priceHistory.length === 0) {
    return "$0.00";
  }
  
  const prices = product.priceHistory.map(item => parseFloat(item.oldCost.replace('$', '')));
  const minPrice = Math.min(...prices);
  return `$${minPrice.toFixed(2)}`;
};

// Find maximum price from specific product
export const findMaxPrice = (productSku: string): string => {
  const product = products.find(p => p.productSku === productSku);
  if (!product || !product.priceHistory || product.priceHistory.length === 0) {
    return "$0.00";
  }
  
  const prices = product.priceHistory.map(item => parseFloat(item.oldCost.replace('$', '')));
  const maxPrice = Math.max(...prices);
  return `$${maxPrice.toFixed(2)}`;
};

// Find current price (latest date with lowest price) from specific product
export const findCurrentPrice = (productSku: string): string => {
  const product = products.find(p => p.productSku === productSku);
  if (!product || !product.priceHistory || product.priceHistory.length === 0) {
    return "$0.00";
  }
  
  // Sort by date to get the latest date
  const sortedHistory = [...product.priceHistory].sort((a, b) => 
    new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
  );
  
  const latestDate = sortedHistory[0].effectiveDate;
  
  // Find all prices with the latest date and get the minimum
  const latestDatePrices = product.priceHistory
    .filter(item => item.effectiveDate === latestDate)
    .map(item => parseFloat(item.oldCost.replace('$', '')));
  
  const currentPrice = Math.min(...latestDatePrices);
  return `$${currentPrice.toFixed(2)}`;
};

// Export all products data for constants file
export const exportProductsData = (productsData: Product[]) => {
  const exportData = productsData.map(product => ({
    mainimage: product.mainimage,
    productSku: product.productSku,
    name: product.name,
    description: product.description,
    category: product.category,
    fulfillmentTime: product.fulfillmentTime,
    priceHistory: product.priceHistory,
    supplier: product.supplier,
    productStatus: product.productStatus
  }))
  
  console.log('Export data for constants/index_product.ts:')
  console.log(JSON.stringify(exportData, null, 2))
  
  return exportData
}

// Generate constants file content
export const generateConstantsFileContent = (productsData: Product[]) => {
  const exportData = exportProductsData(productsData)
  
  const fileContent = `export const products = ${JSON.stringify(exportData, null, 2)}`
  
  console.log('Constants file content:')
  console.log(fileContent)
  
  return fileContent
}
