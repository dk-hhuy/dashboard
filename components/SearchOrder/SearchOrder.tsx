'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { orders, Order } from '../../constants';
import styles from './SearchOrder.module.css';

// ===== TYPES =====
interface SearchOrderProps {
  onFilterChange?: (filters: Order[]) => void;
}

// ===== CONSTANTS =====
const DEBOUNCE_DELAY = 300;
const CLEAR_DELAY = 100;
const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Create', label: 'Create' },
  { value: 'Process', label: 'Process' },
  { value: 'Done', label: 'Done' },
  { value: 'Cancel', label: 'Cancel' },
  { value: 'Error', label: 'Error' },
  { value: 'Duplicate', label: 'Duplicate' }
];

// ===== MAIN COMPONENT =====
const SearchOrder: React.FC<SearchOrderProps> = ({ onFilterChange }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ===== STATE MANAGEMENT =====
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [statusQuery, setStatusQuery] = useState<string>(searchParams.get('status') || '');
  const [fromDateQuery, setFromDateQuery] = useState<string>(searchParams.get('fromDate') || '');
  const [toDateQuery, setToDateQuery] = useState<string>(searchParams.get('toDate') || '');
  const [isClearing, setIsClearing] = useState<boolean>(false);

  // ===== COMPUTED VALUES =====
  const hasActiveFilters = useMemo(() => 
    searchQuery || statusQuery || fromDateQuery || toDateQuery, 
    [searchQuery, statusQuery, fromDateQuery, toDateQuery]
  );

  // ===== FILTER LOGIC =====
  const filterOrders = useCallback((orders: Order[]) => {
    let filteredOrders = [...orders];
    
    // Filter by search keywords
    if (searchQuery) {
      const tokens = Array.from(new Set(
        searchQuery
          .split(/[\s,]+/)
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      ));

      if (tokens.length > 0) {
        filteredOrders = filteredOrders.filter((order) => {
          return tokens.some((token) =>
            order.orderId.toLowerCase().includes(token) ||
            order.shippingAddress.toLowerCase().includes(token) ||
            order.lineItems.some((item) =>
              item.itemId.toLowerCase().includes(token) ||
              item.trackingNo.toLowerCase().includes(token) ||
              item.sku.toLowerCase().includes(token)
            )
          );
        });
      }
    }

    // Filter by status
    if (statusQuery) {
      filteredOrders = filteredOrders.filter((order) => order.status === statusQuery);
    }

    // Filter by date range
    if (fromDateQuery || toDateQuery) {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDateParts = order.createdAt.split(',')[0].split('/');
        const orderDate = new Date(
          parseInt(orderDateParts[2]), // year
          parseInt(orderDateParts[1]) - 1, // month (0-indexed)
          parseInt(orderDateParts[0]) // day
        );
        
        const from = fromDateQuery ? new Date(fromDateQuery + 'T00:00:00') : null;
        const to = toDateQuery ? new Date(toDateQuery + 'T23:59:59') : null;
        
        if (from && to) {
          return orderDate >= from && orderDate <= to;
        } else if (from) {
          return orderDate >= from;
        } else if (to) {
          return orderDate <= to;
        }
        return true;
      });
    }
    
    return filteredOrders;
  }, [searchQuery, statusQuery, fromDateQuery, toDateQuery]);

  // ===== URL UPDATE HELPERS =====
  const updateUrlParam = useCallback((key: string, value: string) => {
    const newUrl = value 
      ? formUrlQuery({ params: searchParams.toString(), key, value })
      : removeKeysFromUrlQuery({ params: searchParams.toString(), keysToRemove: [key] });
    router.push(newUrl, { scroll: false });
  }, [searchParams, router]);

  // ===== EFFECTS =====
  useEffect(() => {
    const filteredOrders = filterOrders(orders);
    onFilterChange?.(filteredOrders);
  }, [filterOrders, onFilterChange]);

  // Debounced search effect
  useEffect(() => {
    if (isClearing) return;
    
    const delayDebounceFn = setTimeout(() => {
      updateUrlParam('search', searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, updateUrlParam, isClearing]);

  // Status filter effect
  useEffect(() => {
    if (isClearing) return;
    updateUrlParam('status', statusQuery);
  }, [statusQuery, updateUrlParam, isClearing]);

  // Date range effects
  useEffect(() => {
    if (isClearing) return;
    updateUrlParam('fromDate', fromDateQuery);
  }, [fromDateQuery, updateUrlParam, isClearing]);

  useEffect(() => {
    if (isClearing) return;
    updateUrlParam('toDate', toDateQuery);
  }, [toDateQuery, updateUrlParam, isClearing]);

  // ===== EVENT HANDLERS =====
  const handleDateChange = useCallback((e: React.MouseEvent, direction: 'prev' | 'next') => {
    e.preventDefault();
    
    const currentFromDate = fromDateQuery ? new Date(fromDateQuery) : new Date();
    const currentToDate = toDateQuery ? new Date(toDateQuery) : new Date();
    
    const dayChange = direction === 'prev' ? -1 : 1;
    currentFromDate.setDate(currentFromDate.getDate() + dayChange);
    currentToDate.setDate(currentToDate.getDate() + dayChange);
    
    const newFromDate = currentFromDate.toISOString().split('T')[0];
    const newToDate = currentToDate.toISOString().split('T')[0];
    
    setFromDateQuery(newFromDate);
    setToDateQuery(newToDate);
  }, [fromDateQuery, toDateQuery]);

  const handleClearAll = useCallback(() => {
    setIsClearing(true);
    
    setSearchQuery('');
    setStatusQuery('');
    setFromDateQuery('');
    setToDateQuery('');
    
    router.push('/', { scroll: false });
    
    setTimeout(() => {
      setIsClearing(false);
    }, CLEAR_DELAY);
  }, [router]);

  // ===== RENDER FUNCTIONS =====
  const renderSearchInput = () => (
    <div className={styles.searchInputWrapper}>
      <div className={styles.searchInputGroup}>
        <div className={styles.searchIconInput}>
          <i className="material-icons">search</i>
        </div>
        <input
          type="text"
          placeholder="Keywords: order number, line item, tracking"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>
    </div>
  );

  const renderStatusFilter = () => (
    <div className={styles.statusFilterWrapper}>
      <div className={styles.statusLabel}>Status</div>
      <select 
        value={statusQuery} 
        onChange={(e) => setStatusQuery(e.target.value)}
        className={styles.statusSelect}
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderDateFilter = () => (
    <div className={styles.dateRangeWrapper}>
      <div className={styles.timeLabelGroup}>
        <div className={styles.calendarIcon}>
          <i className="material-icons">calendar_today</i>
        </div>
        <div className={styles.timeLabelText}>Time</div>
      </div>
      
      <div className={styles.navLabelGroup}>
        <input
          type="date"
          value={fromDateQuery}
          onChange={(e) => setFromDateQuery(e.target.value)}
          className={styles.dateInput}
          placeholder="From date"
        />
        <div className={styles.dateSeparator}>-</div>
        <input
          type="date"
          value={toDateQuery}
          onChange={(e) => setToDateQuery(e.target.value)}
          className={styles.dateInput}
          placeholder="To date"
        />
        <button
          className={styles.navButton}
          onClick={(e) => handleDateChange(e, 'prev')}
        >
          <i className="material-icons">chevron_left</i>
        </button>
        <button
          className={styles.navButton}
          onClick={(e) => handleDateChange(e, 'next')}
        >
          <i className="material-icons">chevron_right</i>
        </button>
      </div>
    </div>
  );

  const renderSearchButton = () => (
    <button
      onClick={hasActiveFilters ? handleClearAll : undefined}
      className={`${styles.searchButton} ${hasActiveFilters ? styles.isDanger : ''}`}
    >
      <div className={styles.searchIcon}>
        <i className="material-icons">
          {hasActiveFilters ? 'clear' : 'search'}
        </i>
      </div>
      {hasActiveFilters ? 'Clear All' : 'Search'}
    </button>
  );

  // ===== RENDER =====
  return (
    <div className={styles.searchOrderContainer}>
      {renderSearchInput()}
      {renderStatusFilter()}
      {renderDateFilter()}
      {renderSearchButton()}
    </div>
  );
};

export default SearchOrder;