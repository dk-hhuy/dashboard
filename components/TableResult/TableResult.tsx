import styles from './TableResult.module.css';

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
    <div className={styles.tableContainer}>
      <div className={styles.tableContent}>
        <p className={styles.resultsText}>
          {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} results
        </p>
        <div className={styles.controlsContainer}>
          <div className={styles.selectContainer}>
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
          <div className={styles.buttonsContainer}>
            <button className={styles.button} onClick={handlePreviousPage} disabled={isPreviousButtonDisabled}>
              <span className={`material-icons ${styles.buttonIcon}`}>arrow_back</span>
            </button>
            <button className={styles.button} onClick={handleNextPage} disabled={isNextDisabled}>
              <span className={`material-icons ${styles.buttonIcon}`}>arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableResult;