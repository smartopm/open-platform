import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import {
  Button,
  FormHelperText,
  MenuItem,
  Select,
  InputLabel,
  Grid,
  FormControl
} from '@mui/material';
import { css } from 'aphrodite';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CreateNote } from '../../../graphql/mutations';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { discussStyles } from '../../../components/Discussion/Discuss';
import { NotesCategories } from '../../../utils/constants';
// TODO: This should be moved to the shared directory
import UserSearch from '../../Users/Components/UserSearch';
import CustomAutoComplete from '../../../shared/autoComplete/CustomAutoComplete';

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
  createTaskListSubTask
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setErrorMessage] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [taskType, setTaskType] = useState('');
  const [selectedDate, setDate] = useState(new Date());
  const [loading, setLoadingStatus] = useState(false);
  const [createTask] = useMutation(CreateNote);
  const [userData, setData] = useState(initialData);
  const { t } = useTranslation(['task', 'common']);

  useEffect(() => {
    if (createTaskListSubTask) {
      setTaskType('task_list');
    }
  }, [createTaskListSubTask]);

  function handleSubmit(event) {
    event.preventDefault();
    setLoadingStatus(true);
    createTask({
      variables: {
        body: title,
        description,
        due: selectedDate ? selectedDate.toISOString() : null,
        category: taskType,
        flagged: true,
        userId: userData.userId,
        parentNoteId: parentTaskId
      }
    })
      .then(({ data }) => {
        assignees.map(user => assignUser(data.noteCreate.note.id, user.id));
        close();
        refetch();
        setLoadingStatus(false);
      })
      .catch(err => setErrorMessage(err.message));
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="task_body"
        label={t('task.task_body_label')}
        placeholder={t('common:form_placeholders.note_body')}
        style={{ width: '100%' }}
        onChange={e => setTitle(e.target.value)}
        value={title}
        multiline
        fullWidth
        rows={2}
        margin="normal"
        data-testid="task-body"
        inputProps={{
          'aria-label': 'task_body'
        }}
        InputLabelProps={{
          shrink: true
        }}
        required
      />
      <TextField
        name="task_description"
        label={t('task.task_description_label')}
        placeholder={t('common:form_placeholders.note_description')}
        style={{ width: '100%' }}
        onChange={e => setDescription(e.target.value)}
        value={description}
        multiline
        fullWidth
        rows={2}
        margin="normal"
        data-testid="task-description"
        inputProps={{
          'aria-label': 'task_description'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />
      <br />
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
      <br />
      <br />
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

      <br />
      <UserSearch userData={userData} update={setData} />
      <br />
      <div>
        <DatePickerDialog handleDateChange={date => setDate(date)} selectedDate={selectedDate} />
        <FormHelperText>{t('common:form_placeholders.note_due_date')}</FormHelperText>
      </div>

      <br />
      <Grid
        container
        spacing={5}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gridTemplateColumns: 'repeat(2, 1fr)'
        }}
      >
        <Grid item md={6} xs={6}>
          <Button
            variant="contained"
            aria-label="task_cancel"
            color="secondary"
            onClick={close}
            data-testid="task-cancel-button"
            className={`${css(discussStyles.cancelBtn)}`}
          >
            {t('common:form_actions.cancel')}
          </Button>
        </Grid>

        <Grid
          item
          md={6}
          xs={6}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}
        >
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={loading}
            aria-label="task_submit"
            data-testid="task-submit-button"
            className={`${css(discussStyles.submitBtn)}`}
          >
            {loading
              ? t('common:form_actions.creating_task')
              : t('common:form_actions.create_task')}
          </Button>
        </Grid>
      </Grid>
      <p className="text-center">{Boolean(error.length) && error}</p>
    </form>
  );
}

TaskForm.defaultProps = {
  users: [],
  parentTaskId: '',
  createTaskListSubTask: false
};

TaskForm.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape),
  close: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  assignUser: PropTypes.func.isRequired,
  parentTaskId: PropTypes.string,
  createTaskListSubTask: PropTypes.bool
};
