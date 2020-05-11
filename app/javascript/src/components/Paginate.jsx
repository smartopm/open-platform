import React from 'react'

export default function Paginate({ count, limit, handlePageChange, active, offset }) {

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        <li className={`page-item ${ !active && offset < limit && 'disabled' || ''}`}>
          <a
            className="page-link"
            data-testid="prev-btn"
            onClick={() => handlePageChange('prev')}
            href="#"
          >
            Previous
          </a>
        </li>
        
        <li className={`page-item ${!active && count < limit && 'disabled' || ''}`}>
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

Paginate.defaultProps = {
  active: false,
  offset: 0,
  limit: 50
}