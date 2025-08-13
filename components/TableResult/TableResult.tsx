interface TableResultProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

const TableResult = ({ currentPage, setCurrentPage, itemsPerPage, startIndex, endIndex, totalItems }: TableResultProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isPreviousButtonDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

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
    <div className="level is-mobile has-background-white p-4 has-shadow">
      <div className="level-left">
        <div className="level-item">
          <p className="has-text-black is-size-7 has-text-weight-medium">
            {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} results
          </p>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">
          <div className="field has-addons">
            <div className="control">
              <div className="select is-small">
                <select 
                  onChange={(e) => handlePageChange(parseInt(e.target.value))} 
                  value={currentPage}
                  className="has-background-white has-text-black"
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
            <div className="control">
              <button 
                className={`button is-small ${isPreviousButtonDisabled ? 'is-static has-background-white' : 'has-background-white has-text-black'}`}
                onClick={handlePreviousPage} 
                disabled={isPreviousButtonDisabled}
              >
                <span className="icon is-small">
                  <i className="material-icons">arrow_back</i>
                </span>
              </button>
            </div>
            <div className="control">
              <button 
                className={`button is-small ${isNextDisabled ? 'is-static has-background-white' : 'has-background-white has-text-black'}`}
                onClick={handleNextPage} 
                disabled={isNextDisabled}
              >
                <span className="icon is-small">
                  <i className="material-icons">arrow_forward</i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableResult;