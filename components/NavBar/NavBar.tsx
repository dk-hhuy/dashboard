'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { dropdownOptions } from '../../constants';
import NavItem from './NavItem';
import styles from './NavBar.module.css';

const NavBar = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`navbar ${styles.navbar}`}>
      <div className={styles.navbarMenu}>
        <motion.div 
          className={styles.navbarBrand}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Link href="/" className={styles.navbarBrandItem}>
            <Image src="/images/husble.png" alt="Husble Logo" width={120} height={30} />
          </Link>
        </motion.div>
        
        <div className={styles.navbarStart}>
          <NavItem />
        </div>
        
        <motion.div 
          className={styles.navbarEnd}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={`navbar-item has-dropdown is-hoverable ${styles.navbarItemHasDropdown}`}>
            <Link href="/Profile" className={styles.userProfileLink}>
              <Image 
                src={user?.avatar || '/images/husble.png'} 
                alt="User Avatar"
                width={32} 
                height={32} 
                className={styles.userAvatar}
              />
              <span className={styles.userName}>{user?.name || 'User'}</span>
              <span className="icon is-small">
                <i className="material-icons">expand_more</i>
              </span>
            </Link>
            <div className={`navbar-dropdown is-right ${styles.navbarEndDropdown}`}>
              {dropdownOptions['User']?.map((option, index) => (
                <Link 
                  key={index}
                  href={option.value} 
                  className="navbar-item"
                >
                  <span className="icon is-small">
                    <i className="material-icons">{option.icon}</i>
                  </span>
                  <span>{option.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className={`mobile-settings ${styles.mobileSettings}`}>
        <button
          className={`navbar-burger ${isMobileMenuOpen ? 'is-active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="menu"
          aria-expanded="false"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;