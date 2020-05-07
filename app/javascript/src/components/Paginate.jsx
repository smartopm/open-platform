import React from 'react'

export default function Paginate({ offSet, count, limit, handlePageChange }) {

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        <li className={`page-item ${offSet < limit && 'disabled'}`}>
          <a
            className="page-link"
            data-testid="prev-btn"
            onClick={() => handlePageChange('prev')}
            href="#"
          >
            Previous
          </a>
        </li>
        <li className={`page-item ${count < limit && 'disabled'}`}>
          <button
            className="page-link"
            data-testid="next-btn"
            onClick={() => handlePageChange('next')}
            href="#"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  )
}
