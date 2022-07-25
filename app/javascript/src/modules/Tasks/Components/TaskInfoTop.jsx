/* eslint-disable max-statements */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { useContext, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Button, Grid, Chip, Typography, IconButton, useMediaQuery, MenuItem } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { makeStyles, useTheme } from '@mui/styles';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Autocomplete from '@mui/material/Autocomplete';
import { useMutation } from 'react-apollo';
import moment from 'moment-timezone'
import DatePickerDialog from '../../../components/DatePickerDialog';
import { UserChip } from './UserChip';
import { formatError, removeNewLines, sanitizeText } from '../../../utils/helpers';
import UserAutoResult from '../../../shared/UserAutoResult';
import { dateToString } from '../../../components/DateContainer';
import AutoSaveField from '../../../shared/AutoSaveField';
import { UpdateNote } from '../../../graphql/mutations';
import MenuList from '../../../shared/MenuList';
import { SnackbarContext } from '../../../shared/snackbar/Context';

export default function TaskInfoTop({
  currentUser,
  users,
  data,
  setDate,
  selectedDate,
  assignUser,
  autoCompleteOpen,
  handleOpenAutoComplete,
  liteData,
  setSearchUser,
  searchUser,
  menuData,
  isAssignee,
  activeReminder,
  handleSplitScreenClose,
  refetch,
  handleTaskComplete,
  forProcess,
  fromLeadPage
}) {
  const { t } = useTranslation(['task', 'common']);
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const history = useHistory();
  const location = useLocation();
  const { processId } = useParams()
  const [taskUpdate] = useMutation(UpdateNote);
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [editingOrderNumber, setEditingOrderNumber] = useState(false);
  const [taskStatus, setTaskStatus] = useState(data.status);

  const { showSnackbar, messageType } = useContext(SnackbarContext);

  const taskStatuses = {
    not_started: t('task.not_started'),
    in_progress: t('task.in_progress'),
    needs_attention: t('task.needs_attention'),
    at_risk: t('task.at_risk'),
    completed: t('task.complete')
  };

  const allowedAssignees = [
    'admin',
    'custodian',
    'security_guard',
    'contractor',
    'site_worker',
    'consultant',
    'developer',
    'lead'
  ];

  const taskPermissions = currentUser?.permissions?.find(
    permissionObject => permissionObject.module === 'note'
  );

  const formPermissions = currentUser?.permissions?.find(
    permissionObject => permissionObject.module === 'forms'
  );

  const canUpdateNote = taskPermissions
    ? taskPermissions.permissions.includes('can_update_note')
    : false;

  const canViewFormUser = formPermissions
    ? formPermissions.permissions.includes('can_view_form_user')
    : false;

  function openParentLink(event, parent) {
    event.preventDefault();
    if (forProcess) {
      history.push(`/processes/${processId}/projects/${parent.id}/tab=processes`);
    } else {
      history.push(`/tasks/${parent.id}`);
    }
  }

  function updateTask(property, value) {
    let convertedValue = value;
    if (property === 'order') {
      convertedValue = Number(value);
    };
    taskUpdate({
      variables: { id: data.id, [property]: convertedValue }
    })
      .then(() => {
        showSnackbar({ type: messageType.success, message: t('task.update_successful') });
        setTimeout(() => {
          refetch();
        }, 500);
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err?.message) });
      });
  }

  function isUnAuthorizedDeveloper() {
    return (
      currentUser.userType === 'developer' &&
      !data.parentNote.assignees.find(assignee => assignee.id === currentUser.id)
    );
  }

  function handleSelectTaskStatus(_event, key) {
    setTaskStatus(key);
    updateTask('status', key);
  }

  return (
    <>
      <MenuList
        open={menuData.open}
        anchorEl={menuData.anchorEl}
        handleClose={menuData.handleClose}
        list={menuData.menuList}
      />
      <Grid container style={!matches ? {paddingTop: '40px'} : {}}>
        {matches && (
          <Grid item xs={12} style={{ marginBottom: '10px' }}>
            <Grid container>
              <Grid item xs={9} style={{ display: 'flex', alignItems: 'center' }}>
                <Breadcrumbs aria-label="breadcrumb">
                  <Typography
                    color="primary"
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    onClick={handleSplitScreenClose}
                    data-testid='back-to-task'
                  >
                    {!fromLeadPage && <KeyboardBackspaceIcon style={{ marginRight: '4px' }} />}
                    {location.pathname.match(/\bprocesses\b/)
                      ? t('task:bread_crumps.summary')
                      : !fromLeadPage
                      ? t('task:bread_crumps.my_tasks')
                      : null}
                  </Typography>
                  {!fromLeadPage && <Typography>{t('task:bread_crumps.task_details')}</Typography>}
                </Breadcrumbs>
              </Grid>
              <Grid item xs={3} style={{ display: 'flex' }}>
                {canUpdateNote && (
                  <IconButton
                    edge="end"
                    onClick={handleTaskComplete}
                    data-testid="task-complete-toggle-button"
                    color="primary"
                    style={{ backgroundColor: 'transparent' }}
                    size="large"
                  >
                    {data.completed ? (
                      <CheckCircleIcon htmlColor="#4caf50" style={{ fontSize: '20px' }} />
                    ) : (
                      <CheckCircleOutlineIcon />
                    )}
                  </IconButton>
                )}
                {isAssignee() && (
                  <IconButton
                    edge="end"
                    onClick={event => menuData.handleTaskInfoMenu(event)}
                    data-testid="alarm"
                    color="primary"
                    size="large"
                  >
                    <AccessAlarmIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid container>
            <Grid item md={9} xs={8} style={{ marginBottom: '24px' }}>
              <TextField
                select
                fullWidth
                disabled={!canUpdateNote}
                margin="normal"
                variant="outlined"
                className={classes.selectLabel}
                id="select-task-status"
                data-testid="select-task-status"
                value={taskStatus || ''}
                label={t('common:misc.select')}
              >
                <MenuItem value="" />
                {Object.entries(taskStatuses).map(([key, val]) => (
                  <MenuItem
                    key={key}
                    selected={key === taskStatus}
                    onClick={event => handleSelectTaskStatus(event, key)}
                    value={key}
                    data-testid="task-status-option"
                  >
                    {val}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {!matches && (
              <Grid item md={3} xs={4} style={{ justifyContent: 'right' }}>
                <Grid container style={{ justifyContent: 'right' }}>
                  {/* TODO: Commenting this out for now: Victor & Bonny to sync with Vanessa and compare check-icon vs select field */}
                  {/* <Grid item md={4} xs={2} style={{ textAlign: 'right' }}>
                {canUpdateNote && (
                <IconButton
                  edge="end"
                  onClick={handleTaskComplete}
                  data-testid="task-info-menu"
                  color="primary"
                  style={{backgroundColor: 'transparent'}}
                >
                  {data.completed ? (
                    <CheckCircleIcon htmlColor="#4caf50" />
                  ) : (
                    <CheckCircleOutlineIcon />
                  )}
                </IconButton>
              )}
              </Grid> */}

                  {isAssignee() && (
                    <Grid item md={4} xs={2} style={{ textAlign: 'right' }}>
                      <IconButton
                        edge="end"
                        onClick={event => menuData.handleTaskInfoMenu(event)}
                        data-testid="set-reminder-button"
                        color="primary"
                        size="large"
                      >
                        <AccessAlarmIcon />
                      </IconButton>
                    </Grid>
                  )}
                  {!fromLeadPage && !location.pathname.match(/\bprocesses\b/) && (
                    <Grid item md={4} xs={1} style={{ textAlign: 'right' }}>
                      <IconButton
                        edge="end"
                        onClick={handleSplitScreenClose}
                        data-testid="close-drawer-button"
                        color="primary"
                        size="large"
                      >
                        <KeyboardTabIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item md={10} xs={12}>
          <AutoSaveField
            value={data.body}
            mutationAction={value => updateTask('body', value)}
            label={t('common:form_fields.title')}
            fieldType='inline'
            canEdit={canUpdateNote}
          />
        </Grid>
      </Grid>
      <Grid item md={12} style={{ marginTop: '24px' }}>
        {data.parentNote && (
          <Grid container className={classes.parentTaskSection}>
            <Grid item xs={5} md={3}>
              <Typography variant="caption" color="textSecondary">
                {t('task.parent_task')}
              </Typography>
            </Grid>
            <Grid item xs={7} md={6}>
              <Typography
                variant="body2"
                color={isUnAuthorizedDeveloper() ? 'inherit' : 'primary'}
                data-testid="parent-note"
                onClick={
                  isUnAuthorizedDeveloper()
                    ? () => {}
                    : event => {
                        openParentLink(event, data.parentNote);
                      }
                }
                className={
                  isUnAuthorizedDeveloper() ? classes.parentTaskDisabled : classes.parentTask
                }
              >
                <span
                  data-testid="task-title"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: sanitizeText(removeNewLines(data.parentNote.body))
                  }}
                />
              </Typography>
            </Grid>
          </Grid>
        )}
        <Grid container className={classes.dueDateSection}>
          <Grid item xs={5} md={3}>
            <Typography variant="caption" color="textSecondary">
              {t('task.due_date_text')}
            </Typography>
          </Grid>
          <Grid
            item
            xs={7}
            md={4}
            className={editingDueDate ? classes.dueDateEnabled : classes.dueDateDisabled}
            onMouseOver={() => setEditingDueDate(true)}
            onMouseLeave={() => setEditingDueDate(false)}
          >
            {canUpdateNote ? (
              <DatePickerDialog
                handleDateChange={date => setDate(date)}
                selectedDate={selectedDate}
                InputProps={{
                  disableUnderline: true,
                  style: { color: moment().isAfter(selectedDate) ? 'red' : '#575757' }
                }}
                t={t}
              />
            ) : (
              <DatePickerDialog disabled t={t} />
            )}
          </Grid>
        </Grid>

        {isAssignee() && (
          <Grid container className={classes.reminderSection}>
            <Grid item xs={5} md={3}>
              <Typography variant="caption" color="textSecondary" data-testid="active-reminder">
                {t('task.active_reminder')}
              </Typography>
            </Grid>
            <Grid item xs={7} md={6} style={{ display: 'flex', justifyContent: 'space-between' }}>
              {activeReminder ? (
                <>
                  <Typography variant="subtitle1">{activeReminder}</Typography>
                </>
              ) : (
                <Typography variant="subtitle1">{t('task.none')}</Typography>
              )}
            </Grid>
          </Grid>
        )}

        <Grid container className={classes.createdAtSection}>
          <Grid item xs={5} md={3}>
            <Typography variant="caption" color="textSecondary" data-testid="date_created_title">
              {t('task.date_created')}
            </Typography>
          </Grid>
          <Grid item xs={7} md={6}>
            <Typography variant="subtitle1" data-testid="date_created">
              {dateToString(data.createdAt)}
            </Typography>
          </Grid>
        </Grid>
        {canUpdateNote && data.parentNote && data.parentNote.subTasksCount > 1 && (
          <Grid container className={classes.taskFieldItem}>
            <Grid item xs={5} md={3}>
              <Typography variant="caption" color="textSecondary" data-testid="order_number_title">
                {t('task.order_number')}
              </Typography>
            </Grid>
            <Grid
              item
              xs={7}
              md={6}
              onMouseOver={() => setEditingOrderNumber(true)}
              onMouseLeave={() => setEditingOrderNumber(false)}
              className={
                editingOrderNumber ? classes.orderNumberEnabled : classes.orderNumberDisabled
              }
            >
              {!editingOrderNumber && (
                <Typography variant="subtitle1" data-testid="order_number">
                  {data.order}
                </Typography>
              )}
              {editingOrderNumber &&  (
                <AutoSaveField
                  value={data.order}
                  mutationAction={value => updateTask('order', value)}
                  label={t('task.order_number')}
                  canEdit={canUpdateNote}
                />
              )}
            </Grid>
          </Grid>
        )}
        <Grid
          container
          className={matches ? classes.assigneesSectionMobile : classes.assigneesSection}
          style={autoCompleteOpen ? { marginTop: '-40px' } : undefined}
        >
          <Grid
            item
            xs={4}
            md={3}
            style={matches ? { marginRight: '9px', paddingTop: '5px' } : { marginRight: '0' }}
          >
            <Typography variant="caption" color="textSecondary">
              {t('task.assigned_to_txt')}
            </Typography>
          </Grid>
          <Grid item xs={8} md={9}>
            <Grid container spacing={1} style={{ alignItems: 'center' }} data-testid="user-chip">
              {data.assignees?.length > 0 && (
                <Grid item>
                  {data.assignees?.map(user => (
                    <UserChip
                      key={user.id}
                      user={user}
                      size="medium"
                      onDelete={() => {
                        if (!canUpdateNote) {
                          return;
                        }

                        assignUser(data.id, user.id);
                      }}
                    />
                  ))}
                </Grid>
              )}
              <Grid item xs={12} data-testid="add-assignee">
                {canUpdateNote && (
                  <Chip
                    key={data.id}
                    variant="outlined"
                    label={autoCompleteOpen ? t('task.chip_close') : t('task.chip_add_assignee')}
                    size="medium"
                    icon={autoCompleteOpen ? <CancelIcon /> : <AddCircleIcon />}
                    onClick={event => handleOpenAutoComplete(event, data.id)}
                    color="primary"
                  />
                )}

                {autoCompleteOpen && (
                  <Autocomplete
                    disablePortal
                    id={data.id}
                    options={liteData?.usersLite || users}
                    ListboxProps={{ style: { maxHeight: '20rem' } }}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <UserAutoResult user={option} t={t} />
                      </li>
                    )}
                    name="assignees"
                    onChange={(_evt, value) => {
                      if (!value) {
                        return;
                      }
                      assignUser(data.id, value.id);
                    }}
                    style={{
                      width: matches ? 320 : '100%',
                      marginLeft: matches && 5
                    }}
                    getOptionLabel={option =>
                      allowedAssignees.includes(option.userType) ? option.name : ''
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="standard"
                        label={t('task.task_assignee_label')}
                        placeholder={t('task.task_search_placeholder')}
                        onChange={event => setSearchUser(event.target.value)}
                        autoComplete="off"
                        onKeyDown={() => searchUser()}
                      />
                    )}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {canViewFormUser && data?.formUser?.user && (
        <Grid container className={classes.submittedFormSection}>
          <Grid item xs={4} md={3}>
            <Typography variant="caption" color="textSecondary" data-testid="submitted_form_title">
              {t('processes.submitted_form')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <Button
              href={`/user_form/${data.formUser.user.id}/${data.formUser.id}/task?formId=${data.formUser.formId}`}
              variant="outlined"
              color="primary"
              className={classes.button}
              data-testid="submitted_form_button"
            >
              {t('processes.open_submitted_form')}
            </Button>
          </Grid>
        </Grid>
      )}
      <Grid container className={classes.descriptionSection}>
        <Grid item xs={12} md={12}>
          <Typography variant="caption" color="textSecondary">
            {t('common:form_fields.description')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} style={{paddingTop: '10px'}}>
          <AutoSaveField
            value={data.description}
            mutationAction={value => updateTask('description', value)}
            label={t('misc.add_description')}
            canEdit={canUpdateNote}
            fieldType='inline'
          />
        </Grid>
      </Grid>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  parentTask: {
    cursor: 'pointer',
    '& a': {
      textDecoration: 'none'
    }
  },
  parentTaskDisabled: {
    pointerEvents: 'none',
    opacity: '0.4',
    '& a': {
      color: '#000000'
    }
  },
  inlineContainer: {
    padding: '10px 0'
  },
  assigneesSection: {
    alignItems: 'center'
  },
  assigneesSectionMobile: {},
  createdAtSection: {
    alignItems: 'center',
    marginBottom: '8px'
  },
  taskFieldItem: {
    alignItems: 'center',
    marginBottom: '8px'
  },
  reminderSection: {
    alignItems: 'center',
    marginBottom: '8px'
  },
  dueDateSection: {
    alignItems: 'center',
    marginBottom: '8px'
  },
  parentTaskSection: {
    alignItems: 'center',
    marginBottom: '8px'
  },
  submittedFormSection: {
    marginTop: '8px'
  },
  descriptionSection: {
    marginTop: '8px'
  },
  dueDateEnabled: {
    border: 'solid 1px',
    padding: '0 5px 0 5px',
    borderRadius: '4px'
  },
  dueDateDisabled: {
    padding: '0 5px 0 0'
  },
  orderNumberEnabled: {
    padding: '0 5px 0 5px',
    marginLeft: '-5px',
    borderRadius: '4px'
  },
  orderNumberDisabled: {
    padding: '0 5px 0 0'
  },
  selectLabel: {
    color: theme.palette?.primary?.main
  }
}));

TaskInfoTop.defaultProps = {
  users: [],
  data: {},
  liteData: {},
  selectedDate: null,
  activeReminder: null,
  handleSplitScreenClose: () => {},
  handleTaskComplete: () => {},
  forProcess: false,
  fromLeadPage: false
};

TaskInfoTop.propTypes = {
  currentUser: PropTypes.shape({
    permissions: PropTypes.arrayOf(
      PropTypes.shape({
        note: PropTypes.shape({
          permissions: PropTypes.arrayOf(PropTypes.string)
        })
      })
    ),
    id: PropTypes.string.isRequired,
    userType: PropTypes.string.isRequired
  }).isRequired,
  users: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  liteData: PropTypes.object,
  assignUser: PropTypes.func.isRequired,
  handleOpenAutoComplete: PropTypes.func.isRequired,
  setDate: PropTypes.func.isRequired,
  setSearchUser: PropTypes.func.isRequired,
  searchUser: PropTypes.func.isRequired,
  autoCompleteOpen: PropTypes.bool.isRequired,
  selectedDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  activeReminder: PropTypes.string,
  isAssignee: PropTypes.func.isRequired,
  menuData: PropTypes.shape({
    handleTaskInfoMenu: PropTypes.func.isRequired,
    open: PropTypes.bool,
    anchorEl: PropTypes.shape({
      getAttribute: PropTypes.func
    }),
    handleClose: PropTypes.func,
    menuList: PropTypes.arrayOf(
      PropTypes.shape({
        content: PropTypes.string,
        isAdmin: PropTypes.bool,
        handleClick: PropTypes.func
      })
    )
  }).isRequired,
  handleSplitScreenClose: PropTypes.func,
  refetch: PropTypes.func.isRequired,
  handleTaskComplete: PropTypes.func,
  forProcess: PropTypes.bool,
  fromLeadPage: PropTypes.bool
};
