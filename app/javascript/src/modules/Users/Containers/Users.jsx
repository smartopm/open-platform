/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from 'react'
import { useQuery, useMutation, useLazyQuery } from 'react-apollo'
import { Redirect, useLocation, useHistory} from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Button, Divider, IconButton, InputBase, Grid, Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import FilterListIcon from '@material-ui/icons/FilterList'
import MaterialConfig from 'react-awesome-query-builder/lib/config/material'
import MoreVertOutlined from '@material-ui/icons/MoreVertOutlined';
import { CSVLink } from 'react-csv';
import Loading, { Spinner } from '../../../shared/Loading'
import ErrorPage from '../../../components/Error'
import { UsersDetails, LabelsQuery, UsersCount } from '../../../graphql/queries'
import {
  CreateNote,
  UserLabelCreate,
  CampaignCreateThroughUsers
} from '../../../graphql/mutations'
import { ModalDialog, ActionDialog } from '../../../components/Dialog'
import { userType, subStatus } from '../../../utils/constants'
import Paginate from '../../../components/Paginate'
import UserListCard from '../Components/UserListCard'
import UsersActionMenu from '../Components/UsersActionMenu'
import QueryBuilder from '../../../components/QueryBuilder'
import { dateToString } from '../../../utils/dateutil'

import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'
import { pluralizeCount, objectAccessor, toTitleCase } from '../../../utils/helpers'
import SubStatusReportDialog from '../../CustomerJourney/Components/SubStatusReport'
import MenuList from '../../../shared/MenuList'

const limit = 25
const USERS_CAMPAIGN_WARNING_LIMIT = 2000

const csvHeaders = [
  { label: "Name", key: "name" },
  { label: 'Primary Email', key: 'email' },
  { label: 'Primary Phone', key: 'phoneNumber' },
  { label: 'External Ref ID', key: 'extRefId' },
  { label: 'User Type', key: 'userType' },
  { label: 'Customer Journey Stage', key: 'subStatus' },
  { label: 'User State', key: 'state' },
  { label: 'Expiration Date', key: 'expiresAt' },
];

