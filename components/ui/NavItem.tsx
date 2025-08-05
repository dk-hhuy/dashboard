'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { navLink, dropdownOptions } from '../../constants'

const NavItem = () => {
  const [selectedValues, setSelectedValues] = useState({
    fulfillment: '', analytics: '', googleAds: '', tools: ''
  })

  const dropdownFields = { 
    'Fulfillment': 'fulfillment', 
    'Analytics': 'analytics', 
    'Google Ads': 'googleAds', 
    'Tools': 'tools' 
  }

  const handleSelectChange = (field: string, value: string) => {
    setSelectedValues(prev => ({ ...prev, [field]: value }))
    if (value) window.location.href = value
  }

  const handleHover = (e: React.MouseEvent<HTMLDivElement>, isEnter: boolean) => {
    e.currentTarget.style.backgroundColor = isEnter ? '#f5f5f5' : 'transparent'
  }

  const renderSelect = (label: string, field: string) => {
    const link = navLink.find(item => item.label === label)
    const selectStyle = {
      border: 'none', background: 'transparent', fontSize: '0.875rem',
      padding: '0.5rem 2rem 0.5rem 0.5rem', margin: '0', cursor: 'pointer',
      width: '100%', height: '100%', position: 'absolute' as const,
      top: '0', left: '0', zIndex: 1, opacity: 0
    }

    return (
      <div 
        className="navbar-item" 
        style={{ position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s ease' }}
        onMouseEnter={(e) => handleHover(e, true)}
        onMouseLeave={(e) => handleHover(e, false)}
      >
        <select 
          value={selectedValues[field as keyof typeof selectedValues]}
          onChange={(e) => handleSelectChange(field, e.target.value)}
          style={selectStyle}
        >
          <option value=""></option>
          {dropdownOptions[label]?.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="icon">
            <i className="material-icons">{link?.icon}</i>
          </span>
          <span>{label}</span>
          <span className="icon" style={{ marginLeft: '0.25rem' }}>
            <i className="material-icons" style={{ fontSize: '1rem' }}>expand_more</i>
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="navbar-start">
      {navLink.map((link, index) => {
        const field = dropdownFields[link.label as keyof typeof dropdownFields]
        
        if (field) {
          return <React.Fragment key={index}>{renderSelect(link.label, field)}</React.Fragment>
        }

        return (
          <Link key={index} href={link.href} className="navbar-item">
            <span className="icon">
              <i className="material-icons">{link.icon}</i>
            </span>
            <span>{link.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

export default NavItem
