import React from 'react'

interface ProductActionProps {
  onAddProduct?: () => void;
  onUpdatePrice?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onConfig?: () => void;
}

const ProductAction = ({ onAddProduct, onUpdatePrice, onImport, onExport, onConfig }: ProductActionProps) => {
  return (
    <div className="is-flex is-gap-2 is-flex-direction-row is-align-items-center is-justify-content-end ml-auto is-size-7">
        <button 
          className="button is-small is-size-7 is-primary"
          onClick={onAddProduct}
        >
            <span className="icon is-small">
                <i className="material-icons is-size-7">add</i>
            </span>
            <span>Add</span>
        </button>

        <button 
          className="button is-small is-warning is-size-7"
          onClick={onUpdatePrice}
        >
            <span className="icon is-small">
                <i className="material-icons is-size-7">sync</i>
            </span>
            <span>Update Price</span>
        </button>

        <button 
          className="button is-small is-size-7 is-info"
          onClick={onImport}
        >
            <span className="icon is-small">
                <i className="material-icons is-size-7">import_export</i>
            </span>
            <span>Import</span>
        </button>

        <button 
          className="button is-small is-size-7"
          onClick={onExport}
        >
            <span className="icon is-small">
                <i className="material-icons is-size-7">file_download</i>
            </span>
            <span>Export</span>
        </button>

        <button 
          className="button is-small is-size-7 is-success"
          onClick={onConfig}
        >
            <span className="icon is-small">
                <i className="material-icons is-size-7">settings</i>
            </span>
            <span>Config</span>
        </button>
    </div>
  )
}

export default ProductAction