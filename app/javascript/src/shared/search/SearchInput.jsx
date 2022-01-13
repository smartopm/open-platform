import React from 'react';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import ClearOutlined from '@mui/icons-material/ClearOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';

export default function SearchInput({ title, searchValue, filterRequired, handleSearch, handleFilter, handleClear }) {
  const { t } = useTranslation('search')
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor="outlined-adornment-filter">{t('search.search_for', { title })}</InputLabel>
      <OutlinedInput
        id="outlined-adornment-filter"
        type="search"
        label={t('search.search_for', { title })}
        value={searchValue}
        onChange={handleSearch}
        placeholder={t('search.type_your_search')}
        inputProps={{ "data-testid": "search" }}
        startAdornment={<SearchIcon style={{ color: '#a1a1a1', marginRight: 8 }} />}
        endAdornment={(
          <InputAdornment position="end">
            {
              Boolean(searchValue.length) && handleClear &&(
                <IconButton aria-label="clear search query" data-testid="clear_search" onClick={handleClear} edge="end">
                  <ClearOutlined />
                </IconButton>
              )
            }
            {filterRequired && (
            <IconButton aria-label="toggle filter visibility" onClick={handleFilter} edge="end" data-testid="filter">
              <FilterListOutlined />
            </IconButton>
          )}
          </InputAdornment>
        )}
        labelWidth={120}
      />
    </FormControl>
  );
}

SearchInput.defaultProps = {
  handleClear: () => {},
  handleFilter: () => {},
  filterRequired: true
}

SearchInput.propTypes = {
    title: PropTypes.string.isRequired,
    searchValue: PropTypes.string.isRequired,
    filterRequired: PropTypes.bool,
    handleSearch: PropTypes.func.isRequired,
    handleFilter: PropTypes.func,
    handleClear: PropTypes.func,
}