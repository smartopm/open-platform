import React from 'react';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@material-ui/core';
import { ClearOutlined, FilterListOutlined } from '@material-ui/icons';
import PropTypes from 'prop-types'

export default function SearchInput({ title, searchValue, handleSearch, handleFilter, handleClear }) {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel htmlFor="outlined-adornment-filter">{`Search for ${title}`}</InputLabel>
      <OutlinedInput
        id="outlined-adornment-filter"
        type="search"
        label={`Search for ${title}`}
        value={searchValue}
        onChange={handleSearch}
        placeholder="Type your search query"
        endAdornment={(
          <InputAdornment position="end">
            { 
              Boolean(searchValue.length) && handleClear &&(
                <IconButton aria-label="clear search query" data-testid="clear_search" onClick={handleClear} edge="end">
                  <ClearOutlined />
                </IconButton>
              )
            }
            <IconButton aria-label="toggle filter visibility" onClick={handleFilter} edge="end">
              <FilterListOutlined />
            </IconButton>
          </InputAdornment>
        )}
        labelWidth={120}
      />
    </FormControl>
  );
}

SearchInput.defaultProps = {
  handleClear: () => {}
}

SearchInput.propTypes = {
    title: PropTypes.string.isRequired,
    searchValue: PropTypes.string.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleFilter: PropTypes.func.isRequired,
    handleClear: PropTypes.func,
}