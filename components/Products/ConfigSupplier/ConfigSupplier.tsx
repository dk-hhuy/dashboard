import React, { useState } from 'react'
import { ConfigTable } from '.'
import { suppliers } from '@/constants/index_product'
import TableResult from '@/components/Shared/TableResult'

const ConfigSupplier = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSuppliers = suppliers.slice(startIndex, endIndex)

  return (
    <div>
        <div className="card">
            <div className="card-header is-size-7">
                <div className="card-header-title level is-size-7">
                    <h4 className="title is-4 mb-0 is-size-6 level-left">Config Supplier</h4>
                </div>
                <div className="card-header-icon level-right">
                    <button className="button is-small is-size-7 is-danger">
                        <span className="icon is-small">
                            <i className="material-icons is-size-7">close</i>
                        </span>
                    </button>
                </div>
            </div>
            <div className="card-content is-size-7">
                <div className="is-flex is-flex-direction-row is-flex-wrap-wrap mb-4">
                    <div className="field is-flex-grow-1">
                        <label className="label is-size-7">Supplier</label>
                        <div className="control">
                            <input className="input is-size-7" type="text" placeholder="Supplier" />
                        </div>
                    </div>
                    <div className="field is-flex-grow-1">
                        <label className="label is-size-7">Country</label>
                        <div className="control">
                            <input className="input is-size-7" type="text" placeholder="Country" />
                        </div>
                    </div>
                    <div className="field is-flex-grow-1">
                        <label className="label is-size-7">&nbsp;</label>
                        <div className="control">
                            <button className="button is-small is-size-7 is-success mr-2">
                                Add 
                            </button>
                            <button className="button is-small is-size-7 is-danger">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                <ConfigTable suppliers={paginatedSuppliers} />
                
                <TableResult 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    totalItems={suppliers.length}
                />
            </div>
        </div>
    </div>
  )
}

export default ConfigSupplier