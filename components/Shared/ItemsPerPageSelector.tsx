import React, { useCallback, useEffect } from 'react'
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils'
import { useSearchParams, useRouter } from 'next/navigation'

interface ItemsPerPageSelectorProps {
  itemsPerPage: number
  onItemsPerPageChange: (itemsPerPage: number) => void
  totalItems: number
}

const ItemsPerPageSelector: React.FC<ItemsPerPageSelectorProps> = ({
  itemsPerPage,
  onItemsPerPageChange,
  totalItems
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const options = [5, 10, 12, 15, 20, 25, 30, 50, 100]

  // URL update helper
  const updateUrlParam = useCallback((key: string, value: string) => {
    const newUrl = value 
      ? formUrlQuery({ params: searchParams.toString(), key, value })
      : removeKeysFromUrlQuery({ params: searchParams.toString(), keysToRemove: [key] });
    router.push(newUrl, { scroll: false });
  }, [searchParams, router]);

  // Update URL when itemsPerPage changes
  useEffect(() => {
    updateUrlParam('limit', itemsPerPage.toString());
  }, [itemsPerPage, updateUrlParam]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(event.target.value)
    onItemsPerPageChange(newItemsPerPage)
  }

  return (
    <div className="field has-addons">
      <div className="control">
        <span className="button is-static is-small is-size-7">
          Show
        </span>
      </div>
      <div className="control">
        <div className="select is-small is-size-7">
          <select 
            value={itemsPerPage} 
            onChange={handleChange}
            aria-label="Select items per page"
          >
            {options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="control">
        <span className="button is-static is-small is-size-7">
          of {totalItems} items
        </span>
      </div>
    </div>
  )
}

export default ItemsPerPageSelector 