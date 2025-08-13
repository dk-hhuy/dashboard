'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { orders, Order } from '../../constants';

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

  // ===== RENDER =====
  return (
    <div className="box has-background-white">
      <div className="is-flex is-align-items-center" style={{ 
        gap: '0.5rem',
        width: '100%',
        overflowX: 'auto',
        paddingBottom: '0.5rem'
      }}>
        {/* Search Input */}
        <div style={{ flex: '2', minWidth: '250px', flexShrink: 0 }}>
          <div className="field">
            <div className="control has-icons-left">
              <input
                type="text"
                placeholder="Keywords: order number, line item, tracking"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input has-background-white has-text-black"
              />
              <span className="icon is-left">
                <i className="material-icons">search</i>
              </span>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div style={{ flex: '0 0 140px', minWidth: '140px', flexShrink: 0 }}>
          <div className="field">
            <div className="control">
              <div className="select is-fullwidth">
                <select 
                  value={statusQuery} 
                  onChange={(e) => setStatusQuery(e.target.value)}
                  className="has-background-white has-text-black"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div style={{ flex: '3', minWidth: '600px', flexShrink: 0 }}>
          <div className="field">
            <div className="control">
              <div className="field has-addons" style={{ width: '100%' }}>
                <div className="control" style={{ flex: '0 0 auto' }}>
                  <span className="button is-static has-background-white has-text-black">
                    <span className="icon">
                      <i className="material-icons">calendar_today</i>
                    </span>
                    <span>Time</span>
                  </span>
                </div>
                <div className="control" style={{ flex: '1' }}>
                  <input
                    type="date"
                    value={fromDateQuery}
                    onChange={(e) => setFromDateQuery(e.target.value)}
                    className="input has-background-white has-text-black"
                    placeholder="From date"
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="control" style={{ flex: '0 0 auto' }}>
                  <span className="button is-static has-background-white has-text-black">-</span>
                </div>
                <div className="control" style={{ flex: '1' }}>
                  <input
                    type="date"
                    value={toDateQuery}
                    onChange={(e) => setToDateQuery(e.target.value)}
                    className="input has-background-white has-text-black"
                    placeholder="To date"
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="control" style={{ flex: '0 0 auto' }}>
                  <button
                    className="button has-background-white has-text-black"
                    onClick={(e) => handleDateChange(e, 'prev')}
                  >
                    <span className="icon">
                      <i className="material-icons">chevron_left</i>
                    </span>
                  </button>
                </div>
                <div className="control" style={{ flex: '0 0 auto' }}>
                  <button
                    className="button has-background-white has-text-black"
                    onClick={(e) => handleDateChange(e, 'next')}
                  >
                    <span className="icon">
                      <i className="material-icons">chevron_right</i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div style={{ flex: '0 0 120px', minWidth: '120px', flexShrink: 0 }}>
          <div className="field">
            <div className="control">
              <button
                onClick={hasActiveFilters ? handleClearAll : undefined}
                className={`button is-fullwidth ${hasActiveFilters ? 'is-danger' : 'is-primary'}`}
              >
                <span className="icon">
                  <i className="material-icons">
                    {hasActiveFilters ? 'clear' : 'search'}
                  </i>
                </span>
                <span>{hasActiveFilters ? 'Clear All' : 'Search'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOrder;