'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { orderStatus, orders, Order } from '../../constants';

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
    <div className="level is-mobile is-hidden-touch is-size-7">
      <div className="level-left">
        {orderStatus.map((status) => (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            key={status.label}
            className="level-item mr-2 is-size-7"
          >
            <div className="tags has-addons is-size-7">
              <span
                className="tag is-dark is-size-7"
                style={{
                  cursor: 'pointer'
                }}
                onClick={() => handleFilter(status.label)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFilter(status.label);
                  }
                }}
              >
                {status.label}
              </span>
              <span
                className="tag is-size-7"
                style={{
                  background: status.color.background,
                  color: status.color.text,
                  cursor: 'pointer'
                }}
                onClick={() => handleFilter(status.label)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleFilter(status.label);
                  }
                }}
              >
                {status.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FilterTable;