import React, { useCallback } from 'react'

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface SearchProductProps {
  onSearch?: (searchTerm: string) => void;
}

const SEARCH_STYLES = {
  container: {
    gap: '0.5rem',
    width: '100%',
    overflowX: 'auto' as const,
    paddingBottom: '0.5rem'
  },
  searchInput: {
    minWidth: '550px',
    flexShrink: 0
  }
} as const;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SearchProduct = React.memo<SearchProductProps>(({ onSearch }) => {
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  }, [onSearch]);

  return (
    <div>
      <div 
        className="is-flex is-align-items-center" 
        style={SEARCH_STYLES.container}
      >
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

        <div style={SEARCH_STYLES.searchInput}>
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
  );
});

SearchProduct.displayName = 'SearchProduct';

export default SearchProduct;