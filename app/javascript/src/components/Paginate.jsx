/* eslint-disable react/prop-types */
import React from 'react'
import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

export default function Paginate({
  count,
  limit,
  handlePageChange,
  active,
  offset
}) {
  const { t } = useTranslation('common')
  return (
    <>
      <Button
        data-testid="prev-btn"
        onClick={() => handlePageChange('prev')}
        disabled={!active && offset < 1}
      >
        {t('misc.previous')}
      </Button>

      <Button
        data-testid="next-btn"
        onClick={() => handlePageChange('next')}
        disabled={active && count < limit}
      >
        {t('misc.next')}
      </Button>
    </>
  )
}

// TODO: Fix this.
Paginate.defaultProps = {
  active: false,
  offset: 0,
  limit: 50
}
