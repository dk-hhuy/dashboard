'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { orderStatus, orders, Order } from '../../constants';
import styles from './FilterTable.module.css';

const FilterTable = () => {
  const handleFilter = (status: string) => {
    if (typeof window !== 'undefined' && window.updateFilteredOrders) {
      if (status === 'All') {
        window.updateFilteredOrders(orders);
      } else {
        const filteredOrders = orders.filter((order: Order) => order.status === status);
        window.updateFilteredOrders(filteredOrders);
      }
    }
  };

  return (
    <div className={styles.filterTableWrapper}>
      <div className={styles.filterTableContainer}>
      {orderStatus.map((status) => {
          const leftButtonStyle = {
            backgroundColor: status.color.background,
            color: status.color.text,
            border: 'none'
          };
          
        const rightButtonStyle = { 
            backgroundColor: status.color.background,
            color: status.color.text,
            border: `1px solid ${status.color.background}`,
            borderLeft: 'none'
        };
        
        return (
            <motion.div 
              initial={{ opacity: 0, y: -50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4 }}
              key={status.label} 
              className="buttons has-addons mr-1 mb-0" 
              onClick={() => handleFilter(status.label)}
            >
            <button className="button is-small has-background-grey-dark has-text-white" style={leftButtonStyle}>
              {status.label}
            </button>
            <button className="button is-small" style={rightButtonStyle}>
              {status.value}
            </button>
          </motion.div>
        );
      })}
      </div>
    </div>
  );
};

export default FilterTable;