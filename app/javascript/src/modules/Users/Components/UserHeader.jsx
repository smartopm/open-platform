/* eslint-disable max-lines */
/* eslint-disable react/forbid-prop-types */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import useMediaQuery from '@mui/material/useMediaQuery';
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined';
import { CSVLink } from 'react-csv';
import SelectButton from '../../../shared/buttons/SelectButton';
import { dateToString } from '../../../utils/dateutil';
import { Spinner } from '../../../shared/Loading';
import MenuList from '../../../shared/MenuList';
import UsersActionMenu from './UsersActionMenu';
import SearchInput from '../../../shared/search/SearchInput';
import { SnackbarContext } from '../../../shared/snackbar/Context';

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

export default function UserSelectButton({ setCampaignOption }) {
  const { t } = useTranslation(['users', 'common']);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedKey, setSelectedKey] = useState('');

  const selectOptions = [
    {
      key: 'all',
      value: 'All',
      name: t('common:misc.all'),
      handleMenuItemClick,
      show: true
    },
    {
      key: 'all_on_the_page',
      value: 'All on this page',
      name: t('common:misc.all_this_page'),
      handleMenuItemClick,
      show: true
    },
    {
      key: 'none',
      value: 'none',
      name: t('common:misc.none'),
      handleMenuItemClick,
      show: true
    }
  ];

  function handleClose() {
    setAnchorEl(null);
    setOpen(false);
  }

  function handleMenuItemClick(key) {
    setCampaignOption(key);
    setSelectedKey(key);
    setOpen(false);
  }

  function handleSelectButtonClick(e) {
    setOpen(!open);
    setAnchorEl(e.currentTarget);
  }

  return (
    <SelectButton
      defaultButtonText={t('common:misc.select')}
      open={open}
      anchorEl={anchorEl}
      handleClose={handleClose}
      options={selectOptions}
      selectedKey={selectedKey}
      handleMenuItemClick={handleMenuItemClick}
      handleClick={handleSelectButtonClick}
      mobileIcon={<CheckBoxIcon />}
    />
  );
}

export function UserSearch({ handleSearchClick, filterObject }) {
  function handleFilter(e) {
    e.stopPropagation();
    filterObject.toggleFilterMenu();
  }
  return (
    <SearchInput
      title="Users"
      handleClick={handleSearchClick}
      searchValue=""
      handleFilter={handleFilter}
    />
  );
}

export function UserProcessCSV({ csvObject }) {
  const classes = useStyles();
  const { t } = useTranslation(['users', 'common']);
  const smMatches = useMediaQuery('(max-width:900px)');
  return (
    <Button
      variant="contained"
      color="primary"
      data-testid="download_csv_btn"
      className={classes.csvButton}
      disableElevation
      style={{margin: '0 5px 0 8px'}}
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
          {csvObject.usersLoading ? <Spinner /> : smMatches ? 'CSV' : t('users.process_csv')}
        </span>
      ) : (
        <CSVLink
          data={csvObject.csvUserData || []}
          headers={csvHeaders}
          style={{ color: 'white', textDecoration: 'none' }}
          filename={`user-data-${dateToString(new Date())}.csv`}
          data-testid="download-csv"
        >
          {csvObject.usersLoading ? <Spinner /> : smMatches ? 'CSV' : t('users.download_csv')}
        </CSVLink>
      )}
    </Button>
  );
}

export function UserMenuitems({ menuObject }) {
  const classes = useStyles();
  return (
    <>
      <IconButton
        aria-controls="sub-menu"
        aria-haspopup="true"
        onClick={menuObject.handleMenu}
        data-testid="menu-list"
        className={classes.reportBtn}
        size="large"
        color='primary'
      >
        <MoreVertOutlined />
      </IconButton>

      <MenuList
        open={Boolean(menuObject.menuAnchorEl)}
        anchorEl={menuObject.menuAnchorEl}
        handleClose={() => menuObject.setAnchorEl(null)}
        list={menuObject.menuData}
      />
    </>
  );
}

export function UserActionSelectMenu({ actionObject }) {
  const { t } = useTranslation(['users', 'common']);
  const { showSnackbar, messageType } = useContext(SnackbarContext);

  function copyToClipBoard() {
    navigator.clipboard.writeText(actionObject.selectedUsers.toString());
    showSnackbar({type: messageType.success, message: t('users.copy_id_message')});
  }
  return (
    <>
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
        copyToClipBoard={copyToClipBoard}
      />
    </>
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

UserSelectButton.propTypes = {
  setCampaignOption: PropTypes.func.isRequired
};

UserProcessCSV.propTypes = {
  csvObject: PropTypes.object.isRequired
};

UserMenuitems.propTypes = {
  menuObject: PropTypes.object.isRequired
};

UserActionSelectMenu.propTypes = {
  actionObject: PropTypes.object.isRequired
};

UserSearch.propTypes = {
  filterObject: PropTypes.object.isRequired,
  handleSearchClick: PropTypes.func.isRequired
}