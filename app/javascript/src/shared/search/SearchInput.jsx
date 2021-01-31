import React from 'react';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@material-ui/core';
import { FilterListOutlined } from '@material-ui/icons';
import PropTypes from 'prop-types'

export default function SearchInput({ title, searchValue, handleSearch, handleFilter }) {
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

SearchInput.propTypes = {
    title: PropTypes.string.isRequired,
    searchValue: PropTypes.string.isRequired,
    handleSearch: PropTypes.func.isRequired,
    handleFilter: PropTypes.func.isRequired
}