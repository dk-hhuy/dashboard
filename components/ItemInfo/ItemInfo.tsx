'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { orders, statusClasses, Order, LineItem } from '../../constants';
import { calculateOrderTotalCost, calculateOrderTotalQuantity } from '../../lib/utils';
import TableResult from '../TableResult';
import styles from './ItemInfo.module.css';

// ===== TYPES =====
interface ItemInfoProps {
  orders?: Order[];
}

// ===== CONSTANTS =====
const ITEMS_PER_PAGE = 10;
const HOVER_ANIMATION = { x: -10 };
const ANIMATION_TRANSITION = { duration: 0.2, ease: "easeInOut" as const };

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
  textClass,
  emptyCellClass,
  getStatusTagClass,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  order: Order;
  textClass: string;
  emptyCellClass: string;
  getStatusTagClass: (status: string) => string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const totalQuantity = useMemo(() => calculateOrderTotalQuantity(order), [order]);
  const totalCost = useMemo(() => calculateOrderTotalCost(order), [order]);

  return (
    <motion.tr
      className={`${emptyCellClass} ${isHovered ? styles.hoveredRow : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      animate={isHovered ? HOVER_ANIMATION : { x: 0 }}
      transition={ANIMATION_TRANSITION}
    >
      <td>
        <label className="checkbox">
          <input type="checkbox" className="mr-1" />
          <strong className={textClass}>{order.orderId}</strong>
        </label>
      </td>
      <td><span className={getStatusTagClass(order.status)}>{order.status}</span></td>
      <td><strong className={textClass}>{order.lineItems.length} items</strong></td>
      <td><strong className={textClass}><span>{totalQuantity}</span></strong></td>
      <td><strong className={textClass}>${totalCost.toFixed(2)}</strong></td>
      <td><strong className={textClass}>{order.shippingAddress}</strong></td>
      <td></td>
      <td><strong><span className={textClass}>{order.createdAt}</span></strong></td>
    </motion.tr>
  );
});

const LineItemRow = React.memo(function LineItemRow({
  orderId,
  item,
  itemIndex,
  contentCellClass,
  emptyCellClass,
  textClass,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onImageHover,
  onImageLeave,
}: {
  orderId: string;
  item: LineItem;
  itemIndex: number;
  contentCellClass: string;
  emptyCellClass: string;
  textClass: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onImageHover: (src: string) => void;
  onImageLeave: () => void;
}) {
  const parsedCost = useMemo(() => parseFloat(item.cost.replace('$', '')).toFixed(2), [item.cost]);

  const renderImage = (src: string, alt: string, size: number, className: string) => (
    <div 
      className={`thumb thumb-${size} ${className}`}
      onMouseEnter={() => onImageHover(src)}
      onMouseLeave={onImageLeave}
    >
      <Image 
        src={src} 
        alt={alt} 
        width={size}
        height={size}
        style={{ 
          objectFit: 'contain',
          width: '100%',
          height: '100%'
        }} 
      />
    </div>
  );

  return (
    <motion.tr
      key={`${orderId}-${itemIndex}`}
      className={isHovered ? styles.hoveredRow : ''}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      animate={isHovered ? HOVER_ANIMATION : { x: 0 }}
      transition={ANIMATION_TRANSITION}
    >
      <td className={emptyCellClass}></td>
      <td className={emptyCellClass}></td>
      <td className={contentCellClass}><span className={textClass}>{item.itemId}</span></td>
      <td className={contentCellClass}><span className={textClass}>{item.quantity}</span></td>
      <td className={contentCellClass}><span className={textClass}>${parsedCost}</span></td>
      <td className={contentCellClass}>
        <div className={textClass}>
          <div className={textClass}>
            Carrier: {item.carrier} | {' '}
            <Link href={`/items/${item.trackingNo}`}>
              {item.trackingNo}
            </Link>
          </div>
        </div>
      </td>
      <td className={contentCellClass}><span className={textClass}>SKU: {item.sku}</span></td>
      <td className={emptyCellClass}>
        <div className="is-flex is-align-items-center">
          {item.images?.double && renderImage(item.images.double, 'double', 40, `${styles.imageHover} mr-2`)}
          {item.images?.love && renderImage(item.images.love, 'love', 30, styles.imageHover)}
        </div>
      </td>
    </motion.tr>
  );
});

// ===== MAIN COMPONENT =====
const ItemInfo: React.FC<ItemInfoProps> = ({ orders: propOrders }) => {
  // ===== CONSTANTS =====
  const emptyCellClass = "has-background-white";
  const contentCellClass = "has-background-grey-lighter";
  const textClass = "has-text-black";

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
    setHoveredImage(src);
  }, []);

  const handleImageLeave = useCallback(() => {
    setHoveredImage(null);
  }, []);

  const handleOrderHover = useCallback((orderId: string) => {
    setHoveredOrderId(orderId);
  }, []);

  const handleOrderLeave = useCallback(() => {
    setHoveredOrderId(null);
  }, []);

  // ===== RENDER FUNCTIONS =====
  const renderTableHeader = () => (
    <thead>
      <tr className="has-background-grey-lighter">
        <th className="has-background-grey-lighter has-text-black">ALL ORDERS</th>
        <th className="has-background-grey-lighter has-text-black">STATUS</th>
        <th className="has-background-grey-lighter has-text-black">LINE ITEMS</th>
        <th className="has-background-grey-lighter has-text-black">QUANTITY</th>
        <th className="has-background-grey-lighter has-text-black">TOTAL COST</th>
        <th className="has-background-grey-lighter has-text-black">SHIPPING ADDRESS</th>
        <th className="has-background-grey-lighter has-text-black">DETAILS</th>
        <th className="has-background-grey-lighter has-text-black">CREATED AT</th>
      </tr>
    </thead>
  );

  const renderOrderRows = () => (
    displayOrders.map((order) => (
      <React.Fragment key={order.orderId}>
        <OrderHeaderRow
          order={order}
          textClass={textClass}
          emptyCellClass={emptyCellClass}
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
            contentCellClass={contentCellClass}
            emptyCellClass={emptyCellClass}
            textClass={textClass}
            isHovered={hoveredOrderId === order.orderId}
            onMouseEnter={() => handleOrderHover(order.orderId)}
            onMouseLeave={handleOrderLeave}
            onImageHover={handleImageHover}
            onImageLeave={handleImageLeave}
          />
        ))}
      </React.Fragment>
    ))
  );

  // ===== RENDER =====
  return (
    <div className={styles.componentContainer}>
      <motion.div 
        className={styles.tableContainer}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <table className="table is-fullwidth is-bordered mb-0">
          {renderTableHeader()}
          <tbody>
            {renderOrderRows()}
          </tbody>
        </table>
      </motion.div>
      
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