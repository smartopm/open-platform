import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import {
  Button,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio
} from '@material-ui/core'
import DatePickerDialog from '../DatePickerDialog'
import { css } from 'aphrodite'
import { useMutation, useLazyQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { CreateNote } from '../../graphql/mutations'
import { discussStyles } from '../Discussion/Discuss'
import { UserChip } from '../UserChip'
import { UsersLiteQuery } from '../../graphql/queries'
import { Spinner } from '../Loading'
import { NotesCategories } from '../../utils/constants'

export default function TaskForm({ close, refetch, users, assignUser}) {
  const [title, setTitle] = useState('')
  const [error, setErrorMessage] = useState('')
  const [assignees, setAssignees] = useState([])
  const [taskType, setTaskType] = useState('')
  const [taskUser, setTaskUser] = useState('')
  const [taskUserId, setTaskUserId] = useState('')
  const [selectedDate, setDate] = useState(new Date())
  const [taskStatus, setTaskStatus] = useState(false)
  const [loading, setLoadingStatus] = useState(false)
  const [createTask] = useMutation(CreateNote)

  // this will be used only for user association
  const [loadUsers, { loading: isLoading, error: queryErrors, data }] = useLazyQuery(UsersLiteQuery)

  function handleSubmit(event) {
    event.preventDefault()
    setLoadingStatus(true)
    createTask({
      variables: {
        body: title,
        due: selectedDate ? selectedDate.toISOString() : null,
        completed: taskStatus,
        category: taskType,
        flagged: true,
        userId: taskUserId
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

  function handleTaskUser(event) {
    setTaskUser(event.target.value)
  
    setTimeout(() => {
      loadUsers({
        variables: {
          query: taskUser,
          errorPolicy: 'all',
          fetchPolicy: 'cache-and-network',
        },
      })
    }, 1000)
  }
  return (
    <form onSubmit={handleSubmit}>
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
      {/* have a normal text field */}
      {
        !isLoading && !queryErrors ? (
          <TextField
            name="task user"
            label="Task User"
            placeholder="Type the user name here"
            style={{ width: '100%' }}
            onChange={handleTaskUser}
            value={taskUser}
            fullWidth
            margin="normal"
            inputProps={{
              'aria-label': 'task_user'
            }}
            InputLabelProps={{
              shrink: true
            }}
          />
        )
        : <Spinner />
      }
    {/* associated user */}
      {
        data?.users.length ? (
          <FormControl component="fieldset">
          <FormLabel component="legend">Choose a user</FormLabel>
          <RadioGroup aria-label="user" name="task_user" value={taskUserId} onChange={e => setTaskUserId(e.target.value)}>
          {
            data?.users.map(user => (
              <FormControlLabel key={user.id} value={user.id} control={<Radio />} label={user.name} />
            ))
            }
          </RadioGroup>
        </FormControl>
        ) : Boolean(taskUser.length) && !isLoading && `${taskUser} not found in users`
      }
      {
        // separate radios from checkbox only after search
        data?.users.length && <hr />
      }
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
        <Button
          variant="contained"
          aria-label="task_cancel"
          color="secondary"
          onClick={close}
          className={`btn ${css(discussStyles.cancelBtn)}`}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={loading}
          aria-label="task_submit"
          className={`btn ${css(discussStyles.submitBtn)}`}
        >
          {loading ? 'Creating a task ...' : 'Create Task'}
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