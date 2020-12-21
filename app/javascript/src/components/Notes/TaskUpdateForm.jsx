/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import {
  Button,
  FormHelperText,
  MenuItem,
  Select,
  Grid,
  InputLabel,
  FormControl,
  Snackbar,
  Chip,
  Typography,
  FormControlLabel,
  Checkbox,
  Tooltip,
} from '@material-ui/core'
import { useMutation } from 'react-apollo'
import PropTypes from 'prop-types'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import EditIcon from '@material-ui/icons/Edit'
import Visibility from '@material-ui/icons/Visibility';
import CancelIcon from '@material-ui/icons/Cancel'
import Autocomplete from '@material-ui/lab/Autocomplete'
import AlarmIcon from '@material-ui/icons/Alarm'
import DatePickerDialog from '../DatePickerDialog'
import CenteredContent from '../CenteredContent'
import { UpdateNote , TaskReminder } from '../../graphql/mutations'
import { UserChip } from '../UserChip'
import { NotesCategories } from '../../utils/constants'
import Toggler from '../Campaign/ToggleButton'
import { sanitizeText, pluralizeCount } from '../../utils/helpers'
import RemindMeLaterMenu from './RemindMeLaterMenu'
import TaskUpdateList from './TaskUpdateList'
import TaskComment from './TaskComment'
import { dateToString, dateTimeToString } from '../DateContainer'

const initialData = {
  user: '',
  userId: ''
}

