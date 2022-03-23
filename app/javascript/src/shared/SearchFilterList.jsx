import React from 'react';
import { Button } from '@material-ui/core';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function SearchFilterList({ filters, handleClearFilters }) {
  const { t } = useTranslation('search');
  const validFilters = filters.filter(Boolean);
  if (!validFilters?.length) return null;
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Typography display="inline-block" variant="subtitle2" data-testid="search_results">
          {`${t(
          'search.search_results'
        )}:  `}
        </Typography>
        {'  '}
        <Typography display="inline-block" variant="caption" data-testid="filters_list">
          {filters
            .filter(Boolean)
            .map(filter => `${filter}`)
            .join(', ')}
        </Typography>
      </Grid>
      <Grid item>
        <Button variant="outlined" color="primary" onClick={handleClearFilters} data-testid="clear_filters_btn">
          {t('search.clear_filters')}
        </Button>
      </Grid>
    </Grid>
  );
}

SearchFilterList.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleClearFilters: PropTypes.func.isRequired
};
