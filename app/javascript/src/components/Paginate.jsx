import React from 'react'
import { Button } from '@material-ui/core'

export default function Paginate({
  count,
  limit,
  handlePageChange,
  active,
  offset
}) {
  return (
    <>
      <Button
        data-testid="prev-btn"
        onClick={() => handlePageChange('prev')}
        disabled={!active && offset < 1}
      >
        Previous
      </Button>

      <Button
        data-testid="next-btn"
        onClick={() => handlePageChange('next')}
        disabled={!active && count < limit}
      >
        Next
      </Button>
    </>
  )
}

Paginate.defaultProps = {
  active: false,
  offset: 0,
  limit: 50
}
