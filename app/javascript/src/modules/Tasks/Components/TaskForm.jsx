import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import {
  Button,
  FormHelperText,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid
} from '@mui/material';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { CreateNote } from '../../../graphql/mutations';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { NotesCategories } from '../../../utils/constants';
// TODO: This should be moved to the shared directory
import UserSearch from '../../Users/Components/UserSearch';
import CustomAutoComplete from '../../../shared/autoComplete/CustomAutoComplete';
import PageWrapper from '../../../shared/PageWrapper';
import PageHeader from '../../../shared/PageHeader';
import MessageAlert from '../../../components/MessageAlert';

const initialData = {
  user: '',
  userId: ''
};
export default function TaskForm({
  close,
  refetch,
  users,
  assignUser,
  parentTaskId,
  subTasksCount,
  createTaskListSubTask
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [taskType, setTaskType] = useState('');
  const [selectedDate, setDate] = useState(new Date());
  const [orderNumber, setOrderNumber] = useState(1);
  const [loading, setLoadingStatus] = useState(false);
  const [createTask] = useMutation(CreateNote);
  const [userData, setData] = useState(initialData);
  const { t } = useTranslation(['task', 'common']);
  const [messageAlert, setMessageAlert] = useState('');
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);

  useEffect(() => {
    if (createTaskListSubTask) {
      setTaskType('template');
    }
    setOrderNumber(subTasksCount + 1);
  }, [createTaskListSubTask, subTasksCount]);

  function handleSubmit(event) {
    event.preventDefault();
    setLoadingStatus(true);
    createTask({
      variables: {
        body: title,
        description,
        due: selectedDate ? selectedDate.toISOString() : null,
        category: taskType,
        order: parseInt(orderNumber, 10) || 1,
        flagged: true,
        userId: userData.userId,
        parentNoteId: parentTaskId
      }
    })
      .then(({ data }) => {
        assignees.map(user => assignUser(data.noteCreate.note.id, user.id));
        setLoadingStatus(false);
        refetch();
        setIsSuccessAlert(true);
        setMessageAlert(t('task.task_created'));
        close();
      })
      .catch(err => {
        setLoadingStatus(false);
        setIsSuccessAlert(false);
        setMessageAlert(err.message);
      });
  }

  return (
    <div style={{paddingTop: '50px'}}>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={() => setMessageAlert('')}
      />
      <PageHeader
        linkText={t('common:misc.tasks')}
        linkHref="/tasks"
        pageName={t('common:form_actions.create_task')}
        PageTitle={t('task.task_modal_create_text')}
      />
      <PageWrapper>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item md={12} xs={12}>
              <TextField
                name="task_body"
                label={t('task.task_name')}
                style={{ width: '100%' }}
                onChange={e => setTitle(e.target.value)}
                value={title}
                fullWidth
                data-testid="task-body"
                inputProps={{
                  'aria-label': 'task_body'
                }}
                InputLabelProps={{
                  shrink: true
                }}
                required
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                name="task_description"
                label={t('task.optional_description')}
                style={{ width: '100%' }}
                onChange={e => setDescription(e.target.value)}
                value={description}
                multiline
                fullWidth
                rows={2}
                data-testid="task-description"
                inputProps={{
                  'aria-label': 'task_description'
                }}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <CustomAutoComplete
                users={users}
                isMultiple
                onChange={(_evt, value) => {
                  if (!value) {
                    return;
                  }
                  setAssignees(value);
                }}
                label={t('task.task_search_placeholder')}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <UserSearch userData={userData} update={setData} />
            </Grid>
            <Grid item md={12} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="taskType">{t('task.task_type_label')}</InputLabel>
                <Select
                  id="taskType"
                  label={t('task.task_type_label')}
                  value={taskType}
                  onChange={event => setTaskType(event.target.value)}
                  name="taskType"
                  data-testid="task-type"
                  fullWidth
                  disabled={createTaskListSubTask}
                >
                  {Object.entries(NotesCategories).map(([key, val]) => (
                    <MenuItem key={key} value={key}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12}>
              <DatePickerDialog
                handleDateChange={date => setDate(date)}
                selectedDate={selectedDate}
                inputVariant="outlined"
                label={t('task.due_date_optional')}
                margin="none"
              />
              <FormHelperText>{t('common:form_placeholders.note_due_date')}</FormHelperText>
            </Grid>
            <Grid item md={12} xs={12}>
              <TextField
                fullWidth
                type="number"
                id="task-order-number"
                label={t('task.order_number')}
                value={orderNumber}
                onChange={event => setOrderNumber(event.target.value)}
                variant="outlined"
                size="small"
                name="order"
                inputProps={{ 'data-testid': 'order_number' }}
              />
            </Grid>
            <Grid item md={6} xs={6} style={{ textAlign: 'right' }}>
              <Button
                variant="outlined"
                aria-label="task_cancel"
                color="primary"
                onClick={close}
                data-testid="task-cancel-button"
              >
                {t('common:form_actions.cancel')}
              </Button>
            </Grid>
            <Grid item md={6} xs={6}>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
                aria-label="task_submit"
                data-testid="task-submit-button"
              >
                {loading
                  ? t('common:form_actions.creating_task')
                  : t('common:form_actions.create_task')}
              </Button>
            </Grid>
          </Grid>
        </form>
      </PageWrapper>
    </div>
  );
}

TaskForm.defaultProps = {
  users: [],
  parentTaskId: '',
  subTasksCount: 0,
  createTaskListSubTask: false
};

TaskForm.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape),
  close: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  assignUser: PropTypes.func.isRequired,
  parentTaskId: PropTypes.string,
  subTasksCount: PropTypes.number,
  createTaskListSubTask: PropTypes.bool
};
