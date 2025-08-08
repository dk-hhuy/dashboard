import { Order } from '../constants';

declare global {
  interface Window {
    updateFilteredOrders: (orders: Order[]) => void;
  }
}

export {}; 