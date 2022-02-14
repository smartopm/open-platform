import React, { useState, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MoreVertOutlined from '@material-ui/icons/MoreVertOutlined';
import { CSVLink } from 'react-csv';
import SelectButton from '../../../shared/buttons/SelectButton';
import { objectAccessor } from '../../../utils/helpers';
import SearchInput from '../../../shared/search/SearchInput';
import QueryBuilder from '../../../components/QueryBuilder';
import { dateToString } from '../../../utils/dateutil';
import { Spinner } from '../../../shared/Loading';
import MenuList from '../../../shared/MenuList';
import UsersActionMenu from './UsersActionMenu';

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
  csvObject,
  menuObject,
  actionObject
}) {
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState('');
  const matches = useMediaQuery('(max-width:959px)');
  const { t } = useTranslation(['users', 'common']);
  const anchorRef = useRef(null);
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
    <Grid container>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <Typography variant="h4">Users</Typography>
      </Grid>
      <Grid container className={classes.container}>
        <Hidden smDown>
          <Grid item lg={3} md={3} sm={6} xs={6}>
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
        </Hidden>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <div className={matches ? classes.search : undefined}>
            <SearchInput
              title="Users"
              handleClick={handleSearchClick}
              searchValue=""
              handleFilter={handleFilter}
            />
          </div>
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
        <Hidden mdUp>
          <Grid item lg={3} md={3} sm={6} xs={6}>
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
          <Grid item lg={12} md={12} sm={6} xs={6}>
            <UsersActionMenu
              campaignCreateOption={actionObject.campaignCreateOption}
              selectedUsers={actionObject.selectedUsers}
              handleCampaignCreate={actionObject.handleCampaignCreate}
              handleLabelSelect={actionObject.handleLabelSelect}
              usersCountData={actionObject.usersCountData}
              labelsData={actionObject.labelsData}
              labelsRefetch={actionObject.labelsRefetch}
              viewFilteredUserCount={actionObject.viewFilteredUserCount}
              userList={actionObject.userList}
            />
          </Grid>
        </Hidden>
        <Grid
          item
          lg={4}
          md={4}
          sm={6}
          xs={6}
          className={matches ? undefined : classes.csvButtonGrid}
        >
          <Button
            variant="contained"
            color="primary"
            data-testid="download_csv_btn"
            className={classes.csvButton}
          >
            {!csvObject.called ? (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <span
                role="button"
                tabIndex={0}
                aria-label="download csv"
                style={{ color: 'white' }}
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
        <Grid item lg={1} md={1} sm={6} xs={6} className={classes.csvButtonGrid}>
          <IconButton
            aria-controls="sub-menu"
            aria-haspopup="true"
            onClick={menuObject.handleMenu}
            data-testid="menu-list"
            className={classes.reportBtn}
          >
            <MoreVertOutlined />
          </IconButton>

          <MenuList
            open={Boolean(menuObject.menuAnchorEl)}
            anchorEl={menuObject.menuAnchorEl}
            handleClose={() => menuObject.setAnchorEl(null)}
            list={menuObject.menuData}
          />
        </Grid>
      </Grid>
      <Hidden smDown>
        <Grid item lg={12} md={12} sm={6} xs={6}>
          <UsersActionMenu
            campaignCreateOption={actionObject.campaignCreateOption}
            selectedUsers={actionObject.selectedUsers}
            handleCampaignCreate={actionObject.handleCampaignCreate}
            handleLabelSelect={actionObject.handleLabelSelect}
            usersCountData={actionObject.usersCountData}
            labelsData={actionObject.labelsData}
            labelsRefetch={actionObject.labelsRefetch}
            viewFilteredUserCount={actionObject.viewFilteredUserCount}
            userList={actionObject.userList}
          />
        </Grid>
      </Hidden>
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  csvButtonGrid: {
    textAlign: 'right'
  },
  csvButton: {
    color: 'white'
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  search: {
    margin: '10px 20px 10px 0'
  }
}));
