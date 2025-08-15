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
        const isTools = link.label === 'Tools';
        const hasDropdownOptions = hasDropdown(link.label);
        
        if (hasDropdownOptions) {
          return (
            <div 
              key={index} 
              className="navbar-item has-dropdown is-hoverable is-size-7"
            >
              <a className="navbar-link is-size-7">
                <span className="icon is-hidden-touch">
                  <i className="material-icons is-size-7">{link.icon}</i>
                </span>
                <span>{link.label}</span>
              </a>
              <div className="navbar-dropdown is-size-7">
                {dropdownOptions[link.label]?.map((option, optionIndex) => (
                  <Link 
                    key={optionIndex}
                    href={option.value} 
                    className="navbar-item is-size-7"
                  >
                    <span className="icon is-small is-hidden-touch">
                      <i className="material-icons is-size-7">{option.icon}</i>
                    </span>
                    <span className="is-size-7">{option.label}</span>
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
              className={`navbar-item is-size-7`}
            >
              <span className="icon is-hidden-touch">
                <i className="material-icons is-size-7">{link.icon}</i>
              </span>
              <span className={isTools ? 'has-text-warning' : ''}>{link.label}</span>
            </Link>
          );
        }
      })}
    </>
  );
};

export default NavItem; 