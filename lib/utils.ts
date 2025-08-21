import { Order } from '@/constants';

// Calculate total quantity for a single order based on lineItems
export const calculateOrderTotalQuantity = (order: Order): number => 
  order.lineItems.reduce((total, item) => total + item.quantity, 0);

// Calculate total quantity for all orders based on lineItems
export const calculateAllOrdersTotalQuantity = (orders: Order[]): number => 
  orders.reduce((total, order) => total + calculateOrderTotalQuantity(order), 0);

// Calculate total cost for a single order based on lineItems
export const calculateOrderTotalCost = (order: Order): number => 
  order.lineItems.reduce((total, item) => {
    const cost = parseFloat(item.cost.replace('$', ''));
    return total + (cost * item.quantity);
  }, 0);

// Calculate total cost for all orders based on lineItems
export const calculateAllOrdersTotalCost = (orders: Order[]): number => 
  orders.reduce((total, order) => total + calculateOrderTotalCost(order), 0);

// Generic function to filter orders by status
const filterOrdersByStatus = (orders: Order[], status: string): Order[] => 
  orders.filter(order => order.status.toLowerCase() === status);

// Status filter functions
export const calculateAllOrderCreateStatus = (orders: Order[]): Order[] => 
  filterOrdersByStatus(orders, "create");

export const calculateAllOrderProcessStatus = (orders: Order[]): Order[] => 
  filterOrdersByStatus(orders, "process");

export const calculateAllOrderCompleteStatus = (orders: Order[]): Order[] => 
  filterOrdersByStatus(orders, "done");

export const calculateAllOrderCancelStatus = (orders: Order[]): Order[] => 
  filterOrdersByStatus(orders, "cancel");

export const calculateAllOrderErrorStatus = (orders: Order[]): Order[] => 
  filterOrdersByStatus(orders, "error");

export const calculateAllOrderDuplicateStatus = (orders: Order[]): Order[] => 
  filterOrdersByStatus(orders, "duplicate");

