import React from 'react'
import { suppliers } from '@/constants/index_product'
const ConfigTable = ( {suppliers}: {suppliers: any[]} ) => {
  return (
    <div className="card-content is-size-7">
        <table className="table is-fullwidth is-size-7">
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
                        <td className="has-text-centered">
                            <button className="button is-small is-size-7 is-danger">
                                <span className="icon is-small">
                                    <i className="material-icons is-size-7">edit</i>
                                </span>
                            </button>
                            <button className="button is-small is-size-7 is-danger">
                                <span className="icon is-small">
                                    <i className="material-icons is-size-7">delete</i>
                                </span>
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