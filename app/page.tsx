'use client'

import React, { useState, useCallback, useEffect } from 'react';
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
  const [searchFilteredOrders, setSearchFilteredOrders] = useState(orders);
  
  const handleSearchFilterChange = useCallback((newFilteredOrders: Order[]) => {
    setSearchFilteredOrders(newFilteredOrders);
    // Combine search filter with any active status filter
    if (typeof window !== 'undefined' && window.currentStatusFilter) {
      const statusFiltered = newFilteredOrders.filter(order => 
        window.currentStatusFilter === 'All' || order.status === window.currentStatusFilter
      );
      setFilteredOrders(statusFiltered);
    } else {
      setFilteredOrders(newFilteredOrders);
    }
  }, []);

  // Define window.updateFilteredOrders for FilterTable to use
  useEffect(() => {
    console.log('Setting up window.updateFilteredOrders');
    if (typeof window !== 'undefined') {
      window.updateFilteredOrders = (newFilteredOrders: Order[]) => {
        console.log('window.updateFilteredOrders called with:', newFilteredOrders.length, 'orders');
        window.currentStatusFilter = newFilteredOrders === orders ? 'All' : 
          newFilteredOrders.length > 0 ? newFilteredOrders[0].status : 'All';
        
        // Apply status filter to current search results
        const statusFiltered = searchFilteredOrders.filter(order => 
          window.currentStatusFilter === 'All' || order.status === window.currentStatusFilter
        );
        setFilteredOrders(statusFiltered);
      };
      console.log('window.updateFilteredOrders set successfully');
    }

    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        delete window.updateFilteredOrders;
        delete window.currentStatusFilter;
        console.log('window.updateFilteredOrders cleaned up');
      }
    };
  }, [searchFilteredOrders]);
  
  return (
    <ProtectedRoute>
      <div className="has-background-white" style={{ minHeight: '100vh' }}>
        <NavBar />
        
        <div className="mt-6">
          <div className="box has-background-white">
            <div className="level is-mobile">
              <div className="level-left">
                <motion.h4
                  className="title is-4 mb-0 has-text-black"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4 }}
                >
                  ALUFFM DASHBOARD
                </motion.h4>
                <div className="level-item ml-4">
                  <FilterTable />
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <ShowChart />
                </div>
              </div>
            </div>
          </div>
          <SearchOrder onFilterChange={handleSearchFilterChange} />
        </div>
        
        <ItemInfo orders={filteredOrders} />
      </div>
    </ProtectedRoute>
  );
}

export default Home;
