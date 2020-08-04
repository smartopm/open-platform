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
import { styles } from '../ShareButton'
import { CreateNote } from '../../graphql/mutations'

export default function TaskForm({ close, refetch }) {
  const [title, setTitle] = useState('')
  const [selectedDate, setDate] = useState(new Date())
  const [taskStatus, setTaskStatus] = useState(false)
  const [createTask] = useMutation(CreateNote)

  function handleSubmit(event) {
    event.preventDefault()
    // author is logged in
    console.log({ title, selectedDate, taskStatus })
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
    })
    .catch(err => console.err(err))
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="task_description"
        label="Discussion Description"
        style={{ width: '63vw' }}
        placeholder="Type a task description"
        onChange={e => setTitle(e.target.value)}
        value={title}
        multiline
        rows={3}
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
          //   color="secondary"
          onClick={close}
          className={`btn ${css(styles.cancelBtn)}`}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          // disabled={loading}
          aria-label="discussion_submit"
          className={`btn ${css(styles.submitBtn)}`}
        >
          {/* {loading ? 'Submitting ...' : 'Submit'} */}
          Create Task
        </Button>
      </div>
    </form>
  )
}
