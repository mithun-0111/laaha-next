import { LeftAngular, RightAngular } from "@/src/lib/icons"
import React from "react"

interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page)
    }
  }

  // Generate page numbers to display
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="pagination flex flex-wrap items-center justify-between lg:m-5">
      {/* Previous Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageClick(currentPage - 1)}
        className="text-0 w-10 h-10 disabled:bg-color-secondary rounded-full flex justify-center items-center p-0 bg-primary"
      >
        <LeftAngular />
      </button>
      <ul className="list-none flex ps-0 pe-0 flex-wrap gap-2 pt-2">
        {pageNumbers.map((page) => (
          <li
            key={page}
            onClick={() => handlePageClick(page)}
            className={
              currentPage === page
                ? "active text-primary bg-color-secondary cursor-pointer py-2 px-4 rounded-full text-center inline"
                : "py-2 px-4 rounded-full cursor-pointer text-center inline"
            }
          >
            {page}
          </li>
        ))}
      </ul>

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
        className="text-0 w-10 h-10 rounded-full flex disabled:bg-color-secondary justify-center items-center p-0 bg-primary"
      >
        <RightAngular />
      </button>
    </div>
  )
}

export default Pagination
