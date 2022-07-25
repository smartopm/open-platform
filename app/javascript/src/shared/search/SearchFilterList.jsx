import React from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function SearchFilterList({ filters, handleClearFilters, isSmall, count }) {
  const { t } = useTranslation('search');
  const validFilters = filters.filter(Boolean);

  if (!validFilters?.length) return null;
  return (
    <Grid container spacing={isSmall ? 1: 2} alignItems="center">
      <Grid item xs="auto">
        <Typography display="inline-block" variant="subtitle2" data-testid="search_results">
          {`${t(
          'search.search_results'
        )}:  `}
        </Typography>
        {'  '}
        <Typography display={isSmall ? "block" : "inline-block"} variant="caption" data-testid="filters_list">
          {count}
          {filters
            .filter(Boolean)
            .map(filter => `${filter}`)
            .join(', ')}
        </Typography>
      </Grid>
      <Grid item xs>
        <Button variant="outlined" color="primary" onClick={handleClearFilters} data-testid="clear_filters_btn">
          {t('search.clear_filters')}
        </Button>
      </Grid>
    </Grid>
  );
}

SearchFilterList.defaultProps = {
  count: 0,
}

SearchFilterList.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleClearFilters: PropTypes.func.isRequired,
  isSmall: PropTypes.bool.isRequired,
  count: PropTypes.number,
};
