import React, { useState, useEffect, useRef } from 'react';
import { ExportFormat } from '@/lib/exportUtils';

interface ExportButtonsProps {
  onExport: (format: ExportFormat) => void;
  onExportSelected: (format: ExportFormat) => void;
  selectedCount: number;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({
  onExport,
  onExportSelected,
  selectedCount
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFormatDropdown(false);
      }
    };

    if (showFormatDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFormatDropdown]);

  const handleExport = () => {
    onExport(selectedFormat);
  };

  const handleExportSelected = () => {
    onExportSelected(selectedFormat);
  };

  const handleFormatDropdownToggle = () => {
    console.log('Toggling dropdown from', showFormatDropdown, 'to', !showFormatDropdown);
    setShowFormatDropdown(!showFormatDropdown);
  };

  return (
    <div className="is-flex is-align-items-center is-gap-2" style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Export All Button */}
      <button 
        className="button is-small is-size-7 is-primary"
        onClick={handleExport}
        title="Export all products"
      >
        <span className="icon is-small">
          <i className="material-icons is-size-7">file_download</i>
        </span>
        <span>Export All</span>
      </button>

      {/* Export Selected Button */}
      {selectedCount > 0 && (
        <button 
          className="button is-small is-size-7 is-link"
          onClick={handleExportSelected}
          title={`Export ${selectedCount} selected products`}
        >
          <span className="icon is-small">
            <i className="material-icons is-size-7">file_download</i>
          </span>
          <span>Export Selected ({selectedCount})</span>
        </button>
      )}

      {/* Format Dropdown */}
      <div className={`dropdown is-right ${showFormatDropdown ? 'is-active' : ''}`} style={{ position: 'relative' }}>
        <div className="dropdown-trigger">
          <button 
            className="button is-small is-size-7 is-info"
            onClick={handleFormatDropdownToggle}
            title="Select export format"
            aria-haspopup="true"
            aria-controls="format-dropdown-menu"
          >
            <span className="icon is-small">
              <i className="material-icons is-size-7">format_list_bulleted</i>
            </span>
            <span>{selectedFormat.toUpperCase()}</span>
            <span className="icon is-small">
              <i className="material-icons is-size-7">{showFormatDropdown ? 'expand_less' : 'expand_more'}</i>
            </span>
          </button>
        </div>

        <div className="dropdown-menu" id="format-dropdown-menu" role="menu">
          <div className="dropdown-content">
            <a
              className={`dropdown-item is-size-7 ${selectedFormat === 'json' ? 'is-active' : ''}`}
              onClick={() => {
                setSelectedFormat('json');
                setShowFormatDropdown(false);
              }}
              role="menuitem"
            >

              <span className="is-size-7">JSON</span>
            </a>
            <a
              className={`dropdown-item is-size-7 ${selectedFormat === 'csv' ? 'is-active' : ''}`}
              onClick={() => {
                setSelectedFormat('csv');
                setShowFormatDropdown(false);
              }}
              role="menuitem"
            >

              <span className="is-size-7">CSV</span>
            </a>
            <a
              className={`dropdown-item is-size-7 ${selectedFormat === 'excel' ? 'is-active' : ''}`}
              onClick={() => {
                setSelectedFormat('excel');
                setShowFormatDropdown(false);
              }}
              role="menuitem"
            >
              <span className="is-size-7">Excel</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportButtons; 