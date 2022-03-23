import React from 'react';
import { Button } from '@material-ui/core';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types'

export default function SearchFilterList({ filters, handleClearFilters }) {
  const { t } = useTranslation('search');
  const hasFilters = filters.every(filter => Boolean(filter))
  console.log(hasFilters)
  console.log(filters)
  if(!filters?.length) return null
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Typography display="inline-block" variant='subtitle2'>{`${t('search.search_results')}:  `}</Typography> 
        {"  "}
        <Typography display="inline-block" variant='caption'>{filters.filter(Boolean).map(filter => `${filter}`).join(', ')}</Typography>
      </Grid>
      <Grid item>
        <Button variant="outlined" color="primary" onClick={handleClearFilters}>
          {t('search.clear_filters')}
        </Button>
      </Grid>
    </Grid>
  );
}


SearchFilterList.propTypes = {
    filters: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleClearFilters: PropTypes.func.isRequired,
}