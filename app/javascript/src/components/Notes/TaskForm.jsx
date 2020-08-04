// Title,
// Created By,
// Associated To,
// Due By
// Mark Complete
// Create Task button.

import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import {
  Button,
  FormControlLabel,
  Checkbox,
  FormHelperText
} from '@material-ui/core'
import DatePickerDialog from '../DatePickerDialog'
import { css } from 'aphrodite'
import { useMutation } from 'react-apollo'
import { CreateNote } from '../../graphql/mutations'
import { discussStyles } from '../Discussion/Discuss'

export default function TaskForm({ close, refetch }) {
  const [title, setTitle] = useState('')
  const [selectedDate, setDate] = useState(new Date())
  const [taskStatus, setTaskStatus] = useState(false)
  const [loading, setLoadingStatus] = useState(false)
  const [createTask] = useMutation(CreateNote)

  function handleSubmit(event) {
    event.preventDefault()
    setLoadingStatus(true)
    createTask({
      variables: {
        body: title,
        dueDate: selectedDate.toISOString(),
        completed: taskStatus,
        flagged: true
      }
    })
      .then(() => {
        close()
        refetch()
        setLoadingStatus(false)
    })
    .catch(err => console.err(err))
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="task_description"
        label="Task Description"
        style={{ width: '100%' }}
        placeholder="Type a task description"
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
      <br />
      <FormControlLabel
        value="end"
        control={
          <Checkbox
            checked={taskStatus}
            onChange={() => setTaskStatus(!taskStatus)}
            color="primary"
          />
        }
        label="Task Status"
        labelPlacement="end"
      />
      <FormHelperText>Checked for complete</FormHelperText>
      <br />
      <div>
        <DatePickerDialog
          handleDateChange={date => setDate(date)}
          selectedDate={selectedDate}
        />
      </div>

      <br />
      <div className="d-flex row justify-content-center">
        <Button
          variant="contained"
          aria-label="discussion_cancel"
          color="secondary"
          onClick={close}
          className={`btn ${css(discussStyles.cancelBtn)}`}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={loading}
          aria-label="discussion_submit"
          className={`btn ${css(discussStyles.submitBtn)}`}
        >
          {loading ? 'Creating a task ...' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
