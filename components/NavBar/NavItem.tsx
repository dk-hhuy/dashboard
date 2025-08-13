'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLink, dropdownOptions } from '../../constants';

const NavItem = () => {
  const pathname = usePathname();

  // Check if a navigation item has dropdown options
  const hasDropdown = (label: string) => {
    return dropdownOptions[label] && dropdownOptions[label].length > 0;
  };

  return (
    <>
      {navLink.map((link, index) => {
        const isActive = pathname === link.href;
        const isTools = link.label === 'Tools';
        const hasDropdownOptions = hasDropdown(link.label);
        
        if (hasDropdownOptions) {
          return (
            <div 
              key={index} 
              className="navbar-item has-dropdown is-hoverable"
            >
              <a className="navbar-link">
                <span className="icon is-hidden-touch">
                  <i className="material-icons">{link.icon}</i>
                </span>
                <span>{link.label}</span>
              </a>
              <div className="navbar-dropdown has-background-white">
                {dropdownOptions[link.label]?.map((option, optionIndex) => (
                  <Link 
                    key={optionIndex}
                    href={option.value} 
                    className="navbar-item"
                  >
                    <span className="icon is-small is-hidden-touch">
                      <i className="material-icons">{option.icon}</i>
                    </span>
                    <span>{option.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        } else {
          return (
            <Link 
              key={index}
              href={link.href} 
              className={`navbar-item ${isActive ? 'is-active' : ''} ${isTools ? 'has-text-warning' : ''}`}
            >
              <span className="icon is-hidden-touch">
                <i className="material-icons">{link.icon}</i>
              </span>
              <span>{link.label}</span>
            </Link>
          );
        }
      })}
    </>
  );
};

export default NavItem; 