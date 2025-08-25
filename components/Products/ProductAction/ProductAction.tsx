import React, { useCallback, useMemo } from 'react'
import ExportButtons from './ExportButtons'
import { ExportFormat } from '@/lib/exportUtils'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ProductActionProps {
  onAddProduct?: () => void;
  onUpdatePrice?: () => void;
  onImport?: () => void;
  onExport?: (format: ExportFormat) => void;
  onExportSelected?: (format: ExportFormat) => void;
  selectedCount?: number;
  onConfig?: () => void;
  onClearStorage?: () => void;
}

interface ActionButton {
  icon: string;
  label: string;
  color: string;
  onClick?: () => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ProductAction = React.memo<ProductActionProps>(({ 
  onAddProduct, 
  onUpdatePrice, 
  onImport, 
  onExport, 
  onExportSelected,
  selectedCount = 0,
  onConfig,
  onClearStorage 
}) => {
  // Memoized action buttons configuration
  const actionButtons = useMemo<ActionButton[]>(() => [
    { icon: 'add', label: 'Add', color: 'is-primary', onClick: onAddProduct },
    { icon: 'sync', label: 'Update Price', color: 'is-warning', onClick: onUpdatePrice },
    { icon: 'import_export', label: 'Import', color: 'is-info', onClick: onImport },
    { icon: 'settings', label: 'Config', color: 'is-success', onClick: onConfig },
    { icon: 'clear_all', label: 'Clear Storage', color: 'is-danger', onClick: onClearStorage }
  ], [onAddProduct, onUpdatePrice, onImport, onConfig, onClearStorage]);

  // Event handler
  const handleButtonClick = useCallback((onClick?: () => void) => {
    if (onClick) {
      onClick();
    }
  }, []);

  return (
    <div className="is-flex is-gap-2 is-flex-direction-row is-align-items-center is-justify-content-end ml-auto is-size-7">
      {actionButtons.map(({ icon, label, color, onClick }) => (
        <button 
          key={label}
          className={`button is-small is-size-7 ${color}`}
          onClick={() => handleButtonClick(onClick)}
        >
          <span className="icon is-small">
            <i className="material-icons is-size-7">{icon}</i>
          </span>
          <span>{label}</span>
        </button>
      ))}
      
      {/* Export Buttons with Format Selector */}
      {onExport && onExportSelected && (
        <ExportButtons
          onExport={onExport}
          onExportSelected={onExportSelected}
          selectedCount={selectedCount || 0}
        />
      )}
    </div>
  );
});

ProductAction.displayName = 'ProductAction';

export default ProductAction;