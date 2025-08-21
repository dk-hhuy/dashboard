import React, { useState } from 'react'

interface ConfigTableProps {
  suppliers: Array<{
    name: string;
    country: string;
  }>;
  onEdit?: (index: number, name: string, country: string) => void;
  onDelete?: (index: number) => void;
}

const ConfigTable = React.memo<ConfigTableProps>(({ suppliers, onEdit, onDelete }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editCountry, setEditCountry] = useState('');

  const handleEditClick = (index: number, name: string, country: string) => {
    setEditingIndex(index);
    setEditName(name);
    setEditCountry(country);
  };

  const handleSaveEdit = (index: number) => {
    if (editName.trim() && editCountry.trim() && onEdit) {
      onEdit(index, editName.trim(), editCountry.trim());
      setEditingIndex(null);
      setEditName('');
      setEditCountry('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditName('');
    setEditCountry('');
  };

  const handleDeleteClick = (index: number) => {
    if (onDelete) {
      onDelete(index);
    }
  };

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
            <tr key={`${supplier.name}-${index}`}>
              <td className="has-text-left is-size-7">
                {editingIndex === index ? (
                  <input 
                    className="input is-size-7" 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  supplier.name
                )}
              </td>
              <td className="has-text-left is-size-7">
                {editingIndex === index ? (
                  <input 
                    className="input is-size-7" 
                    type="text" 
                    value={editCountry} 
                    onChange={(e) => setEditCountry(e.target.value)}
                  />
                ) : (
                  supplier.country
                )}
              </td>
              <td className="has-text-centered" style={{ width: '150px' }}> 
                {editingIndex === index ? (
                  <>
                    <button 
                      className="button is-small is-size-7 is-success mr-1"
                      onClick={() => handleSaveEdit(index)}
                    >
                      Save
                    </button>
                    <button 
                      className="button is-small is-size-7 is-warning"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="button is-small is-size-7 is-primary mr-1"
                      onClick={() => handleEditClick(index, supplier.name, supplier.country)}
                    >
                      Edit    
                    </button>
                    <button 
                      className="button is-small is-size-7 is-danger"
                      onClick={() => handleDeleteClick(index)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

ConfigTable.displayName = 'ConfigTable';

export default ConfigTable;