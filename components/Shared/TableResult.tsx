import React, { useCallback, useEffect } from 'react'
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils'
import { useSearchParams, useRouter } from 'next/navigation'
import ItemsPerPageSelector from './ItemsPerPageSelector'

interface TableResultProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

const TableResult = ({ currentPage, setCurrentPage, itemsPerPage, startIndex, endIndex, totalItems, onItemsPerPageChange }: TableResultProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isPreviousButtonDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  // URL update helper
  const updateUrlParam = useCallback((key: string, value: string) => {
    const newUrl = value 
      ? formUrlQuery({ params: searchParams.toString(), key, value })
      : removeKeysFromUrlQuery({ params: searchParams.toString(), keysToRemove: [key] });
    router.push(newUrl, { scroll: false });
  }, [searchParams, router]);

  // Update URL when page changes
  useEffect(() => {
    updateUrlParam('page', currentPage.toString());
  }, [currentPage, updateUrlParam]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else if ([10, 20, 30, 50, 100].includes(page) && totalPages >= page) {
      setCurrentPage(page);
    }
  };

  const handlePreviousPage = () => handlePageChange(currentPage - 1);
  const handleNextPage = () => handlePageChange(currentPage + 1);

  return (
    <div className="level is-mobile p-4 has-shadow is-size-7">
      <div className="level-left">
        <div className="level-item is-size-7">
          <p className="has-text-weight-medium is-size-7">
            {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} results
          </p>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item is-size-7">
          <div className="field has-addons">
            <div className="control">
              <div className="select is-small is-size-7">
                <select 
                  onChange={(e) => handlePageChange(parseInt(e.target.value))} 
                  value={currentPage}
                  
                >
                  {Array.from({ length: totalPages }, (_, index) => (
                    <option key={index} value={index + 1}>{index + 1} / {totalPages}</option>
                  ))}
                  <option disabled>──────────</option>
                  {[10, 20, 30, 50, 100].map(page => (
                    <option key={page} value={page} disabled={totalPages < page}>
                      {page} pages
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="control is-size-7">
              <button 
                className={`button is-small ${isPreviousButtonDisabled ? 'is-static' : ''}`}
                onClick={handlePreviousPage} 
                disabled={isPreviousButtonDisabled}
              >
                <span className="icon is-small is-size-7">
                  <i className="material-icons is-size-7">arrow_back</i>
                </span>
              </button>
            </div>
            <div className="control is-size-7">
              <button 
                className={`button is-small ${isNextDisabled ? 'is-static' : ''}`}
                onClick={handleNextPage} 
                disabled={isNextDisabled}
              >
                <span className="icon is-small is-size-7">
                  <i className="material-icons is-size-7">arrow_forward</i>
                </span>
              </button>
            </div>
          </div>
        </div>
        {onItemsPerPageChange && (
          <div className="level-item is-size-7 ml-4">
            <ItemsPerPageSelector
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              totalItems={totalItems}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TableResult; 