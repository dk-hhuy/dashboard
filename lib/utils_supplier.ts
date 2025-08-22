import { suppliers } from '@/constants/index_product'

interface Supplier {
  name: string;
  country: string;
}

export const getAllSuppliers = (suppliersData?: Supplier[]) => {
    const data = suppliersData || suppliers;
    return data.length;
}

export const findSupplierName = (supplier: string, suppliersData?: Supplier[]) => {
    const data = suppliersData || suppliers;
    const supplierName = data.find(item => item.name === supplier);
    return supplierName?.name;
}

export const findSupplierCountry = (country: string, suppliersData?: Supplier[]) => {
    const data = suppliersData || suppliers;
    const supplierCountry = data.find(item => item.country === country);
    return supplierCountry?.country;
}

export const addSupplier = (name: string, country: string, suppliersData?: Supplier[]) => {
    const data = suppliersData || suppliers;
    const newSupplier = { name, country };
    return [...data, newSupplier];
}

export const deleteSupplier = (name: string, country: string, suppliersData?: Supplier[]) => {
    const data = suppliersData || suppliers;
    const index = data.findIndex(item => item.name === name && item.country === country);
    if (index !== -1) {
        return data.filter((_, i) => i !== index);
    }
    return data;
}

export const updateSupplier = (oldName: string, oldCountry: string, newName: string, newCountry: string, suppliersData?: Supplier[]) => {
    const data = suppliersData || suppliers;
    const index = data.findIndex(item => item.name === oldName && item.country === oldCountry);
    if (index !== -1) {
        return data.map((item, i) => i === index ? { name: newName, country: newCountry } : item);
    }
    return data;
}

export const updateSupplierByIndex = (index: number, newName: string, newCountry: string, suppliersData?: Supplier[]) => {
    const data = suppliersData || suppliers;
    if (index >= 0 && index < data.length) {
        return data.map((item, i) => i === index ? { name: newName, country: newCountry } : item);
    }
    return data;
}
