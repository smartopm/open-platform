/* eslint-disable max-lines */
/* eslint-disable complexity */
/* eslint-disable max-statements */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from 'react';
import { useQuery, useMutation, useLazyQuery } from 'react-apollo';
import { Redirect, useLocation, useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import MuiConfig from 'react-awesome-query-builder/lib/config/mui';
import { Spinner } from '../../../shared/Loading';
import ErrorPage from '../../../components/Error';
import { UsersDetails, LabelsQuery, UsersCount } from '../../../graphql/queries';
import { UserLabelCreate, CampaignCreateThroughUsers } from '../../../graphql/mutations';
import { ActionDialog } from '../../../components/Dialog';
import { userType, subStatus } from '../../../utils/constants';
import Paginate from '../../../components/Paginate';
import UserListCard from '../Components/UserListCard';
import { dateToString } from '../../../utils/dateutil';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { objectAccessor, toTitleCase } from '../../../utils/helpers';
import SubStatusReportDialog from '../../CustomerJourney/Components/SubStatusReport';
import UserSelectButton, {
  UserSearch,
  UserProcessCSV,
  UserMenuitems,
  UserActionSelectMenu,
} from '../Components/UserHeader';
import QueryBuilder from '../../../components/QueryBuilder';
import PageWrapper from '../../../shared/PageWrapper';

const limit = 25;
const USERS_CAMPAIGN_WARNING_LIMIT = 2000;

export default function UsersList() {
  const [redirect, setRedirect] = useState(false);
  const [offset, setOffset] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayBuilder, setDisplayBuilder] = useState('none');
  const [filterCount, setFilterCount] = useState(0);
  const authState = useContext(AuthStateContext);
  const [labelError, setError] = useState('');
  const [campaignCreate] = useMutation(CampaignCreateThroughUsers);
  const [campaignCreateOption, setCampaignCreateOption] = useState('none');
  const [openCampaignWarning, setOpenCampaignWarning] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectCheckBox, setSelectCheckBox] = useState(false);
  const [substatusReportOpen, setSubstatusReportOpen] = useState(false);
  const [menuAnchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation(['users', 'common']);
  function handleReportDialog() {
    setSubstatusReportOpen(!substatusReportOpen);
    setAnchorEl(null);
  }
  const currentQueryPath = decodeURIComponent(location.search).replace('?', '');
  const { loading, error, data, refetch } = useQuery(UsersDetails, {
    variables: {
      query: searchQuery.length === 0 ? currentQueryPath : searchQuery,
      limit,
      offset,
    },
    fetchPolicy: 'cache-and-network',
  });

  const matches = useMediaQuery('(max-width:959px)');

  const [loadAllUsers, { loading: usersLoading, data: usersData, called }] = useLazyQuery(
    UsersDetails,
    {
      // TODO: have a separate query with no limits
      variables: {
        limit: 2000,
        query: searchQuery,
      },
      errorPolicy: 'all',
    }
  );

  let csvUserData;
  let userList;
  if (data) {
    userList = data.users.map(user => user.id);
  }

  if (usersData) {
    csvUserData = usersData.users.map(user => {
      return { ...user, subStatus: toTitleCase(user.subStatus) };
    });
  }

  function getQuery() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return new URLSearchParams(useLocation().search);
  }

  const querry = getQuery();

  useEffect(() => {
    if (filterCount !== 0) {
      setOffset(0);
      fetchUsersCount();
    } else {
      const offsetParams = querry.get('offset');
      setOffset(Number(offsetParams));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCount]);

  useEffect(() => {
    if (location?.state) {
      if (location?.state?.query === 0) {
        setSearchQuery(`user_type = "resident"`);
      } else {
        setSearchQuery(`sub_status = "${location?.state?.query - 1}"`);
      }
    }
    if (location.pathname === '/leads/users') {
      setSearchQuery(
        `${
          searchQuery || currentQueryPath ? `${searchQuery || currentQueryPath} AND` : ''
        } user_type="lead"`
      );
    }
  }, [currentQueryPath, location]);

  function handleDownloadCSV() {
    loadAllUsers();
  }

  // TODO: @dennis, add pop up for notes
  const [userLabelCreate] = useMutation(UserLabelCreate);
  const {
    loading: labelsLoading,
    error: labelsError,
    data: labelsData,
    refetch: labelsRefetch,
  } = useQuery(LabelsQuery);

  const [fetchUsersCount, { data: usersCountData, loading: fetchingUsersCount }] = useLazyQuery(
    UsersCount,
    {
      variables: { query: searchQuery },
    }
  );

  function handleQueryOnChange(selectedOptions) {
    if (selectedOptions) {
      const andConjugate = selectedOptions.logic?.and;
      const orConjugate = selectedOptions.logic?.or;
      const availableConjugate = andConjugate || orConjugate;
      if (availableConjugate) {
        const conjugate = andConjugate ? 'AND' : 'OR';
        const query = availableConjugate
          .map(option => {
            let operator = Object.keys(option)[0];
            // skipped nested object accessor here until fully tested
            // eslint-disable-next-line security/detect-object-injection
            const property = filterFields[option[operator][0].var];
            let value = objectAccessor(option, operator)[1];

            if (operator === '==') operator = '='; // make = the default operator
            if (property === 'date_filter') {
              operator = '>';
              value = dateToString(value);
            }
            if (property === 'created_date_from_filter') {
              operator = '>=';
              value = dateToString(value);
            }
            if (property === 'created_date_to_filter') {
              operator = '<=';
              value = dateToString(value);
            }
            if (property === 'phone_number') operator = ':';

            return `${property} ${operator} "${value}"`;
          })
          .join(` ${conjugate} `);
        setSearchQuery(query);
        // push from current pathname to match both /users and /leads/users
        history.push({ pathname: location.pathname, search: query });
        setFilterCount(availableConjugate.length);
      }
    }
  }

  function handleFilterUserBySubstatus(index) {
    if (index === 0) {
      setSearchQuery(`user_type = "resident"`);
    } else {
      setSearchQuery(`sub_status = "${index - 1}"`);
    }
    handleReportDialog();
  }

  function inputToSearch() {
    setRedirect('/search');
  }

  function checkUserList() {
    if (!!selectedUsers.length && !!userList.length && selectedUsers.length === userList.length) {
      setSelectedUsers([]);
      setCampaignCreateOption('none');
    }
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return;
      }
      setOffset(offset - limit);
      checkUserList();
    } else {
      setOffset(offset + limit);
      checkUserList();
    }
  }

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none');
    } else {
      setDisplayBuilder('');
    }
  }

  function handleLabelSelect(labels) {
    let createLimit = null;
    if (campaignCreateOption === 'all_on_the_page') createLimit = limit;
    if (userList) {
      userLabelCreate({
        variables: {
          query: searchQuery,
          limit: createLimit,
          labelId: labels.flatMap(l => l.id || []).toString(),
          userList: selectedUsers.toString(),
        },
      })
        .then(() => {
          refetch();
        })
        .catch(labelErr => {
          setError(labelErr.message);
        });
    }
  }

  function setCampaignOption(option) {
    setCampaignCreateOption(option);
    if (option === 'all') {
      fetchUsersCount();
      setSelectedUsers([]);
      setSelectCheckBox(true);
    }
    if (option === 'all_on_the_page') {
      setSelectCheckBox(false);
      setSelectedUsers(userList);
    }
    if (option === 'none') {
      setSelectCheckBox(false);
      setSelectedUsers([]);
    }
  }

  function handleUserSelect(user) {
    if (selectedUsers.length === 0) setCampaignCreateOption('none');

    let newSelected = [];
    if (selectedUsers.includes(user.id)) {
      newSelected = selectedUsers.filter(id => id !== user.id);
    } else {
      newSelected = selectedUsers.concat(user.id);
    }
    setSelectedUsers(newSelected);
  }

  function createCampaign() {
    let createLimit = null;
    if (campaignCreateOption === 'all_on_the_page') createLimit = limit;
    campaignCreate({
      variables: { query: searchQuery, limit: createLimit, userList: selectedUsers.toString() },
    })
      .then(res => {
        // eslint-disable-next-line no-shadow
        const { data } = res;
        setRedirect(`/campaign/${data.campaignCreateThroughUsers.campaign.id}`);
      })
      .catch(campaignError => {
        setError(campaignError.message);
      });
  }

  function handleCampaignCreate() {
    if (
      campaignCreateOption === 'all' &&
      usersCountData.usersCount > USERS_CAMPAIGN_WARNING_LIMIT
    ) {
      setOpenCampaignWarning(true);
      return;
    }
    createCampaign();
  }

  if (labelsLoading) return <Spinner />;
  const err = error || labelsError;
  if (err) {
    return <ErrorPage error={err?.message} />;
  }
  if (redirect) {
    return (
      <Redirect
        push
        to={{
          pathname: redirect,
          search: searchQuery.replace(/"/g, ''),
          state: { from: '/users' },
        }}
      />
    );
  }

  const InitialConfig = MuiConfig;
  const queryBuilderConfig = {
    ...InitialConfig,
    fields: {
      createdDateFrom: {
        label: 'Created Date From',
        type: 'date',
        valueSources: ['value'],
        excludeOperators: ['not_equal'],
      },

      createdDateTo: {
        label: 'Created Date To',
        type: 'date',
        valueSources: ['value'],
        excludeOperators: ['not_equal'],
      },

      role: {
        label: 'Role',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: Object.entries(userType).map(([key, val]) => {
            return { value: key, title: val };
          }),
        },
      },
      label: {
        label: 'Label',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: labelsData?.labels?.map(label => {
            return { value: label.shortDesc, title: label.shortDesc };
          }),
        },
      },
      phoneNumber: {
        label: 'Phone Number',
        type: 'text',
        valueSources: ['value'],
      },
      loginAfter: {
        label: 'Login After',
        type: 'date',
        valueSources: ['value'],
        excludeOperators: ['not_equal'],
      },
      subStatus: {
        label: 'Sub Status',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: Object.entries(subStatus).map(([key, val]) => {
            return { value: key, title: val };
          }),
        },
      },
    },
    widgets: {
      ...InitialConfig.widgets,
      date: {
        ...InitialConfig.widgets.date,
        dateFormat: 'YYYY.MM.DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  };

  if (location.pathname === '/leads/users') {
    // role field shouldn't show up for leads page
    delete queryBuilderConfig.fields.role;
  }

  const queryBuilderInitialValue = {
    // Just any random UUID
    id: '76a8a9ba-0123-3344-c56d-b16e532c8cd0',
    type: 'group',
    children1: {
      '98a8a9ba-0123-4456-b89a-b16e721c8cd0': {
        type: 'rule',
        properties: {
          field: 'phoneNumber',
          operator: 'equal',
          value: [''],
          valueSrc: ['value'],
          valueType: ['text'],
        },
      },
    },
  };

  const filterFields = {
    createdDateFrom: 'created_date_from_filter',
    createdDateTo: 'created_date_to_filter',
    role: 'user_type',
    label: 'labels',
    phoneNumber: 'phone_number',
    loginAfter: 'date_filter',
    subStatus: 'sub_status',
  };

  const menuData = [
    {
      content: t('users.upload'),
      isVisible: true,
      handleClick: () => history.push('/users/import'),
    },
    {
      content: t('users.lead_management_upload'),
      isVisible: true,
      handleClick: () => history.push('/users/leads/import'),
    },

    {
      content: t('users.create_report'),
      isVisible: true,
      handleClick: () => handleReportDialog(),
    },
    {
      content: t('users.user_stats'),
      isVisible: true,
      handleClick: () => history.push('/users/stats'),
    },
  ];

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  const filterObject = {
    labelError,
    displayBuilder,
    handleQueryOnChange,
    queryBuilderConfig,
    queryBuilderInitialValue,
    toggleFilterMenu,
  };

  const csvObject = {
    called,
    handleDownloadCSV,
    usersLoading,
    csvUserData,
  };

  const menuObject = {
    handleMenu,
    menuAnchorEl,
    setAnchorEl,
    menuData,
  };

  const actionObject = {
    campaignCreateOption,
    handleCampaignCreate,
    handleLabelSelect,
    usersCountData,
    selectedUsers,
    labelsData,
    labelsRefetch,
  };

  const rightPanelObj = [
    {
      mainElement: matches ? (
        <IconButton color="primary" data-testid="search" onClick={() => setSearchOpen(!searchOpen)}>
          <SearchIcon />
        </IconButton>
      ) : (
        <Button
          startIcon={<SearchIcon />}
          data-testid="search"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          {t('common:menu.search')}
        </Button>
      ),
      key: 1,
    },
    {
      mainElement: <UserSelectButton setCampaignOption={setCampaignOption} />,
      key: 2,
    },
    {
      mainElement: <UserProcessCSV csvObject={csvObject} />,
      key: 3,
    },
    {
      mainElement: <UserMenuitems actionObject={actionObject} menuObject={menuObject} />,
      key: 4,
    },
  ];

  return (
    <PageWrapper
      pageTitle={t(
        `${location.pathname === '/leads/users' ? 'common:menu.lead_users' : 'common:misc.users'}`
      )}
      rightPanelObj={rightPanelObj}
    >
      <>
        <Container>
          {searchOpen && (
            <>
              <div style={{ width: '50%' }}>
                <UserSearch handleSearchClick={inputToSearch} filterObject={filterObject} />
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <Grid container alignItems="center" style={{ width: '40%' }}>
                  <div className="d-flex justify-content-center row" data-testid="label_error">
                    <span>{filterObject.labelError}</span>
                  </div>
                </Grid>

                <Grid
                  container
                  style={{
                    width: '200%',
                    position: 'absolute',
                    zIndex: 1,
                    marginTop: '-2px',
                    display: filterObject.displayBuilder,
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
            </>
          )}
          {loading || labelsLoading || fetchingUsersCount ? (
            <Spinner />
          ) : (
            <>
              <UserActionSelectMenu actionObject={actionObject} />
              <ActionDialog
                open={openCampaignWarning}
                handleClose={() => setOpenCampaignWarning(false)}
                handleOnSave={createCampaign}
                message={t('users.message_campaign')}
              />
              <SubStatusReportDialog
                open={substatusReportOpen}
                handleClose={handleReportDialog}
                handleFilter={handleFilterUserBySubstatus}
              />
              <UserListCard
                userData={data}
                currentUserType={authState.user.userType}
                handleUserSelect={handleUserSelect}
                selectedUsers={selectedUsers}
                offset={offset}
                selectCheckBox={selectCheckBox}
                refetch={refetch}
              />
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                data-testid="pagination_section"
              >
                <Paginate
                  count={data.users.length}
                  active={offset >= 1}
                  offset={offset}
                  handlePageChange={paginate}
                  limit={limit}
                />
              </Grid>
            </>
          )}
        </Container>
      </>
    </PageWrapper>
  );
}

export const useStyles = makeStyles(() => ({
  userCard: {
    marginTop: '160px',
  },
  userCardMobile: {
    marginTop: '260px',
  },
}));
