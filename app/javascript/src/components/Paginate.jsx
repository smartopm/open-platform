import React from 'react'
import { Button } from '@material-ui/core'

export default function Paginate({
  count,
  limit,
  handlePageChange,
  active,
}) {
  return (
    <>
      <Button data-testid="prev-btn" onClick={() => handlePageChange('prev')}>
        Previous
      </Button>

      <Button
        data-testid="prev-btn"
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
