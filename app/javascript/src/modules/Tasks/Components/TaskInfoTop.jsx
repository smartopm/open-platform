import React from 'react';
import TextField from '@material-ui/core/TextField';
import {
  Grid,
  Chip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment-timezone'
import DatePickerDialog from '../../../components/DatePickerDialog';
import { UserChip } from './UserChip';
import { sanitizeText } from '../../../utils/helpers';
import UserAutoResult from '../../../shared/UserAutoResult';

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
  searchUser
}) {
  const { t } = useTranslation(['task', 'common']);
  const classes = useStyles();
  const history = useHistory();

  const allowedAssignees = ['admin', 'custodian', 'security_guard', 'contractor', 'site_worker'];

  function openParentLink(event, parent) {
    event.preventDefault();
    history.push(`/tasks/${parent.id}`);
  }

  return (
    <Grid item md={7}>
      <Typography
        style={{ color: '#00000099' }}
        data-testid="task-details-breadcrumb"
        variant="caption"
      >
        {t('task.my_tasks')}
        {' '}
        /
        {t('task.task_details_text')}
      </Typography>
      <Typography variant="h6" style={{ color: '#575757' }}>
        <span
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: sanitizeText(data.body)
          }}
        />
      </Typography>
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
      <Grid container style={{ marginTop: '10px' }}>
        <Grid item xs={6} md={4}>
          <Typography style={{ marginTop: '21px' }}>{t('task.due_date_text')}</Typography>
        </Grid>
        <Grid item xs={6} md={4}>
          <DatePickerDialog
            handleDateChange={date => setDate(date)}
            selectedDate={selectedDate}
            InputProps={{ disableUnderline: true, style: {color: moment().isAfter(selectedDate) ? 'red' : '#575757'} }}
          />
        </Grid>
      </Grid>

      {/* <Grid container>
        <Grid item xs={6} md={4}>
          <Typography>Date Assigned</Typography>
        </Grid>
        <Grid item xs={6} md={4}>
          <Typography>0000-00-00</Typography>
        </Grid>
      </Grid> */}

      <Grid container style={{ padding: '10px 0' }}>
        <Grid item xs={4}>
          <Typography style={{ marginTop: '6px' }}>{t('task.assigned_to_txt')}</Typography>
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

      {/* <Grid container>
        <Grid item xs={6} md={4}>
          <Typography>Labels</Typography>
        </Grid>
        <Grid item xs={6} md={4}>
          <Typography>Add a label here</Typography>
        </Grid>
      </Grid> */}
      {
  data.description && (
  <Grid container style={{ padding: '5px 0 25px 0' }}>
    <Grid item xs={12}>
      <Typography>{t('common:form_fields.description')}</Typography>
      <Typography style={{ color: '#575757' }} variant="body2">
        {data.description}
      </Typography>
    </Grid>
  </Grid>
  )
}
    </Grid>
  );
}

const useStyles = makeStyles({
  parentTask: {
    cursor: 'pointer',
    '& a': {
      textDecoration: 'none'
    }
  }
});

TaskInfoTop.defaultProps = {
  users: [],
  data: {},
  liteData: {},
  selectedDate: null
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
  selectedDate: PropTypes.instanceOf(Date)
};
