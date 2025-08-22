import React, { useCallback, useMemo } from 'react'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ProductActionProps {
  onAddProduct?: () => void;
  onUpdatePrice?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onConfig?: () => void;
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
  onConfig 
}) => {
  // Memoized action buttons configuration
  const actionButtons = useMemo<ActionButton[]>(() => [
    { icon: 'add', label: 'Add', color: 'is-primary', onClick: onAddProduct },
    { icon: 'sync', label: 'Update Price', color: 'is-warning', onClick: onUpdatePrice },
    { icon: 'import_export', label: 'Import', color: 'is-info', onClick: onImport },
    { icon: 'file_download', label: 'Export', color: '', onClick: onExport },
    { icon: 'settings', label: 'Config', color: 'is-success', onClick: onConfig }
  ], [onAddProduct, onUpdatePrice, onImport, onExport, onConfig]);

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
    </div>
  );
});

ProductAction.displayName = 'ProductAction';

export default ProductAction;