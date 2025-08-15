'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { orders, statusClasses, Order, LineItem } from '../../constants';
import { calculateOrderTotalCost, calculateOrderTotalQuantity } from '../../lib/utils';
import TableResult from '../TableResult';

// ===== TYPES =====
interface ItemInfoProps {
  orders?: Order[];
  className?: string;
}

// ===== CONSTANTS =====
const ITEMS_PER_PAGE = 10;

// ===== HELPER COMPONENTS =====
const HoverZoomModal = React.memo(({ src, isVisible }: { src: string; isVisible: boolean }) => {
  if (!isVisible || typeof window === 'undefined') return null;

  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '80vw',
        maxHeight: '80vh'
      }}
    >
      <Image 
        src={src} 
        alt="zoomed" 
        width={300} 
        height={300} 
        style={{ 
          objectFit: 'contain',
          width: '100%',
          height: '100%'
        }} 
      />
    </div>
  );

  return createPortal(modalContent, document.body);
});

HoverZoomModal.displayName = 'HoverZoomModal';

// ===== TABLE ROW COMPONENTS =====
const OrderHeaderRow = React.memo(function OrderHeaderRow({
  order,
  getStatusTagClass,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  order: Order;
  getStatusTagClass: (status: string) => string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const totalQuantity = useMemo(() => calculateOrderTotalQuantity(order), [order]);
  const totalCost = useMemo(() => calculateOrderTotalCost(order), [order]);

  return (
    <motion.tr
      className={`${isHovered ? 'has-background-light' : ''} is-size-7`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      animate={isHovered ? { x: -10 } : { x: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <td className="is-size-7">
        <div className="is-flex is-align-items-center">
          <label className="checkbox is-size-7">
            <input type="checkbox" />
          </label>
          <strong className="ml-2 mr-2 is-size-7">{order.orderId}</strong>
        </div>
      </td>
      <td><span className={`${getStatusTagClass(order.status)} is-size-7`}>{order.status}</span></td>
      <td><strong className="is-size-7">{order.lineItems.length} items</strong></td>
      <td><strong className="is-size-7">{totalQuantity}</strong></td>
      <td><strong className="is-size-7">${totalCost.toFixed(2)}</strong></td>
      <td><strong className="is-size-7">{order.shippingAddress}</strong></td>
      <td></td>
      <td><strong className="is-size-7">{order.createdAt}</strong></td>
    </motion.tr>
  );
});

const LineItemRow = React.memo(function LineItemRow({
  orderId,
  item,
  itemIndex,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onImageHover,
  onImageLeave,
}: {
  orderId: string;
  item: LineItem;
  itemIndex: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onImageHover: (src: string) => void;
  onImageLeave: () => void;
}) {
  const parsedCost = useMemo(() => parseFloat(item.cost.replace('$', '')).toFixed(2), [item.cost]);

  const renderImage = (src: string, alt: string, size: number) => (
    <div 
      className="image image-hover is-flex is-align-items-center"
      onMouseEnter={() => onImageHover(src)}
      onMouseLeave={onImageLeave}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        cursor: 'pointer',
        display: 'inline-block',
        marginRight: '0.5rem'
      }}
    >
      <Image 
        src={src} 
        alt={alt} 
        width={size}
        height={size}
        className="image"
      />
    </div>
  );

  return (
    <motion.tr
      key={`${orderId}-${itemIndex}`}
      className={`${isHovered ? 'has-background-light' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      animate={isHovered ? { x: -10 } : { x: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <td className="is-size-7"></td>
      <td className="is-size-7"></td>
      <td><span className="is-size-7">{item.itemId}</span></td>
      <td><span className="is-size-7">{item.quantity}</span></td>
      <td><span className="is-size-7">${parsedCost}</span></td>
      <td>
        <div className="is-size-7">
          Carrier: {item.carrier} | {' '}
          <Link href={`/items/${item.trackingNo}`} className="is-size-7">
            {item.trackingNo}
          </Link>
        </div>
      </td>
      <td><span className="is-size-7">SKU: {item.sku}</span></td>
      <td>
        <div className="level is-mobile">
          <div className="level-left">
            {item.images?.double && renderImage(item.images.double, 'double', 30)}
            {item.images?.love && renderImage(item.images.love, 'love', 20)}
          </div>
        </div>
      </td>
    </motion.tr>
  );
});

// ===== MAIN COMPONENT =====
const ItemInfo: React.FC<ItemInfoProps> = ({ orders: propOrders, className }) => {
  // ===== STATE MANAGEMENT =====
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState(propOrders || orders);
  const [hoveredOrderId, setHoveredOrderId] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  // ===== COMPUTED VALUES =====
  const { startIndex, endIndex, displayOrders } = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return {
      startIndex: start,
      endIndex: end,
      displayOrders: filteredOrders.slice(start, end),
    };
  }, [currentPage, filteredOrders]);

  // ===== EFFECTS =====
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOrders]);

  useEffect(() => {
    if (propOrders) {
      setFilteredOrders(propOrders);
    }
  }, [propOrders]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (window.imageHoverTimeout) {
        clearTimeout(window.imageHoverTimeout);
        window.imageHoverTimeout = null;
      }
    };
  }, []);

  // ===== EVENT HANDLERS =====
  const updateFilteredOrders = useCallback((newOrders: Order[]) => {
    setFilteredOrders(newOrders);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.updateFilteredOrders = updateFilteredOrders;
    }
  }, [updateFilteredOrders]);

  const getStatusTagClass = useCallback((status: string) => {
    return statusClasses[status.toLowerCase() as keyof typeof statusClasses] || 'tag is-success';
  }, []);

  const handleImageHover = useCallback((src: string) => {
    // Clear any existing timeout
    if (window.imageHoverTimeout) {
      clearTimeout(window.imageHoverTimeout);
    }
    
    // Set a small delay to prevent flickering
    window.imageHoverTimeout = setTimeout(() => {
      setHoveredImage(src);
    }, 100);
  }, []);

  const handleImageLeave = useCallback(() => {
    // Clear timeout if exists
    if (window.imageHoverTimeout) {
      clearTimeout(window.imageHoverTimeout);
      window.imageHoverTimeout = null;
    }
    
    // Clear image immediately
    setHoveredImage(null);
  }, []);

  const handleOrderHover = useCallback((orderId: string) => {
    setHoveredOrderId(orderId);
  }, []);

  const handleOrderLeave = useCallback(() => {
    setHoveredOrderId(null);
  }, []);

  // ===== RENDER =====
  return (
    <div className="card-content is-fullwidth has-shadow is-size-7" style={{ border: '1px solid #dbdbdb', borderTop: 'none' }}>
      <div className="table-container">
        <table className="table is-fullwidth is-striped is-hoverable is-bordered is-size-7">
          <thead>
            <tr>
              <th className="is-size-7">ALL ORDERS</th>
              <th className="is-size-7">STATUS</th>
              <th className="is-size-7">LINE ITEMS</th>
              <th className="is-size-7">QUANTITY</th>
              <th className="is-size-7">TOTAL COST</th>
              <th className="is-size-7">SHIPPING ADDRESS</th>
              <th className="is-size-7">DETAILS</th>
              <th className="is-size-7">CREATED AT</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.map((order) => (
              <React.Fragment key={order.orderId}>
                <OrderHeaderRow
                  order={order}
                  getStatusTagClass={getStatusTagClass}
                  isHovered={hoveredOrderId === order.orderId}
                  onMouseEnter={() => handleOrderHover(order.orderId)}
                  onMouseLeave={handleOrderLeave}
                />
                
                {order.lineItems.map((item: LineItem, itemIndex: number) => (
                  <LineItemRow
                    key={`${order.orderId}-${itemIndex}`}
                    orderId={order.orderId}
                    item={item}
                    itemIndex={itemIndex}
                    isHovered={hoveredOrderId === order.orderId}
                    onMouseEnter={() => handleOrderHover(order.orderId)}
                    onMouseLeave={handleOrderLeave}
                    onImageHover={handleImageHover}
                    onImageLeave={handleImageLeave}
                  />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      <TableResult 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={filteredOrders.length}
      />

      {hoveredImage && (
        <HoverZoomModal src={hoveredImage} isVisible={true} />
      )}
    </div>
  );
};

export default ItemInfo;