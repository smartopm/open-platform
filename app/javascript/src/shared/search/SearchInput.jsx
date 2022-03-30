import React from 'react';
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearOutlined from '@mui/icons-material/ClearOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SearchFilterList from './SearchFilterList';

export default function SearchInput({
  title,
  searchValue,
  filterRequired,
  handleSearch,
  handleFilter,
  handleClear,
  handleClick,
  filters,
}) {
  const { t } = useTranslation('search');
  return (
    <Grid container spacing={2} alignItems="center" justifyContent="space-around">
      <Grid item xs={12} md={4}>
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-filter">
            {t('search.search_for', { title })}
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-filter"
            type="search"
            label={t('search.search_for', { title })}
            value={searchValue}
            onChange={handleSearch}
            placeholder={t('search.type_your_search')}
            inputProps={{ 'data-testid': 'search' }}
            onClick={handleClick}
            startAdornment={<SearchIcon style={{ color: '#a1a1a1', marginRight: 8 }} />}
            endAdornment={(
              <InputAdornment position="end">
                {Boolean(searchValue.length) && handleClear && (
                  <IconButton
                    aria-label="clear search query"
                    data-testid="clear_search"
                    onClick={handleClear}
                    edge="end"
                    size="large"
                  >
                    <ClearOutlined />
                  </IconButton>
            )}
                {filterRequired && (
                  <IconButton
                    aria-label="toggle filter visibility"
                    onClick={(e) => handleFilter(e)}
                    edge="end"
                    data-testid="filter"
                    size="large"
                  >
                    <FilterListOutlined />
                  </IconButton>
            )}
              </InputAdornment>
        )}
          />
        </FormControl>
       
      </Grid>
      <Grid item xs={12} md={8}>
        <SearchFilterList 
          handleClearFilters={handleClear}
          filters={filters}
          isSmall={false}
        /> 
      </Grid>
    </Grid>
  );
}

SearchInput.defaultProps = {
  handleClear: () => {},
  handleFilter: () => {},
  filterRequired: true,
  handleSearch: undefined,
  handleClick: undefined,
  filters: [],
};

SearchInput.propTypes = {
  title: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  filterRequired: PropTypes.bool,
  handleSearch: PropTypes.func,
  handleFilter: PropTypes.func,
  handleClear: PropTypes.func,
  handleClick: PropTypes.func,
  filters: PropTypes.func,
};
