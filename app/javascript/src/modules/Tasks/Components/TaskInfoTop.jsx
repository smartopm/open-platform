/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import {
  Button,
  Grid,
  Chip,
  Typography,
  IconButton,
  useMediaQuery
} from '@material-ui/core';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment-timezone';
import { useMutation } from 'react-apollo';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { UserChip } from './UserChip';
import { formatError } from '../../../utils/helpers';
import UserAutoResult from '../../../shared/UserAutoResult';
import { dateToString } from '../../../components/DateContainer';
import AutoSaveField from '../../../shared/AutoSaveField';
import { UpdateNote } from '../../../graphql/mutations';
import MessageAlert from '../../../components/MessageAlert';
import MenuList from '../../../shared/MenuList';
import TaskTitle from './TaskTitle';

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
  forProcess
}) {
  const { t } = useTranslation(['task', 'common']);
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:800px)');
  const history = useHistory();
  const urlParams = useParams();
  const [taskUpdate] = useMutation(UpdateNote);
  const [editingBody, setEditingBody] = useState(false);
  const [editingDueDate, setEditingDueDate] = useState(false);
  const [updateDetails, setUpdateDetails] = useState({
    isError: false,
    message: ''
  });

  const allowedAssignees = [
    'admin',
    'custodian',
    'security_guard',
    'contractor',
    'site_worker',
    'consultant',
    'developer'
  ];

  const taskPermissions = currentUser?.permissions?.find(
    permissionObject => permissionObject.module === 'note'
  );
  const canUpdateNote = taskPermissions
    ? taskPermissions.permissions.includes('can_update_note')
    : false;

  function openParentLink(event, parent) {
    event.preventDefault();
    if(forProcess){
      history.push(`/processes/drc/projects/${parent.id}/tab=processes`);
    }else{
      history.push(`/tasks/${parent.id}`);
    }
  }

  function updateTask(property, value) {
    taskUpdate({
      variables: { id: data.id, [property]: value }
    })
      .then(() => {
        setUpdateDetails({ isError: false, message: t('task.update_successful') });
        setTimeout(() => {
          refetch()
        }, 500)
      })
      .catch(err => {
        setUpdateDetails({ isError: true, message: formatError(err?.message) });
      });
  }

  function isUnAuthorizedDeveloper() {
    return (
      currentUser.userType === 'developer' &&
      !data.parentNote.assignees.find(assignee => assignee.id === currentUser.id)
    );
  }

  return (
    <>
      <MessageAlert
        type={!updateDetails.isError ? 'success' : 'error'}
        message={updateDetails.message}
        open={!!updateDetails.message}
        handleClose={() => setUpdateDetails({ ...updateDetails, message: '' })}
      />
      <MenuList
        open={menuData.open}
        anchorEl={menuData.anchorEl}
        handleClose={menuData.handleClose}
        list={menuData.menuList}
      />
      <Grid container>
        {matches && (
          <Grid item xs={12} style={{ marginBottom: '32px' }}>
            <Grid container>
              <Grid item xs={9} style={{ display: 'flex', alignItems: 'center' }}>
                <Breadcrumbs aria-label="breadcrumb">
                  <Typography
                    color="primary"
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    onClick={handleSplitScreenClose}
                  >
                    <KeyboardBackspaceIcon style={{ marginRight: '4px' }} />
                    {urlParams.type === 'drc' ? t('task:bread_crumps.summary') : t('task:bread_crumps.my_tasks')}
                  </Typography>
                  <Typography>{t('task:bread_crumps.task_details')}</Typography>
                </Breadcrumbs>
              </Grid>
              <Grid item xs={3} style={{ display: 'flex' }}>
                {canUpdateNote && (
                  <IconButton
                    edge="end"
                    onClick={handleTaskComplete}
                    data-testid="task-info-menu"
                    color="primary"
                    style={{backgroundColor: 'transparent'}}
                  >
                    {data.completed ? (
                      <CheckCircleIcon htmlColor="#4caf50" style={{fontSize: '20px'}} />
                    ) : (
                      <CheckCircleOutlineIcon onClick={handleTaskComplete} />
                  )}
                  </IconButton>
                )}
                {isAssignee() && (
                  <IconButton
                    edge="end"
                    onClick={event => menuData.handleTaskInfoMenu(event)}
                    data-testid="alarm"
                    color="primary"
                  >
                    <AccessAlarmIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
        <Grid item md={10} xs={12}>
          {!editingBody && (
          <Typography
            style={{
              color: '#575757',
              padding: '15px'
            }}
            onMouseOver={canUpdateNote ? () => setEditingBody(true) : null}
          >
            <TaskTitle task={data} />
          </Typography>
          )}
          {editingBody && (
            <AutoSaveField
              value={data.body}
              mutationAction={(value) => updateTask('body', value)}
              stateAction={(value) => setEditingBody(value)}
            />
          )}
        </Grid>
        {!matches && (
          <Grid item md={2}>
            <Grid container style={{ justifyContent: 'right' }}>
              <Grid item md={4} xs={1} style={{ textAlign: 'right' }}>
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
              </Grid>

              {isAssignee() && (
                <Grid item md={4} xs={1} style={{ textAlign: 'right' }}>
                  <IconButton
                    edge="end"
                    onClick={event => menuData.handleTaskInfoMenu(event)}
                    data-testid="task-info-menu"
                    color="primary"
                  >
                    <AccessAlarmIcon />
                  </IconButton>
                </Grid>
              )}
              {urlParams?.type !== 'drc' && (
                <Grid item md={4} xs={1} style={{ textAlign: 'right' }}>
                  <IconButton
                    edge="end"
                    onClick={handleSplitScreenClose}
                    data-testid="task-info-menu"
                    color="primary"
                  >
                    <KeyboardTabIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item md={12} style={{ marginTop: '24px'}}>
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
                color={isUnAuthorizedDeveloper() ? "inherit" : "primary"}
                data-testid="parent-note"
                onClick={isUnAuthorizedDeveloper() ? () => {} : (event) => { openParentLink(event, data.parentNote) }}
                className={isUnAuthorizedDeveloper() ? classes.parentTaskDisabled : classes.parentTask}
              >
                <TaskTitle task={data.parentNote} />
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
            {canUpdateNote ?             (
              <DatePickerDialog
                handleDateChange={date => setDate(date)}
                selectedDate={selectedDate}
                InputProps={{
                  disableUnderline: true,
                  style: { color: moment().isAfter(selectedDate) ? 'red' : '#575757' }
                }}
              />
            ) : (
              <DatePickerDialog disabled />
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

        <Grid
          container
          className={matches ? classes.assigneesSectionMobile : classes.assigneesSection}
          style={autoCompleteOpen ? {marginTop: '-40px'} : undefined}
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
            <Grid container spacing={1} style={{ alignItems: 'center' }} data-testid='user-chip'>
              {canUpdateNote && data.assignees.length > 0 && (
                <Grid item>
                  {data.assignees.map(user => (
                    <UserChip
                      key={user.id}
                      user={user}
                      size="medium"
                      onDelete={() => assignUser(data.id, user.id)}
                    />
                  ))}
                </Grid>
              )}
              <Grid item sm={6} xs={12} data-testid='add-assignee'>
                {canUpdateNote && (
                  <Chip
                    style={autoCompleteOpen ? {marginTop: '50px'} : undefined}
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
                    renderOption={option => <UserAutoResult user={option} />}
                    name="assignees"
                    onChange={(_evt, value) => {
                      if (!value) {
                        return;
                      }
                      assignUser(data.id, value.id);
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
      {data?.formUser?.user && (
        <Grid container className={classes.submittedFormSection}>
          <Grid item xs={4} md={3}>
            <Typography variant="caption" color="textSecondary" data-testid="submitted_form_title">
              {t('processes.submitted_form')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <Button
              href={`/user_form/${data.formUser.user.id}/${data.formUser.id}/task`}
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
          <Typography variant="caption" color='textSecondary'>
            {t('common:form_fields.description')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12}>
          <AutoSaveField
            value={data.description}
            mutationAction={(value) => updateTask('description', value)}
          />
        </Grid>
      </Grid>
    </>
  );
}

const useStyles = makeStyles({
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
    padding: '0 5px 0 0',
  }
});

TaskInfoTop.defaultProps = {
  users: [],
  data: {},
  liteData: {},
  selectedDate: null,
  activeReminder: null,
  handleSplitScreenClose: () => {},
  forProcess: false
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
  handleTaskComplete: PropTypes.func.isRequired,
  forProcess: PropTypes.bool
};
