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
    data.push(newSupplier);
    return data;
}

export const deleteSupplier = (name: string, country: string, suppliersData?: Supplier[]) => {
    const data = suppliersData || suppliers;
    const index = data.findIndex(item => item.name === name && item.country === country);
    if (index !== -1) {
        data.splice(index, 1);
    }
    return data;
}

export const updateSupplier = (oldName: string, oldCountry: string, newName: string, newCountry: string, suppliersData?: Supplier[]) => {
    const data = suppliersData || suppliers;
    const index = data.findIndex(item => item.name === oldName && item.country === oldCountry);
    if (index !== -1) {
        data[index] = { name: newName, country: newCountry };
    }
    return data;
}

export const updateSupplierByIndex = (index: number, newName: string, newCountry: string, suppliersData?: Supplier[]) => {
    const data = suppliersData || suppliers;
    if (index >= 0 && index < data.length) {
        data[index] = { name: newName, country: newCountry };
    }
    return data;
}
