import { Order } from '../constants';

declare global {
  interface Window {
    updateFilteredOrders?: (orders: Order[]) => void;
    currentStatusFilter?: string;
    imageHoverTimeout?: NodeJS.Timeout | null;
  }
}

export {}; 