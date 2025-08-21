import { Order } from '@/constants';
import { Product } from '@/types/product';

declare global {
  interface Window {
    updateFilteredOrders?: (orders: Order[]) => void;
    currentStatusFilter?: string;
    imageHoverTimeout?: NodeJS.Timeout | null;
    updateProducts?: (products: Product[]) => void;
  }
}

export {}; 