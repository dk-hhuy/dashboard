import React, { useState } from 'react'
import { ConfigTable } from '.'
import { suppliers } from '@/constants/index_product'
import TableResult from '@/components/Shared/TableResult'
import { getAllSuppliers } from '@/lib/utils_supplier'

const ConfigSupplier = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Hiển thị tối đa 10 suppliers/trang
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSuppliers = suppliers.slice(startIndex, endIndex)

  const [supplier, setSupplier] = useState('')
  const [country, setCountry] = useState('')

  return (
    <div>
        <div className="">
            <div className="is-size-7">
                <div className="is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center is-flex-wrap-wrap mb-4">
                    <h4 className="title is-4 mb-0 is-size-6">Config Supplier ({getAllSuppliers()})</h4>
                    <button className="button is-small is-size-7 is-danger is-light ml-4">
                        <span className="icon is-small">
                            <i className="material-icons is-size-7">close</i>
                        </span>
                    </button>
                </div>
            </div>
            <div className="is-size-7">
                <div className="field mb-4">
                    <div className="is-flex is-align-items-center is-gap-1" style={{ width: '100%' }}>
                        <div className="field has-addons is-size-7 mb-0" style={{ width: 'calc(50% - 75px)' }}>
                            <div className="control">
                                <span className="button is-static is-size-7">Supplier</span>
                            </div>
                            <div className="control is-expanded">
                                <input className="input is-size-7" type="text" placeholder="Supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} />
                            </div>
                        </div>
                        <div className="field has-addons is-size-7 mb-0" style={{ width: 'calc(50% - 75px)' }}>
                            <div className="control">
                                <span className="button is-static is-size-7">Country</span>
                            </div>
                            <div className="control is-expanded">
                                <input className="input is-size-7" type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                            </div>
                        </div>
                        <div className="is-flex is-align-items-center is-justify-content-center" style={{ width: '150px', flexShrink: 0 }}>
                            <button className="button is-small is-size-7 is-primary mr-2">
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