export default function UsersList() {
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [offset, setOffset] = useState(0);
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setId] = useState('');
  const [userName, setName] = useState('');
  const [displayBuilder, setDisplayBuilder] = useState('none');
  const [filterCount, setFilterCount] = useState(0);
  const [modalAction, setModalAction] = useState('');
  const [noteCreate, { loading: mutationLoading }] = useMutation(CreateNote);
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
  const theme = useTheme();


  function handleReportDialog(){
    setSubstatusReportOpen(!substatusReportOpen)
    setAnchorEl(null)
  }

  const { loading, error, data, refetch } = useQuery(UsersDetails, {
    variables: {
      query: searchQuery,
      limit,
      offset
    },
    fetchPolicy: 'cache-and-network'
  })

  const [loadAllUsers, { loading: usersLoading, data: usersData, called }] = useLazyQuery(
    UsersDetails,
    {
      // TODO: have a separate query with no limits
      variables: { limit: 2000, query: searchQuery },
      errorPolicy: 'all'
    }
  );

  let csvUserData;
  let userList;
  if (data) {
    userList = data.users.map(user => user.id)
  }

  if (usersData) {
    csvUserData = usersData.users.map(user => {
      return ({...user, subStatus: toTitleCase(user.subStatus)});
    });
  }

  function getQuery() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return new URLSearchParams(useLocation().search);
  }

  const querry = getQuery()

  useEffect(() => {
    if (filterCount !== 0) {
      setOffset(0)
      fetchUsersCount()
    } else {
      const offsetParams = querry.get('offset')
      setOffset(Number(offsetParams))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCount])

  useEffect(() => {
    if (location?.state) {
      if (location?.state?.query === 0) {
        setSearchQuery(`user_type = "resident"`)
      } else {
        setSearchQuery(`sub_status = "${location?.state?.query - 1}"`)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleDownloadCSV(){
    loadAllUsers()
  }

  // TODO: @dennis, add pop up for notes
  const [userLabelCreate] = useMutation(UserLabelCreate)
  const {
    loading: labelsLoading,
    error: labelsError,
    data: labelsData,
    refetch: labelsRefetch
  } = useQuery(LabelsQuery)

  const [fetchUsersCount, { data: usersCountData, loading: fetchingUsersCount }] = useLazyQuery(UsersCount, {
    variables: { query: searchQuery }
  })

  function handleQueryOnChange(selectedOptions) {
    if (selectedOptions) {
      const andConjugate = selectedOptions.logic?.and
      const orConjugate = selectedOptions.logic?.or
      const availableConjugate = andConjugate || orConjugate
      if (availableConjugate) {
        const conjugate = andConjugate ? 'AND' : 'OR'
        const query = availableConjugate
          .map(option => {
            let operator = Object.keys(option)[0]
            // skipped nested object accessor here until fully tested
            // eslint-disable-next-line security/detect-object-injection
            const property = filterFields[option[operator][0].var]
            let value = objectAccessor(option, operator)[1]

            if (operator === '==') operator = '=' // make = the default operator
            if (property === 'date_filter') {
              operator = '>'
              value = dateToString(value)
            }
            if(property === 'phone_number') operator = ':'

            return `${property} ${operator} "${value}"`
          })
          .join(` ${conjugate} `)
        setSearchQuery(query)
        setFilterCount(availableConjugate.length)
      }
    }
  }

  function handleFilterUserBySubstatus(index){
    if (index === 0) {
      setSearchQuery(`user_type = "resident"`)
    } else {
      setSearchQuery(`sub_status = "${index - 1}"`)
    }
    handleReportDialog()
  }
  function handleSaveNote() {
    let noteType = ''
    if (modalAction === 'Answered') {
      noteType = 'Outgoing Call Answered: '
    } else if (modalAction === 'Missed') {
      noteType = 'Outgoing Call not Answered: '
    }
    noteCreate({
      variables: { userId, body: noteType + note, flagged: false }
    }).then(() => {
      refetch()
      setIsDialogOpen(!isDialogOpen)
      setNote('')
    })
  }
  function handleNoteModal(noteUserId = '', username = '', noteType = '') {
    setId(noteUserId)
    setName(username)
    setIsDialogOpen(!isDialogOpen)
    const NoteTypes = {
      Note: 'Note',
      Answered: 'Answered',
      Missed: 'Missed'
    }
    setModalAction(objectAccessor(NoteTypes, noteType))
  }

  function inputToSearch() {
    setRedirect('/search')
  }

  function checkUserList(){
    if (
      !!selectedUsers.length &&
      !!userList.length &&
      selectedUsers.length === userList.length
    ) {
      setSelectedUsers([])
      setCampaignCreateOption('none')
    }
  }

  function paginate(action) {
    if (action === 'prev') {
      if (offset < limit) {
        return
      }
      setOffset(offset - limit)
      checkUserList()
    } else {
      setOffset(offset + limit)
      checkUserList()
    }
  }

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none')
    } else {
      setDisplayBuilder('')
    }
  }

  function handleLabelSelect(labels) {
    let createLimit = null
    if (campaignCreateOption === 'all_on_the_page') createLimit = limit
    if (userList) {
      userLabelCreate({
        variables: {
          query: searchQuery,
          limit: createLimit,
          labelId: labels.flatMap(l => l.id || []).toString(),
          userList: selectedUsers.toString()
        }
      })
        .then(() => {
          refetch()
        })
        .catch(labelErr => {
          setError(labelErr.message)
        })
    }
  }

  function setCampaignOption(option) {
    setCampaignCreateOption(option)
    if (option === 'all') {
      fetchUsersCount()
      setSelectedUsers([])
      setSelectCheckBox(true)
    }
    if (option === 'all_on_the_page') {
      setSelectCheckBox(false)
      setSelectedUsers(userList)
    }
    if (option === 'none') {
      setSelectCheckBox(false)
      setSelectedUsers([])
    }
  }

  function setSelectAll() {
    if (
      !!selectedUsers.length &&
      !!userList.length &&
      selectedUsers.length === userList.length
    ) {
      setSelectedUsers([])
      setCampaignCreateOption('none')
    } else if (selectCheckBox) {
      setSelectCheckBox(false)
      setCampaignCreateOption('none')
    } else {
      setSelectedUsers(userList)
      setCampaignCreateOption('all_on_the_page')
    }
  }

  function handleUserSelect(user) {
    if (selectedUsers.length === 0) setCampaignCreateOption('none')

    let newSelected = []
    if (selectedUsers.includes(user.id)) {
      newSelected = selectedUsers.filter(id => id !== user.id)
    } else {
      newSelected = selectedUsers.concat(user.id)
    }
    setSelectedUsers(newSelected)
  }

  function createCampaign() {
    let createLimit = null
    if (campaignCreateOption === 'all_on_the_page') createLimit = limit
    campaignCreate({
      variables: { query: searchQuery, limit: createLimit, userList: selectedUsers.toString() }
    })
      .then(res => {
        // eslint-disable-next-line no-shadow
        const { data } = res
        setRedirect(`/campaign/${data.campaignCreateThroughUsers.campaign.id}`)
      })
      .catch(campaignError => {
        setError(campaignError.message)
      })
  }

  function handleCampaignCreate() {
    if (
      campaignCreateOption === 'all' &&
      usersCountData.usersCount > USERS_CAMPAIGN_WARNING_LIMIT
    ) {
      setOpenCampaignWarning(true)
      return
    }
    createCampaign()
  }

  function viewFilteredUserCount(){
    return (
      filterCount !== 0 ||
      campaignCreateOption === 'all' ||
      campaignCreateOption === 'all_on_the_page'
    );
  }

  if (labelsLoading) return <Loading />
  if (error || labelsError){
    return <ErrorPage error={error?.message || labelsError?.message} />
  }
  if (redirect) {
    return (
      <Redirect
        push
        to={{
          pathname: redirect,
          state: { from: '/users' }
        }}
      />
    )
  }

  const InitialConfig = MaterialConfig
  const queryBuilderConfig = {
    ...InitialConfig,
    fields: {
      role: {
        label: 'Role',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: Object.entries(userType).map(([key, val]) => {
            return { value: key, title: val }
          })
        }
      },
      label: {
        label: 'Label',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: labelsData.labels.map(label => {
            return { value: label.shortDesc, title: label.shortDesc }
          })
        }
      },
      phoneNumber: {
        label: 'Phone Number',
        type: 'text',
        valueSources: ['value']
      },
      loginAfter: {
        label: 'Login After',
        type: 'date',
        valueSources: ['value'],
        excludeOperators: ['not_equal']
      },
      subStatus: {
        label: 'Sub Status',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: Object.entries(subStatus).map(([key, val]) => {
            return { value: key, title: val }
          })
        }
      }
    },
    widgets: {
      ...InitialConfig.widgets,
      date: {
        ...InitialConfig.widgets.date,
        dateFormat: "YYYY.MM.DD",
        valueFormat: "YYYY-MM-DD",
      }
    }
  }

  const queryBuilderInitialValue = {
    // Just any random UUID
    id: '76a8a9ba-0123-3344-c56d-b16e532c8cd0',
    type: 'group',
    children1: {
      '98a8a9ba-0123-4456-b89a-b16e721c8cd0': {
        type: 'rule',
        properties: {
          field: 'role',
          operator: 'select_equals',
          value: [''],
          valueSrc: ['value'],
          valueType: ['select']
        }
      }
    }
  }

  const filterFields = {
    role: 'user_type',
    label: 'labels',
    phoneNumber: 'phone_number',
    loginAfter: 'date_filter',
    subStatus: 'sub_status'
  }

  const menuData = [
    {
      content: t('users.upload'),
      isVisible: true,
      handleClick: () => history.push('/users/import')
    },
    {
      content: t('users.create_report'),
      isVisible: true,
      handleClick: () => handleReportDialog()
    },
    {
      content: t('users.user_stats'),
      isVisible: true,
      handleClick: () => history.push('/users/stats')
    },
  ]

  function handleMenu(event){
    setAnchorEl(event.currentTarget);
  }

  return (
    <>
      <div className="container">
        <ActionDialog
          open={openCampaignWarning}
          handleClose={() => setOpenCampaignWarning(false)}
          handleOnSave={createCampaign}
          message={t('users.message_campaign')}
        />
        <ModalDialog
          handleClose={handleNoteModal}
          handleConfirm={handleSaveNote}
          open={isDialogOpen}
        >
          {modalAction === 'Note' && (
            <div className="form-group">
              <h6>
                {t('users.add_note')}
                {' '}
                <strong>{userName}</strong>
                {' '}
              </h6>
              <input
                className="form-control"
                type="text"
                value={note}
                onChange={event => setNote(event.target.value)}
                name="note"
                placeholder={t('common:form_placeholders.action_note')}
              />
              {mutationLoading && (
                <p className="text-center">{t('users.save_note')}</p>
              )}
            </div>
          )}
          {modalAction === 'Answered' && (
            <div className="form-group">
              <h6>
                {t('users.add_outgoing_calls_answered')}
                {' '}
                <strong>{userName}</strong>
                {' '}
              </h6>
              <input
                className="form-control"
                type="call"
                value={note}
                onChange={event => setNote(event.target.value)}
                name="note"
                placeholder={t('common:form_placeholders.action_note')}
              />
              {mutationLoading && (
                <p className="text-center">{t('users.save_note')}</p>
              )}
            </div>
          )}
          {modalAction === 'Missed' && (
            <div className="form-group">
              <h6>
                {t('users.add_outgoing_calls_answered')}
                {' '}
                <strong>{userName}</strong>
                {' '}
              </h6>
              <input
                className="form-control"
                type="call"
                value={note}
                onChange={event => setNote(event.target.value)}
                name="note"
                placeholder={t('common:form_placeholders.action_note')}
              />
              {mutationLoading && (
              <p className="text-center">{t('users.save_note')}</p>
              )}
            </div>
          )}
        </ModalDialog>
        <SubStatusReportDialog
          open={substatusReportOpen}
          handleClose={handleReportDialog}
          handleFilter={handleFilterUserBySubstatus}
        />
        <div className={classes.root}>
          <>
            <InputBase
              className={classes.input}
              type="text"
              placeholder={t('common:form_placeholders.search_user')}
              onFocus={inputToSearch}
              inputProps={{ 'aria-label': 'search User', 'data-testid': 'search_user' }}
            />
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
              onClick={toggleFilterMenu}
            >
              <FilterListIcon />
            </IconButton>
            <div style={{ margin: '10px 19px 10px 0' }}>
              {filterCount
                ? `${filterCount} ${pluralizeCount(filterCount, 'Filter')}`
                : t('common:misc.filter')}
            </div>
            <div className={classes.searchButton}>
              <Button
                variant="outlined"
                color="primary"
                className={classes.reportBtn}
                data-testid="download_csv_btn"
              >
                {
                !called ? (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                  <span role="button" tabIndex={0} aria-label="download csv" color="textPrimary" onClick={handleDownloadCSV}>
                    {usersLoading ? <Spinner /> : t('users.process_csv')}
                  </span>
                )
                : (
                  <CSVLink
                    data={csvUserData || []}
                    headers={csvHeaders}
                    style={{ color: theme.palette.primary.main }}
                    filename={`user-data-${dateToString(new Date())}.csv`}
                    data-testid="download-csv"
                  >
                    {usersLoading ? <Spinner /> : t('users.download_csv')}
                  </CSVLink>
                )
              }

              </Button>
              <IconButton
                aria-controls="sub-menu"
                aria-haspopup="true"
                onClick={handleMenu}
                data-testid="menu-list"
                className={classes.reportBtn}
              >
                <MoreVertOutlined />
              </IconButton>

              <MenuList
                open={Boolean(menuAnchorEl)}
                anchorEl={menuAnchorEl}
                handleClose={() => setAnchorEl(null)}
                list={menuData}
              />
            </div>
          </>
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
              <span>{labelError}</span>
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
              display: displayBuilder
            }}
          >
            <QueryBuilder
              handleOnChange={handleQueryOnChange}
              builderConfig={queryBuilderConfig}
              initialQueryValue={queryBuilderInitialValue}
              addRuleLabel={t('common:misc.add_filter')}
            />
          </Grid>
        </div>
        <br />
        {loading || labelsLoading || fetchingUsersCount ? (
          <Loading />
        ) : (
          <>
            {// eslint-disable-next-line no-nested-ternary
            viewFilteredUserCount() && (
              <Typography variant="h6">
                {`Showing ${usersCountData?.usersCount || userList.length} ${pluralizeCount((usersCountData?.usersCount || userList.length), 'Result')}`}
              </Typography>
              )
}
            <br />
            <UsersActionMenu
              campaignCreateOption={campaignCreateOption}
              setCampaignCreateOption={setCampaignOption}
              selectedUsers={selectedUsers}
              userList={userList}
              setSelectAllOption={setSelectAll}
              handleCampaignCreate={handleCampaignCreate}
              handleLabelSelect={handleLabelSelect}
              usersCountData={usersCountData}
              selectCheckBox={selectCheckBox}
              labelsData={labelsData}
              labelsRefetch={labelsRefetch}
            />
            <UserListCard
              userData={data}
              handleNoteModal={handleNoteModal}
              currentUserType={authState.user.userType}
              handleUserSelect={handleUserSelect}
              selectedUsers={selectedUsers}
              offset={offset}
              selectCheckBox={selectCheckBox}
            />
            <Grid
              container
              direction="row"
              justify="center"
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
      </div>
    </>
  )
}

export const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'right',
    width: '100%'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  table: {
    display: 'block',
    width: '100%',
    overflowX: 'auto'
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    maxWidth: '100%'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  filterButton: {
    textTransform: 'none'
  },
  searchButton: {
    display: 'flex'
  },
  reportBtn: {
    display: 'flex',
    height: 36,
    marginLeft: 20
  },
  '@media only screen and (max-width: 768px)': {
    searchButton: {
      flexBasis: '100%'
    },
  },
  download: {
    boxShadow: 'none',
    position: 'fixed',
    bottom: 30,
    right: 57,
    marginLeft: '30%',
    zIndex: '1000'
  }
}))
