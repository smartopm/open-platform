/* eslint-disable */
import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import { useParams, Link } from 'react-router-dom'
import {
  Button,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar
} from '@material-ui/core'
import DatePickerDialog from '../DatePickerDialog'
import { css, StyleSheet } from 'aphrodite'
import { useMutation } from 'react-apollo'
import PropTypes from 'prop-types'
import { CreateNote, UpdateNote } from '../../graphql/mutations'
import { discussStyles } from '../Discussion/Discuss'
import { UserChip } from '../UserChip'
import { NotesCategories } from '../../utils/constants'
import UserSearch from '../User/UserSearch'

const initialData = {
  user: '',
  userId: ''
}

export default function TaskForm({ close, refetch, users, data, assignUser }) {
  const { taskId } = useParams()
  const [title, setTitle] = useState('')
  const [error, setErrorMessage] = useState('')
  const [assignees, setAssignees] = useState([])
  const [taskType, setTaskType] = useState('')
  const [selectedDate, setDate] = useState(new Date())
  const [taskStatus, setTaskStatus] = useState(false)
  const [loading, setLoadingStatus] = useState(false)
  const [createTask] = useMutation(CreateNote)
  const [userData, setData] = useState(initialData)
  const [taskUpdate] = useMutation(UpdateNote)
  const [updated, setUpdated] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setLoadingStatus(true)
    if (taskId) {
      updateTask()
    } else {
      createTask({
        variables: {
          body: title,
          due: selectedDate ? selectedDate.toISOString() : null,
          completed: taskStatus,
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
  }

  function updateTask() {
    taskUpdate({ variables: {
        id: data.id,
        body: title,
        dueDate: selectedDate,
        completed: taskStatus,
        category: taskType,
        flagged: true,
        userId: userData.userId
    } }).then(({ data }) => {
      assignees.map(user => assignUser(data.noteUpdate.note.id, user.id))
      setLoadingStatus(false)
      setUpdated(true)
    })
  }

  function setDefaultData() {
    setTitle(data.body)
    setTaskType(data.category)
    setAssignees(data.assignees)
    setTaskStatus(data.completed)
    setDate(data.dueDate)
    setData({
      user: data.user.name,
      userId: data.user.id
    })
  }

  useEffect(() => {
    if (taskId) {
      setDefaultData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId])

  return (
    <form onSubmit={handleSubmit}>
      <Snackbar
        open={updated}
        autoHideDuration={3000}
        onClose={() => setUpdated(!updated)}
        color="primary"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message="Task updated successfully"
      />
      <TextField
        name="task_description"
        label="Task Description"
        placeholder="Describe the task here"
        style={{ width: '100%' }}
        onChange={e => setTitle(e.target.value)}
        value={title}
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
        required
      />
      <br/>
      <FormControl fullWidth >
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
      <FormControl fullWidth >
        <InputLabel id="assignees">Assign this task to users</InputLabel>
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
      <FormControlLabel
        value="end"
        control={
          <Checkbox
            aria-label="task_status"
            data-testid="task_status"
            checked={taskStatus}
            onChange={() => setTaskStatus(!taskStatus)}
            color="primary"
          />
        }
        label="Task Status"
        labelPlacement="end"
      />
      <FormHelperText>Checked for complete</FormHelperText>
      <div>
        <DatePickerDialog
          handleDateChange={date => setDate(date)}
          selectedDate={selectedDate}
        />
        <FormHelperText>Pick a due date</FormHelperText>
      </div>

      <br />
      <div className="d-flex row justify-content-center">
        {!taskId && (
          <Button
          variant="contained"
          aria-label="task_cancel"
          color="secondary"
          onClick={close}
          className={`btn ${css(discussStyles.cancelBtn)}`}
        >
          Cancel
        </Button>)}
        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={loading}
          aria-label="task_submit"
          className={`btn ${css(discussStyles.submitBtn)}`}
        >
          {taskId ? (loading ? 'Updating a task ...' : 'Update Task') : (loading ? 'Creating a task ...' : 'Create Task')}
        </Button>
      </div>
      <p className="text-center">
          {Boolean(error.length) && error}
      </p>
    </form>
  )
}

const styles = StyleSheet.create({
  cancleBotton: {
      width: '100%',
      ':hover': {
          textDecoration: 'none'
      }
  }
})

TaskForm.defaultProps = {
  users: []
}

TaskForm.propTypes = {
  users: PropTypes.array.isRequired,
  close: PropTypes.func,
  refetch: PropTypes.func,
}