import React, { useRef, useState } from 'react';
import {
  FormControl,
  Grid,
  Grow,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  MenuList,
  OutlinedInput,
  Paper,
  Popper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearOutlined from '@mui/icons-material/ClearOutlined';
import FilterListOutlined from '@mui/icons-material/FilterListOutlined';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import SearchFilterList from './SearchFilterList';

/**
 * SearchInput Component
 * Prefer to use a debounced value on filters, to avoid showing each letter as the user is typing
 * @returns
 */
export default function SearchInput({
  title,
  searchValue,
  filterRequired,
  handleSearch,
  handleFilter,
  handleClear,
  handleClick,
  filters,
  fullWidthOnMobile,
  fullWidth,
  filterMenu,
  filterOptions,
  searchCount,
  loading,
}) {
  const { t } = useTranslation(['logbook', 'search', 'common']);
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  function handleFilterClick(event) {
    if (filterMenu) { setOpen(prevOpen => !prevOpen); }
    else { handleFilter(event); }
  }

  function handleFilterSelect(event, filter) {
    handleClose(event);
    handleFilter(filter, 'duration');
  }

  function handleClose(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={fullWidthOnMobile ? 12 : 10} md={fullWidth ? 12 : 5}>
        <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-filter">
            {t('search:search.search_for', { title })}
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-filter"
            type="search"
            label={t('search:search.search_for', { title })}
            value={searchValue}
            onChange={handleSearch}
            placeholder={t('search:search.type_your_search')}
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
                    onClick={(e) => handleFilterClick(e)}
                    edge="end"
                    data-testid="filter"
                    size="large"
                    aria-controls={filterMenu && open ? 'filter-menu' : undefined}
                    aria-haspopup={filterMenu && open ? 'true' : false}
                    aria-expanded={filterMenu && open ? 'true' : undefined}
                    ref={filterMenu ? anchorRef : undefined}
                    id="query-filter-icon"
                  >
                    <FilterListOutlined />
                  </IconButton>
                )}
              </InputAdornment>
            )}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} md={7}>
        <SearchFilterList
          handleClearFilters={handleClear}
          filters={filters}
          isSmall={false}
          count={searchCount}
          loading={loading}
        />
      </Grid>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-end"
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: 'left top' }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="query-filter-icon"
                >
                  {filterOptions?.map((option, i) => (
                    <MenuItem
                      data-testid={`${i}-${option.title}`}
                      key={option.value}
                      onClick={(event) => handleFilterSelect(event, option.value)}
                    >
                      {`${t('common:misc.show')} ${option.title}`}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Grid>
  );
}

SearchInput.defaultProps = {
  handleClear: () => {},
  handleFilter: () => {},
  filterRequired: true,
  handleSearch: undefined,
  handleClick: undefined,
  fullWidthOnMobile: false,
  fullWidth: true,
  filters: [],
  filterMenu: false,
  filterOptions: [],
  searchCount: { status: false, count: null },
  loading: false,
};

SearchInput.propTypes = {
  title: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  filterRequired: PropTypes.bool,
  handleSearch: PropTypes.func,
  handleFilter: PropTypes.func,
  handleClear: PropTypes.func,
  handleClick: PropTypes.func,
  filters: PropTypes.arrayOf(PropTypes.string),
  fullWidthOnMobile: PropTypes.bool,
  fullWidth: PropTypes.bool,
  filterMenu: PropTypes.bool,
  filterOptions: PropTypes.arrayOf(PropTypes.object),
  searchCount: PropTypes.shape(PropTypes.Object),
  loading: PropTypes.bool,
};