export default function TaskForm({
  users,
  data,
  assignUser,
  refetch,
  currentUser,
  historyData,
  historyRefetch,
  authState,
  taskId,
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setErrorMessage] = useState('')
  const [taskType, setTaskType] = useState('')
  const [selectedDate, setDate] = useState(new Date())
  const [taskStatus, setTaskStatus] = useState(false)
  const [loading, setLoadingStatus] = useState(false)
  const [userData, setData] = useState(initialData)
  const [taskUpdate] = useMutation(UpdateNote)
  const [updated, setUpdated] = useState(false)
  const [autoCompleteOpen, setOpen] = useState(false)
  const [setReminder] = useMutation(TaskReminder)
  const [reminderTime, setReminderTime] = useState(null)
  const [mode, setMode] = useState('preview')

  const [type, setType] = useState('task')
  const handleType = (_event, value) => {
    setType(value)
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  function handleSubmit(event) {
    event.preventDefault()
    setLoadingStatus(true)
    updateTask()
  }

  function handleTaskComplete() {
    // call the mutation with just the complete status
    setLoadingStatus(true)
    taskUpdate({
      variables: { id: data.id, completed: !taskStatus }
    })
      .then(() => {
        setLoadingStatus(false)
        setUpdated(true)
        refetch()
      })
      .catch(err => {
        setErrorMessage(err)
      })
  }

  function updateTask() {
    taskUpdate({
      variables: {
        id: data.id,
        body: title,
        dueDate: selectedDate,
        description,
        category: taskType,
        flagged: true,
        userId: userData.userId
      }
    })
      .then(() => {
        setLoadingStatus(false)
        setUpdated(true)
        refetch()
        historyRefetch()
      })
      .catch(err => {
        setErrorMessage(err)
      })
  }

  function setDefaultData() {
    setTitle(data.body)
    setTaskType(data.category)
    setTaskStatus(data.completed)
    setDescription(data.description)
    setDate(data.dueDate)
    setData({
      user: data.user.name,
      userId: data.user.id,
      imageUrl: data.user.imageUrl
    })
  }

  function handleOpenAutoComplete() {
    setOpen(!autoCompleteOpen)
  }

  function timeFormat(time) {
    return `${dateToString(time)}, ${dateTimeToString(new Date(time))}`
  }

  function setTaskReminder(hour) {
    setReminder({
      variables: { noteId: data.id, hour }
    })
      .then(() => {
        handleClose()
        const timeScheduled = new Date(
          Date.now() + hour * 60 * 60000
        ).toISOString()
        setReminderTime(timeFormat(timeScheduled))
      })
      .catch(err => console.log(err))
  }

  function currentActiveReminder() {
    const assignedNote = data.assigneeNotes
      .find(assigneeNote => assigneeNote.userId === currentUser.id)
    
    const timeScheduled = reminderTime || assignedNote?.reminderTime
    let formattedTime = null
    if (
      timeScheduled &&
      new Date(timeScheduled).getTime() > new Date().getTime()
    ) {
      formattedTime = timeFormat(timeScheduled)
    }

    return formattedTime
  }

  function handleOpenMenu(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  function isCurrentUserAnAssignee() {
    return data.assignees.find(assignee => assignee.id === currentUser.id)
  }

  useEffect(() => {
    setDefaultData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Grid>
        <RemindMeLaterMenu
          taskId={data.id}
          anchorEl={anchorEl}
          handleClose={handleClose}
          open={open}
          setTaskReminder={setTaskReminder}
        />
      </Grid>
      <form onSubmit={handleSubmit}>
        {isCurrentUserAnAssignee() && (
          <Button
            color="primary"
            style={{
              float: 'right'
            }}
            onClick={handleOpenMenu}
          >
            {currentActiveReminder() ? 'Change reminder' : 'Remind me later'}
          </Button>
        )}
        {isCurrentUserAnAssignee() && currentActiveReminder() && (
          <>
            <Typography
              variant="subtitle1"
              style={{ margin: '5px 5px 10px 0', float: 'right' }}
            >
              {currentActiveReminder()}
            </Typography>
            <AlarmIcon style={{ float: 'right', marginTop: '5px' }} />
          </>
        )}
        <Snackbar
          open={updated}
          autoHideDuration={3000}
          onClose={() => setUpdated(!updated)}
          color="primary"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          message="Task updated successfully"
        />

        <Toggler
          type={type}
          handleType={handleType}
          data={{
            type: 'task',
            antiType: 'updates'
          }}
        />

        {type === 'task' ? (
          <>
            <br />
            <div style={{
            display: 'inline-flex',
            margin: '5px 0 10px 0'
          }}
            >
              <FormHelperText
                style={{
                margin: '4px 4px 0 0',
              }}
              >
                Task Body*
              </FormHelperText>
              <Tooltip title="Toggle Preview">
                <Visibility 
                  data-testid="preview_task_body_btn"
                  style={{
                  cursor: 'pointer',
                  margin: '5px 6px 0 0',
                  fontSize: 17
                }}
                  onClick={() => setMode('preview')}
                />
              </Tooltip>
              <Tooltip title="Toggle Edit">
                <EditIcon
                  data-testid="edit_task_body_btn"
                  style={{
                  cursor: 'pointer',
                  margin: '5px 6px 0 0',
                  fontSize: 17
                }}
                  color="inherit"
                  onClick={() => setMode('edit')}
                />
              </Tooltip>
            </div>
            {mode === 'preview' && (
            <p>
              <span
              // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                __html: sanitizeText(title)
              }}
              />
            </p>
)}
            {mode === 'edit' && (
            <TextField
              name="task_body"
              placeholder="Add task body here"
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
)}

            <TextField
              name="task_description"
              label="Task Description"
              placeholder="Describe the task here"
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
            <br />
            <FormControl fullWidth>
              <InputLabel id="taskType">Task Type</InputLabel>
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
            <div>
              <FormHelperText>Pick a due date</FormHelperText>
              <DatePickerDialog
                handleDateChange={date => setDate(date)}
                selectedDate={selectedDate}
              />
            </div>
            <FormControl fullWidth>
              <FormHelperText>{pluralizeCount(data?.assignees.length, 'Assignee')}</FormHelperText>
              <div>
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
                  label={autoCompleteOpen ? 'Close' : 'Add Assignee'}
                  size="medium"
                  icon={autoCompleteOpen ? <CancelIcon /> : <AddCircleIcon />}
                  onClick={event => handleOpenAutoComplete(event, data.id)}
                />

                {autoCompleteOpen && (
                <Autocomplete
                  clearOnEscape
                  clearOnBlur
                  open={autoCompleteOpen}
                  onClose={() => setOpen(!autoCompleteOpen)}
                  loading={loading}
                  id={data.id}
                  options={users}
                  getOptionLabel={option => option.name}
                  style={{ width: 300 }}
                  onChange={(_evt, value) => {
                  if (!value) {
                    return
                  }
                  assignUser(data.id, value.id)
                }}
                  renderInput={params => (
                    <TextField {...params} placeholder="Name of assignee" />
                )}
                />
            )}
              </div>
            </FormControl>
            <br />
            <br />
            <FormControlLabel
              control={(
                <Checkbox
                  disabled={loading}
                  checked={taskStatus}
                  onChange={handleTaskComplete}
                  name="mark_task_complete"
                  color="primary"
                  data-testid="mark_task_complete_checkbox"
                />
          )}
              label={!taskStatus ? 'Mark Task as complete' : 'Mark Task as incomplete'}
            />
            <br />
            <CenteredContent>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
                aria-label="task_submit"
                disableElevation
              >
                {loading ? 'Updating a task ...' : 'Update Task'}
              </Button>
            </CenteredContent>
            <p className="text-center">{Boolean(error.length) && error}</p>
            <TaskComment authState={authState} taskId={taskId} />
          </>
) : (
  <TaskUpdateList data={historyData} />
        )}
      </form>
    </>
  )
}

TaskForm.defaultProps = {
  users: [],
  data: {},
  historyData: [],
  authState: {},
  taskId: '',
}
TaskForm.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  assignUser: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  currentUser: PropTypes.object.isRequired,
  historyData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string
  })),
  historyRefetch: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  authState: PropTypes.object,
  taskId: PropTypes.string,
}
