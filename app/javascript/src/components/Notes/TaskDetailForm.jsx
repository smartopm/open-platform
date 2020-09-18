/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Redirect, useParams } from 'react-router-dom'
import { useMutation, useLazyQuery, useQuery } from 'react-apollo'
import { UserChip } from '../UserChip'
import { discussStyles } from '../Discussion/Discuss'
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  TextField,
  Snackbar,
  MenuItem,
  InputLabel,
  Select
} from '@material-ui/core'
import { UsersLiteQuery } from '../../graphql/queries'
import { NotesCategories } from '../../utils/constants'
import DatePickerDialog from '../DatePickerDialog'
import { UpdateNote } from '../../graphql/mutations'
import UserSearch from '../User/UserSearch'

const initUserData = {
  user: '',
  userId: ''
}

const initData = {
  id: '',
  userId: '',
  assignees: '',
  title: '',
  dueDate: '',
  taskType: '',
  completed: false,
  body: ''
}

export default function TaskDetailForm({ authState, data, loading, refetch }) {
  const [errorMsg, setErrorMsg] = useState('')
  const [assignees, setAssignees] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [mutationLoading, setLoading] = useState(false)
  const [taskUpdate] = useMutation(UpdateNote)
  const { id } = useParams() // will only exist on task update
  const [formData, setFormData] = useState(initData)
  const [userData, setData] = useState(initUserData)
  
  const [loadAssignees, { load, data: liteData }] = useLazyQuery(UsersLiteQuery, {
    variables: { query: 'user_type: admin' },
    errorPolicy: 'all'
  })

  async function taskUpdateOnSubmit(taskData) {
    setLoading(true)

    try {
      await taskUpdate({ variables: taskData })
      setIsSubmitted(true)
      setLoading(false)
    }
    catch (err) {
      setErrorMsg(err.message)
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()

    const taskData = {
      id: formData.id,
      user_id: formData.userId,
      assigned_to: formData.assigned_to,
      body: formData.body,
      category: formData.category,
      completed: formData.completed,
      dueDate: formData.dueDate,
    }

    return taskUpdateOnSubmit(taskData)    
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  function handleCheckboxChange(e) {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      [name]: checked
    })
  }

  function handleDateChange(date) {
    setFormData({
      ...formData,
      dueDate: date
    })
  }

  if (authState.user.userType !== 'admin') {
    return <Redirect push to="/" />
  }

  if (!loading && !formData.loaded && data) {
    setFormData({ ...data, loaded: true, }) 
  }
  debugger

  return (
    <div className="container">
      <Snackbar
        open={isSubmitted}
        autoHideDuration={3000}
        onClose={() => setIsSubmitted(!isSubmitted)}
        color="primary"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={`task ${id ? 'updated' : 'created'} sucessfully`}
      />
      <form onSubmit={handleSubmit}>
        <TextField
          name="body"
          label="Task Description"
          placeholder="Describe the task here"
          style={{ width: '100%' }}
          onChange={(e) => handleInputChange(e)}
          value={formData.body}
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
              value={formData.category}
              onChange={event => handleInputChange(event)}
              name="category"
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
              value={formData.assignees}
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
                {Boolean(liteData?.usersLite.length) && liteData?.usersLite.map((user) => (
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
              name='completed'
              checked={formData.completed}
              onChange={(e) => handleCheckboxChange(e)}
              color="primary"
            />
          }
          label="Task Status"
          labelPlacement="end"
        />
        <FormHelperText>Checked for complete</FormHelperText>
        <div>
          <DatePickerDialog
            handleDateChange={date => handleDateChange(date)}
            selectedDate={formData.dueDate}
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
            {loading ? 'Updating task ...' : 'Update Task'}
          </Button>
        </div>
        <p className="text-center">
            {Boolean(errorMsg.length) && errorMsg}
        </p>
      </form>
    </div>
  )
}
const styles = StyleSheet.create({
  getStartedButton: {
    backgroundColor: '#69ABA4',
    color: '#FFF',
    width: '30%',
    height: 51,
    boxShadow: 'none',
    marginTop: 50,
    alignItems: 'center'
  }
})
