import React from 'react'

interface SearchProductProps {
  onSearch?: (searchTerm: string) => void;
}

const SearchProduct = ({ onSearch }: SearchProductProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div>
        <div className="is-flex is-align-items-center" style={{ gap: '0.5rem', width: '100%', overflowX: 'auto', paddingBottom: '0.5rem' }}>

            <div className="dropdown is-active is-size-7">
                <div className="dropdown-trigger is-size-7">
                    <button className="button is-size-7" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span className="is-size-7">Fuzzy Search</span>
                        <span className="icon is-size-7">
                            <i className="material-icons is-size-7">
                                keyboard_arrow_down
                            </i>
                        </span>

                    </button>
                </div>
            </div>

            <div style={{ minWidth: '550px', flexShrink: 0 }}>
                <div className="field">
                    <div className="control is-size-7 has-icons-left">
                        <input 
                            className="input is-size-7" 
                            type="text" 
                            placeholder="Search products, categories, skus"
                            onChange={handleSearchChange}
                        />
                        <span className="icon is-left">
                            <i className="material-icons is-size-7">search</i>
                        </span>
                    </div>
                </div>
            </div>

            
        </div>
    </div>
  )
}

export default SearchProduct