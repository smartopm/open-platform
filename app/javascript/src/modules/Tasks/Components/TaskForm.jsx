/* eslint-disable */
import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import {
  Button,
  FormHelperText,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@material-ui/core'
import { css } from 'aphrodite'
import { useMutation } from 'react-apollo'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import { CreateNote } from '../../../graphql/mutations'
import DatePickerDialog from '../../../components/DatePickerDialog'
import { discussStyles } from '../../../components/Discussion/Discuss'
import { UserChip } from './UserChip'
import { NotesCategories } from '../../../utils/constants'
// TODO: This should be moved to the shared directory
import UserSearch from '../../Users/Components/UserSearch'

const initialData = {
  user: '',
  userId: ''
}

export default function TaskForm({ close, refetch, users, assignUser}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setErrorMessage] = useState('')
  const [assignees, setAssignees] = useState([])
  const [taskType, setTaskType] = useState('')
  const [selectedDate, setDate] = useState(new Date())
  const [loading, setLoadingStatus] = useState(false)
  const [createTask] = useMutation(CreateNote)
  const [userData, setData] = useState(initialData)
  const { t } = useTranslation(['task', 'common'])

  function handleSubmit(event) {
    event.preventDefault()
    setLoadingStatus(true)

    createTask({
      variables: {
        body: title,
        description: description,
        due: selectedDate ? selectedDate.toISOString() : null,
        category: taskType,
        flagged: true,
        userId: userData.userId
      }
    })
      .then(({ data }) => {
        assignees.map(user => assignUser(data.noteCreate.note.id, user.id))
        close()
        refetch()
        setLoadingStatus(false)
    })
    .catch(err => setErrorMessage(err.message))
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
        inputProps={{
          'aria-label': 'task_description'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />
      <br/>
      <FormControl fullWidth >
        <InputLabel id="taskType">{t('task.task_type_label')}</InputLabel>
        <Select
            id="taskType"
            value={taskType}
            onChange={event => setTaskType(event.target.value)}
            name="taskType"
            fullWidth
        >
            {Object.entries(NotesCategories).map(([key, val]) => (
              <MenuItem key={key} value={key}>
                {val}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <br />
      <FormControl fullWidth >
        <InputLabel id="assignees">{t('task.task_assignee_label')}</InputLabel>
        <Select
            id="assignees"
            value={assignees}
            onChange={event => setAssignees(event.target.value)}
            name="assignees"
            fullWidth
            multiple
            renderValue={selected => (
              <div>
                {selected.map((value, i) => (
                  <UserChip user={value} key={i} label={value.name} />
                ))}
              </div>
            )}
        >
              {Boolean(users.length) && users.map((user) => (
                <MenuItem key={user.id} value={user}>
                  {user.name}
                </MenuItem>
              ))}
        </Select>
      </FormControl>
      <br />
        <UserSearch userData={userData} update={setData}/> 
      <br />
      <div>
        <DatePickerDialog
          handleDateChange={date => setDate(date)}
          selectedDate={selectedDate}
        />
        <FormHelperText>{t('common:form_placeholders.note_due_date')}</FormHelperText>
      </div>

      <br />
      <div className="d-flex row justify-content-center">
        <Button
          variant="contained"
          aria-label="task_cancel"
          color="secondary"
          onClick={close}
          className={`btn ${css(discussStyles.cancelBtn)}`}
        >
          {t('common:form_actions.cancel')}
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={loading}
          aria-label="task_submit"
          className={`btn ${css(discussStyles.submitBtn)}`}
        >
          {loading ? t('common:form_actions.creating_task') : t('common:form_actions.create_task')}
        </Button>
      </div>
      <p className="text-center">
          {Boolean(error.length) && error}
      </p>
    </form>
  )
}

TaskForm.defaultProps = {
  users: []
}

TaskForm.propTypes = {
  users: PropTypes.array.isRequired,
  close: PropTypes.func,
  refetch: PropTypes.func,
}