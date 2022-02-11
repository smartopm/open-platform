import React, { useState, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { CSVLink } from 'react-csv';
import SelectButton from '../../../shared/buttons/SelectButton';
import { objectAccessor } from '../../../utils/helpers';
import SearchInput from '../../../shared/search/SearchInput';
import QueryBuilder from '../../../components/QueryBuilder';
import { dateToString } from '../../../utils/dateutil';
import { Spinner } from '../../../shared/Loading';

const csvHeaders = [
  { label: 'Name', key: 'name' },
  { label: 'Primary Email', key: 'email' },
  { label: 'Primary Phone', key: 'phoneNumber' },
  { label: 'External Ref ID', key: 'extRefId' },
  { label: 'User Type', key: 'userType' },
  { label: 'Customer Journey Stage', key: 'subStatus' },
  { label: 'User State', key: 'state' },
  { label: 'Expiration Date', key: 'expiresAt' }
];

export default function UserHeader({
  setCampaignOption,
  handleSearchClick,
  filterObject,
  csvObject
}) {
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState('');
  const { t } = useTranslation(['users', 'common']);
  const anchorRef = useRef(null);
  const theme = useTheme();
  const classes = useStyles();
  const options = {
    all: 'All',
    all_on_the_page: 'All on this page',
    none: 'none'
  };

  const selectedOptions =
    selectedKey === 'none' || selectedKey === '' ? 'select' : objectAccessor(options, selectedKey);

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleMenuItemClick(key) {
    setCampaignOption(key);
    setSelectedKey(key);
    setOpen(false);
  }

  function handleFilter(e) {
    e.stopPropagation();
    filterObject.toggleFilterMenu();
  }

  return (
    <>
      <Grid container>
        <Grid item lg={12} md={12} sm={12}>
          <Typography variant="h5">Users</Typography>
        </Grid>
        <Grid item lg={3} md={3} sm={3}>
          <SelectButton
            buttonText={selectedOptions}
            open={open}
            anchorEl={anchorRef.current}
            anchorRef={anchorRef}
            handleClose={handleClose}
            options={options}
            selectedKey={selectedKey}
            handleMenuItemClick={handleMenuItemClick}
            handleClick={() => setOpen(!open)}
          />
        </Grid>
        <Grid item lg={4} md={4} sm={4}>
          <SearchInput
            title="Users"
            handleClick={handleSearchClick}
            searchValue=""
            handleFilter={handleFilter}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <Grid container alignItems="center" style={{ width: '40%' }}>
              <div className="d-flex justify-content-center row" data-testid="label_error">
                <span>{filterObject.labelError}</span>
              </div>
            </Grid>

            <Grid
              container
              justify="flex-end"
              style={{
                width: '100.5%',
                position: 'absolute',
                zIndex: 1,
                marginTop: '-2px',
                display: filterObject.displayBuilder
              }}
            >
              <QueryBuilder
                handleOnChange={filterObject.handleQueryOnChange}
                builderConfig={filterObject.queryBuilderConfig}
                initialQueryValue={filterObject.queryBuilderInitialValue}
                addRuleLabel="add filter"
              />
            </Grid>
          </div>
        </Grid>
        <Grid item lg={4} md={4} sm={4} className={classes.csvButtonGrid}>
          <Button variant="contained" color="primary" data-testid="download_csv_btn" className={classes.csvButton}>
            {!csvObject.called ? (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <span
                role="button"
                tabIndex={0}
                aria-label="download csv"
                style={{color: 'white'}}
                onClick={csvObject.handleDownloadCSV}
              >
                {csvObject.usersLoading ? <Spinner /> : t('users.process_csv')}
              </span>
            ) : (
              <CSVLink
                data={csvObject.csvUserData || []}
                headers={csvHeaders}
                style={{ color: 'white', textDecoration: 'none' }}
                filename={`user-data-${dateToString(new Date())}.csv`}
                data-testid="download-csv"
              >
                {csvObject.usersLoading ? <Spinner /> : t('users.download_csv')}
              </CSVLink>
            )}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

export const useStyles = makeStyles(() => ({
  csvButtonGrid: {
    textAlign: 'right'
  },
  csvButton: {
    color: 'white'
  }
}))
