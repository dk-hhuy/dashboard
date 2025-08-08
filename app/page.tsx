'use client'

import React, { useState, useCallback } from 'react';
import NavBar from "../components/NavBar";
import ProtectedRoute from "../components/ProtectedRoute";
import ItemInfo from "../components/ItemInfo";
import FilterTable from "../components/FilterTable";
import ShowChart from "../components/ShowChart";
import SearchOrder from "../components/SearchOrder";
import { orders, Order } from '../constants';
import { motion } from 'framer-motion';

const Home = () => {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  
  const handleSearchFilterChange = useCallback((newFilteredOrders: Order[]) => {
    setFilteredOrders(newFilteredOrders);
  }, []);
  
  return (
    <ProtectedRoute>
      <div>
        <NavBar />
        
        <div className="table-container mt-4">
          <div className="has-background-white p-4" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <motion.h4
              className="title is-4 has-text-black mb-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4 }}
            >
              ALUFFM DASHBOARD
            </motion.h4>
            <div className="filter-table-wrapper">
              <FilterTable />
            </div>
            <ShowChart />
          </div>
          <SearchOrder onFilterChange={handleSearchFilterChange} />
        </div>
        
        <ItemInfo orders={filteredOrders} />
      </div>
    </ProtectedRoute>
  );
}

export default Home;
