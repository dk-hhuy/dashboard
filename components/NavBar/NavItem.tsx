'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { navLink, dropdownOptions, NavLink } from '../../constants';
import styles from './NavBar.module.css';

const DROPDOWN_FIELDS = { 
  'Fulfillment': 'fulfillment', 
  'Analytics': 'analytics', 
  'Google Ads': 'googleAds', 
  'Tools': 'tools' 
} as const;

const NavItem = () => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const calculateDropdownPosition = useCallback((label: string) => {
    const dropdownElement = dropdownRefs.current[label];
    const dropdownMenu = dropdownElement?.querySelector('.navbar-dropdown') as HTMLElement;
    
    if (dropdownElement && dropdownMenu) {
      const rect = dropdownElement.getBoundingClientRect();
      const dropdownWidth = Math.min(250, Math.max(200, rect.width));
      
      dropdownMenu.style.top = `${rect.bottom + 5}px`;
      dropdownMenu.style.left = `${rect.left}px`;
      dropdownMenu.style.width = `${dropdownWidth}px`;
    }
  }, []);

  const handleMouseEnter = useCallback((label: string) => {
    setActiveDropdown(label);
    setTimeout(() => calculateDropdownPosition(label), 0);
  }, [calculateDropdownPosition]);

  const handleMouseLeave = useCallback((label: string) => {
    setTimeout(() => setActiveDropdown(prev => prev === label ? null : prev), 100);
  }, []);

  useEffect(() => {
    const handleScroll = () => activeDropdown && calculateDropdownPosition(activeDropdown);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [activeDropdown, calculateDropdownPosition]);

  const renderDropdownItem = useCallback((link: NavLink) => {
    const isTools = link.label === 'Tools';
    
    return (
      <div
        className={`navbar-item has-dropdown ${isTools ? styles.toolsNavItem : ''}`}
        onMouseEnter={() => handleMouseEnter(link.label)}
        onMouseLeave={() => handleMouseLeave(link.label)}
        ref={(el) => {
          dropdownRefs.current[link.label] = el;
        }}
      >
        <a
          className={`navbar-link ${isTools ? 'tools-navbar-link' : ''}`}
          role="button"
          aria-haspopup="true"
          aria-expanded={activeDropdown === link.label ? 'true' : 'false'}
        >
          <span className={`icon ${isTools ? 'tools-navbar-icon' : ''}`}>
            <i className="material-icons">{link.icon}</i>
          </span>
          <span className={isTools ? 'tools-navbar-text' : ''}>
            {link.label}
          </span>
        </a>
        
        <div 
          className={`navbar-dropdown is-right ${styles.navbarStartDropdown}`}
          style={{ display: activeDropdown === link.label ? 'block' : 'none' }}
          onMouseEnter={() => setActiveDropdown(link.label)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          {dropdownOptions[link.label]?.map((option, optionIndex) => (
            <a 
              key={optionIndex}
              className={isTools ? "dropdown-item" : "navbar-item"}
              href={option.value}
            >
              <span className="icon is-small">
                <i className="material-icons">{option.icon}</i>
              </span>
              <span>{option.label}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }, [activeDropdown, handleMouseEnter, handleMouseLeave]);

  const renderNavItem = useCallback((link: NavLink, index: number) => {
    const field = DROPDOWN_FIELDS[link.label as keyof typeof DROPDOWN_FIELDS];
    const isActive = pathname === link.href;
    
    if (field) return renderDropdownItem(link);

    return (
      <Link 
        key={index} 
        href={link.href} 
        className={`navbar-item ${isActive ? styles.activeNavItem : ''}`}
      >
        <span className="icon">
          <i className="material-icons">{link.icon}</i>
        </span>
        <span>{link.label}</span>
      </Link>
    );
  }, [pathname, renderDropdownItem]);

  return (
    <>
      {navLink.map((link, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.1, delay: index * 0.1, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {renderNavItem(link, index)}
        </motion.div>
      ))}
    </>
  );
};

export default NavItem;
