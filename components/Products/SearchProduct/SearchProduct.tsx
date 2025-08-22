import React, { useState, useEffect, useCallback } from 'react'
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils'
import { useSearchParams, useRouter } from 'next/navigation'

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface SearchProductProps {
  onSearch?: (searchTerm: string) => void;
}

// Constants
const DEBOUNCE_DELAY = 300;

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
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State management
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');

  // URL update helper
  const updateUrlParam = useCallback((key: string, value: string) => {
    const newUrl = value 
      ? formUrlQuery({ params: searchParams.toString(), key, value })
      : removeKeysFromUrlQuery({ params: searchParams.toString(), keysToRemove: [key] });
    router.push(newUrl, { scroll: false });
  }, [searchParams, router]);

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateUrlParam('search', searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, updateUrlParam]);

  // Notify parent component
  useEffect(() => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  }, [searchQuery, onSearch]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

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
                value={searchQuery}
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