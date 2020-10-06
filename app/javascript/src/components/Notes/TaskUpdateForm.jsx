/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react'
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
  Snackbar,
  Chip,Typography
} from '@material-ui/core'
import { css } from 'aphrodite'
import { useMutation } from 'react-apollo'
import PropTypes from 'prop-types'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import Autocomplete from '@material-ui/lab/Autocomplete'
import DatePickerDialog from '../DatePickerDialog'
import { UpdateNote } from '../../graphql/mutations'
import { discussStyles } from '../Discussion/Discuss'
import { UserChip } from '../UserChip'
import { NotesCategories } from '../../utils/constants'
import UserSearch from '../User/UserSearch'
import { FormToggle } from '../Campaign/ToggleButton'
import { sanitizeText } from '../../utils/helpers'

const initialData = {
  user: '',
  userId: ''
}

export default function TaskForm({ users, data, assignUser }) {
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

  const [type, setType] = useState("preview")
    const handleType = (event, value) => {
        setType(value);
    };

  function handleSubmit(event) {
    event.preventDefault()
    setLoadingStatus(true)
    updateTask()
  }

  function updateTask() {
    taskUpdate({
      variables: {
        id: data.id,
        body: title,
        dueDate: selectedDate,
        completed: taskStatus,
        description,
        category: taskType,
        flagged: true,
        userId: userData.userId
      }
    }).then(() => {
      setLoadingStatus(false)
      setUpdated(true)
    }).catch((err) => {
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
      userId: data.user.id
    })
  }

  function handleOpenAutoComplete() {
    setOpen(!autoCompleteOpen)
  }

  useEffect(() => {
    setDefaultData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Snackbar
          open={updated}
          autoHideDuration={3000}
          onClose={() => setUpdated(!updated)}
          color="primary"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          message="Task updated successfully"
        />

        <FormToggle type={type} handleType={handleType} />

        {
            type === 'preview' ? (
              <p>
                <Typography variant="caption" display="block" gutterBottom>
                  Task Body
                </Typography>
                <span 
                // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                  __html: sanitizeText(title)
                }}
                />
              </p>
            ) :
            (
              <TextField
                name="task_body"
                label="Task Body"
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
            )
          }


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
        <FormControl fullWidth> 
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
              label={
                  autoCompleteOpen  ? 'Close' : 'Add Assignee'
                }
              size="medium"
              icon={
                  autoCompleteOpen  ? (
                    <CancelIcon />
                  ) : (
                    <AddCircleIcon />
                  )
                }
              onClick={event => handleOpenAutoComplete(event, data.id)}
            />

            {
              autoCompleteOpen && (
                <Autocomplete
                  clearOnEscape
                  clearOnBlur
                  open={autoCompleteOpen}
                  onClose={() => setOpen(!autoCompleteOpen)}
                  loading={loading}
                  id={data.id}
                  options={users}
                  getOptionLabel={(option) => option.name}
                  style={{ width: 300 }}
                  onChange={(_evt, value) => {
                    if (!value) {
                      return
                    }
                    assignUser(data.id, value.id)
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Name of assignee" />
                  )}
                />
              )
}
          </div>
        </FormControl>
        <br />
        <UserSearch userData={userData} update={setData} /> 
        <br />
        <FormControlLabel
          value="end"
          control={(
            <Checkbox
              aria-label="task_status"
              data-testid="task_status"
              checked={taskStatus}
              onChange={() => setTaskStatus(!taskStatus)}
              color="primary"
            />
        )}
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
            type="submit"
            color="primary"
            disabled={loading}
            aria-label="task_submit"
            className={`btn ${css(discussStyles.submitBtn)}`}
          >
            {loading ? 'Updating a task ...' : 'Update Task'}
          </Button>
        </div>
        <p className="text-center">
          {Boolean(error.length) && error}
        </p>
      </form>
    </>
  )
}

TaskForm.defaultProps = {
 users: [],
 data: {}
}
TaskForm.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  assignUser: PropTypes.func.isRequired
}
