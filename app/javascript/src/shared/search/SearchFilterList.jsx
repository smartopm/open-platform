import React from 'react';
import { Grid, Typography, Button, useMediaQuery, useTheme, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function SearchFilterList({ filters, handleClearFilters, isSmall, count, loading }) {
  const { t } = useTranslation('search');
  const validFilters = filters.filter(Boolean);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const filterLimit = 50

  if (!validFilters?.length) return null;
  return (
    <Grid container spacing={isSmall ? 1 : 2} alignItems="center">
      <Grid item xs="auto">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClearFilters}
          data-testid="clear_filters_btn"
        >
          {t('search.clear')}
        </Button>
      </Grid>
      <Grid item xs>
        <Typography
          display={mobile ? 'inline-block' : 'block'}
          variant="subtitle2"
          data-testid="search_results"
        >
          {`${t('search.search_results')}: `}
          {loading
            ? <CircularProgress size={10} thickness={5} color='primary' />
            : (count > filterLimit
              ? `${filterLimit}+`
              : count)}
        </Typography>
        {'  '}
        <Typography
          display={mobile ? 'inline-block' : 'block'}
          variant="caption"
          data-testid="filters_list"
        >
          {filters
            .filter(Boolean)
            .map(filter => `${filter}`)
            .join(', ')}
        </Typography>
      </Grid>
    </Grid>
  );
}

SearchFilterList.defaultProps = {
  count: 0,
  loading: false,
}

SearchFilterList.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleClearFilters: PropTypes.func.isRequired,
  isSmall: PropTypes.bool.isRequired,
  count: PropTypes.number,
  loading: PropTypes.bool,
};
