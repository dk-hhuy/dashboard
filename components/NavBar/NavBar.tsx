'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { dropdownOptions } from '../../constants';
import NavItem from './NavItem';

const NavBar = () => {
  const { user } = useAuth();
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);

  const toggleNavDropdown = () => {
    setIsNavDropdownOpen(!isNavDropdownOpen);
  };

  return (
    <nav className="navbar is-white has-shadow is-fixed-top">
      <div className="navbar-brand is-flex is-align-items-center is-justify-content-space-between is-fullwidth">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Link href="/" className="navbar-item">
            <Image src="/images/husble.png" alt="Husble Logo" width={120} height={30} />
          </Link>
        </motion.div>

        {/* User dropdown - ngang hàng với logo trên mobile */}
        <motion.div
          className="navbar-item has-dropdown is-hoverable is-hidden-desktop"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <a className="navbar-link">
            <Image 
              src={user?.avatar || '/images/husble.png'} 
              alt="User Avatar"
              width={32} 
              height={32} 
              className="is-rounded"
            />
            <span className="ml-2">{user?.name || 'User'}</span>
          </a>
          <div className="navbar-dropdown has-background-white is-boxed">
            {dropdownOptions['User']?.map((option, index) => (
              <Link key={index} href={option.value} className="navbar-item">
                <span className="icon is-small">
                  <i className="material-icons">{option.icon}</i>
                </span>
                <span>{option.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Hamburger menu - only visible on mobile/tablet */}
        <div className="navbar-burger is-hidden-desktop" onClick={toggleNavDropdown}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className={`navbar-menu ${isNavDropdownOpen ? 'is-active' : ''}`}>
        <div className="navbar-start">
          <NavItem />
        </div>
      </div>

      {/* User dropdown - chỉ hiện trên desktop */}
      <div className="navbar-end is-hidden-touch">
        <motion.div
          className="navbar-item has-dropdown is-hoverable"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <a className="navbar-link">
            <Image 
              src={user?.avatar || '/images/husble.png'} 
              alt="User Avatar"
              width={32} 
              height={32} 
              className="is-rounded"
            />
            <span className="ml-2">{user?.name || 'User'}</span>
          </a>
          <div className="navbar-dropdown is-right has-background-white">
            {dropdownOptions['User']?.map((option, index) => (
              <Link key={index} href={option.value} className="navbar-item">
                <span className="icon is-small">
                  <i className="material-icons">{option.icon}</i>
                </span>
                <span>{option.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};

export default NavBar;