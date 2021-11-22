import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Grid, Chip, Typography, Breadcrumbs, Button, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AlarmIcon from '@material-ui/icons/Alarm';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import Edit from '@material-ui/icons/Edit';
import { useMutation } from 'react-apollo';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { UserChip } from './UserChip';
import { formatError, sanitizeText } from '../../../utils/helpers';
import UserAutoResult from '../../../shared/UserAutoResult';
import { dateToString } from '../../../components/DateContainer';
import EditableField from '../../../shared/EditableField';
import { UpdateNote } from '../../../graphql/mutations';
import { Spinner } from '../../../shared/Loading';
import MessageAlert from '../../../components/MessageAlert';
import MenuList from '../../../shared/MenuList';

export default function TaskInfoTop({
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
  activeReminder
}) {
  const { t } = useTranslation(['task', 'common']);
  const classes = useStyles();
  const history = useHistory();
  const [description, setDescription] = useState(data.description);
  const [taskUpdate] = useMutation(UpdateNote);
  const [loading, setLoadingStatus] = useState(false);
  const [body, setBody] = useState(data.body);
  const [editingBody, setEditingBody] = useState(false);
  const [updateDetails, setUpdateDetails] = useState({
    isError: false,
    message: ''
  });

  const allowedAssignees = ['admin', 'custodian', 'security_guard', 'contractor', 'site_worker'];

  function openParentLink(event, parent) {
    event.preventDefault();
    history.push(`/tasks/${parent.id}`);
  }

  function updateTask(property, value) {
    setLoadingStatus(true);
    taskUpdate({
      variables: { id: data.id, [property]: value }
    })
      .then(() => {
        setLoadingStatus(false);
        setUpdateDetails({ isError: false, message: t('task.update_successful') });
        if (property === 'body') setEditingBody(false);
      })
      .catch(err => {
        setLoadingStatus(false);
        setUpdateDetails({ isError: true, message: formatError(err?.message) });
      });
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
        <Grid item md={12} xs={12}>
          <Breadcrumbs aria-label="breadcrumb" data-testid="task-details-breadcrumb">
            <Link color="inherit" to="/tasks">
              {t('task.my_tasks')}
            </Link>
            <Typography gutterBottom color="textPrimary" style={{ marginTop: '4px' }}>
              {t('task.task_details_text')}
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item md={9} xs={9}>
          {editingBody ? (
            <TextField
              name="body"
              value={body}
              margin="normal"
              fullWidth
              onChange={event => setBody(event.target.value)}
              multiline
              rows={4}
              style={{ width: '100%' }}
              inputProps={{
                'data-testid': 'editable_body'
              }}
            />
          ) : (
            <Typography variant="h6" style={{ color: '#575757' }}>
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: sanitizeText(body)
                }}
              />
            </Typography>
          )}
        </Grid>
        {!editingBody && (
          <Grid item xs={2} data-testid="edit_body_action">
            <IconButton
              onClick={() => setEditingBody(true)}
              data-testid="edit_body_icon"
              style={{ marginTop: '-6px' }}
              color="primary"
            >
              <Edit />
            </IconButton>
          </Grid>
        )}
        {editingBody && (
          <Grid item xs={2} data-testid="edit_action">
            <Button
              variant="outlined"
              color="primary"
              disabled={loading}
              data-testid="edit_body_action_btn"
              onClick={() => updateTask('body', body)}
              startIcon={loading && <Spinner />}
              style={{ marginTop: '70px' }}
            >
              {t('common:form_actions.update')}
            </Button>
          </Grid>
        )}
        <Grid item md={1} xs={1}>
          <IconButton
            edge="end"
            onClick={event => menuData.handleTaskInfoMenu(event)}
            size="small"
            data-testid="task-info-menu"
            color="primary"
          >
            <MoreVertIcon />
          </IconButton>
        </Grid>
        <Grid item md={12} xs={12}>
          {data.parentNote && (
            <Typography
              variant="body2"
              color="primary"
              onClick={event => openParentLink(event, data.parentNote)}
              className={classes.parentTask}
            >
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: sanitizeText(data.parentNote.body)
                }}
              />
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid item md={7}>
        <Grid container>
          <Grid item xs={6} md={4}>
            <Typography variant="body1" style={{ marginTop: '21px' }} className={classes.title}>
              {t('task.due_date_text')}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <DatePickerDialog
              handleDateChange={date => setDate(date)}
              selectedDate={selectedDate}
              InputProps={{
                disableUnderline: true,
                style: { color: moment().isAfter(selectedDate) ? 'red' : '#575757' }
              }}
            />
          </Grid>
        </Grid>

        {isAssignee() && (
          <Grid container className={classes.inlineContainer}>
            <Grid item xs={6} md={4}>
              <Typography variant="body1" className={classes.title} data-testid="active-reminder">
                {t('task.active_reminder')}
              </Typography>
            </Grid>
            <Grid item xs={6} md={4} style={{ display: 'flex', justifyContent: 'space-between' }}>
              {activeReminder ? (
                <>
                  <AlarmIcon />
                  <Typography variant="subtitle1">{activeReminder}</Typography>
                </>
              ) : (
                <Typography variant="subtitle1">{t('task.none')}</Typography>
              )}
            </Grid>
          </Grid>
        )}

        <Grid container className={classes.inlineContainer}>
          <Grid item xs={6} md={4}>
            <Typography variant="body1" className={classes.title} data-testid="date_created_title">
              {t('task.date_created')}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography data-testid="date_created">{dateToString(data.createdAt)}</Typography>
          </Grid>
        </Grid>

        <Grid container className={classes.inlineContainer}>
          <Grid item xs={4}>
            <Typography variant="body1" className={classes.title}>
              {t('task.assigned_to_txt')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            {data.assignees.map(user => (
              <UserChip
                key={user.id}
                user={user}
                size="medium"
                onDelete={() => assignUser(data.id, user.id)}
              />
            ))}
            <Chip
              key={data.id}
              variant="outlined"
              label={autoCompleteOpen ? t('task.chip_close') : t('task.chip_add_assignee')}
              size="medium"
              icon={autoCompleteOpen ? <CancelIcon /> : <AddCircleIcon />}
              onClick={event => handleOpenAutoComplete(event, data.id)}
              color="primary"
            />
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
                    onKeyDown={() => searchUser()}
                  />
                )}
              />
            )}
          </Grid>
        </Grid>

        <Grid container>
          <Typography variant="body1" className={classes.title}>
            {t('common:form_fields.description')}
          </Typography>
          <EditableField
            value={description}
            setValue={setDescription}
            action={(
              <Button
                variant="outlined"
                color="primary"
                disabled={loading}
                data-testid="edit_action_btn"
                onClick={() => updateTask('description', description)}
                startIcon={loading && <Spinner />}
                style={{ marginTop: '10px' }}
              >
                {t('common:form_actions.update')}
              </Button>
            )}
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
  title: {
    fontWeight: 500
  },
  inlineContainer: {
    padding: '10px 0'
  }
});

TaskInfoTop.defaultProps = {
  users: [],
  data: {},
  liteData: {},
  selectedDate: null,
  activeReminder: null
};
TaskInfoTop.propTypes = {
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
  }).isRequired
};
