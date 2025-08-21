import React from 'react'

interface ConfigTableProps {
  suppliers: any[]
}

const ConfigTable = ({ suppliers }: ConfigTableProps) => {
  return (
    <div className="is-size-7">
        <table className="table is-fullwidth is-bordered is-size-7">
            <thead>
                <tr>
                    <th className="has-text-left is-size-7 title">SUPPLIER</th>
                    <th className="has-text-left is-size-7 title">COUNTRY</th>
                    <th className="has-text-centered is-size-7">ACTION</th>
                </tr>
            </thead>
            <tbody>
                {suppliers.map((supplier, index) => (
                    <tr key={index}>
                        <td className="has-text-left is-size-7">{supplier.name}</td>
                        <td className="has-text-left is-size-7">{supplier.country}</td>
                        <td className="has-text-centered" style={{ width: '150px' }}> 
                            <button className="button is-small is-size-7 is-primary">
                                Edit    
                            </button>
                            <button className="button is-small is-size-7 is-danger ml-2">
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default ConfigTable