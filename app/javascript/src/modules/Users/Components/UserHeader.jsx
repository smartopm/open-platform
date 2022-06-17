/* eslint-disable max-lines */
/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined';
import { CSVLink } from 'react-csv';
import SelectButton from '../../../shared/buttons/SelectButton';
import { dateToString } from '../../../utils/dateutil';
import { Spinner } from '../../../shared/Loading';
import MenuList from '../../../shared/MenuList';
import UsersActionMenu from './UsersActionMenu';
import MessageAlert from '../../../components/MessageAlert';
import SearchInput from '../../../shared/search/SearchInput';

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

// export default function UserHeader({
//   setCampaignOption,
//   handleSearchClick,
//   filterObject,
//   csvObject,
//   menuObject,
//   actionObject
// }) {
//   const matches = useMediaQuery('(max-width:959px)');
//   const hideMdDown = useMediaQuery(theme => theme.breakpoints.down('md'));
//   const hideMdUp = useMediaQuery(theme => theme.breakpoints.up('md'));
//   const { t } = useTranslation(['users', 'common']);
//   const classes = useStyles();

//   return (
//     <Grid container>
//       <Grid item lg={12} md={12} sm={12} xs={12} data-testid="title">
//         <Typography variant="h4">Users</Typography>
//       </Grid>
//       <Grid container className={classes.container} data-testid="select">
//         <Grid item lg={4} md={4} sm={12} xs={12}>
//           {/* <div className={matches ? classes.search : undefined}>
//             <SearchInput
//               title="Users"
//               handleClick={handleSearchClick}
//               searchValue=""
//               handleFilter={handleFilter}
//             />
//           </div> */}
//           <div
//             style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               position: 'relative'
//             }}
//           >
//             <Grid container alignItems="center" style={{ width: '40%' }}>
//               <div className="d-flex justify-content-center row" data-testid="label_error">
//                 <span>{filterObject.labelError}</span>
//               </div>
//             </Grid>

//             <Grid
//               container
//               style={{
//                 width: '200%',
//                 position: 'absolute',
//                 zIndex: 1,
//                 marginTop: '-2px',
//                 display: filterObject.displayBuilder
//               }}
//             >
//               <QueryBuilder
//                 handleOnChange={filterObject.handleQueryOnChange}
//                 builderConfig={filterObject.queryBuilderConfig}
//                 initialQueryValue={filterObject.queryBuilderInitialValue}
//                 addRuleLabel="add filter"
//               />
//             </Grid>
//           </div>
//         </Grid>
//         {!hideMdUp && (
//           <>
//             <Grid item lg={12} md={12} sm={6} xs={6}>
//               <UsersActionMenu
//                 campaignCreateOption={actionObject.campaignCreateOption}
//                 selectedUsers={actionObject.selectedUsers}
//                 handleCampaignCreate={actionObject.handleCampaignCreate}
//                 handleLabelSelect={actionObject.handleLabelSelect}
//                 usersCountData={actionObject.usersCountData}
//                 labelsData={actionObject.labelsData}
//                 labelsRefetch={actionObject.labelsRefetch}
//                 viewFilteredUserCount={actionObject.viewFilteredUserCount}
//                 userList={actionObject.userList}
//                 copyToClipBoard={copyToClipBoard}
//               />
//             </Grid>
//           </>
//         )}
//         <Grid
//           item
//           lg={4}
//           md={4}
//           sm={6}
//           xs={6}
//           className={matches ? undefined : classes.csvButtonGrid}
//         >
//           <Button
//             variant="contained"
//             color="primary"
//             data-testid="download_csv_btn"
//             className={classes.csvButton}
//           >
//             {!csvObject.called ? (
//               // eslint-disable-next-line jsx-a11y/click-events-have-key-events
//               <span
//                 role="button"
//                 tabIndex={0}
//                 aria-label="download csv"
//                 style={{ color: 'white' }}
//                 onClick={csvObject.handleDownloadCSV}
//               >
//                 {csvObject.usersLoading ? <Spinner /> : t('users.process_csv')}
//               </span>
//             ) : (
//               <CSVLink
//                 data={csvObject.csvUserData || []}
//                 headers={csvHeaders}
//                 style={{ color: 'white', textDecoration: 'none' }}
//                 filename={`user-data-${dateToString(new Date())}.csv`}
//                 data-testid="download-csv"
//               >
//                 {csvObject.usersLoading ? <Spinner /> : t('users.download_csv')}
//               </CSVLink>
//             )}
//           </Button>
//         </Grid>
//         <Grid item lg={1} md={1} sm={6} xs={6} className={classes.csvButtonGrid}>
//           <IconButton
//             aria-controls="sub-menu"
//             aria-haspopup="true"
//             onClick={menuObject.handleMenu}
//             data-testid="menu-list"
//             className={classes.reportBtn}
//             size="large"
//           >
//             <MoreVertOutlined />
//           </IconButton>

//           <MenuList
//             open={Boolean(menuObject.menuAnchorEl)}
//             anchorEl={menuObject.menuAnchorEl}
//             handleClose={() => menuObject.setAnchorEl(null)}
//             list={menuObject.menuData}
//           />
//         </Grid>
//       </Grid>
//       {!hideMdDown && (
//         <Grid item lg={12} md={12} sm={6} xs={6}>
//           <UsersActionMenu
//             campaignCreateOption={actionObject.campaignCreateOption}
//             selectedUsers={actionObject.selectedUsers}
//             handleCampaignCreate={actionObject.handleCampaignCreate}
//             handleLabelSelect={actionObject.handleLabelSelect}
//             usersCountData={actionObject.usersCountData}
//             labelsData={actionObject.labelsData}
//             labelsRefetch={actionObject.labelsRefetch}
//             copyToClipBoard={copyToClipBoard}
//           />
//         </Grid>
//       )}
//     </Grid>
//   );
// }

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
  return (
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
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  function copyToClipBoard() {
    navigator.clipboard.writeText(actionObject.selectedUsers.toString());
    setMessageAlert(t('users.copy_id_message'));
    setIsSuccessAlert(true);
  }
  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={() => setMessageAlert('')}
        style={{ marginTop: '40px' }}
      />
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