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
import { Grid,Typography } from '@mui/material';
import { css } from 'aphrodite'
import { useMutation } from 'react-apollo'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import { CreateNote } from '../../../graphql/mutations'
import DatePickerDialog from '../../../components/DatePickerDialog'
import { discussStyles } from '../../../components/Discussion/Discuss'
import { NotesCategories } from '../../../utils/constants'
// TODO: This should be moved to the shared directory
import UserSearch from '../../Users/Components/UserSearch'
import CustomAutoComplete from '../../../shared/autoComplete/CustomAutoComplete';

const initialData = {
  user: '',
  userId: ''
}
export default function LeadManagementForm({ close, userId }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setErrorMessage] = useState('')
  const [assignees, setAssignees] = useState([])
  const [taskType, setTaskType] = useState('')
  const [selectedDate, setDate] = useState(new Date())
  const [loading, setLoadingStatus] = useState(false)
  const [updateUserDetails] = useMutation(CreateNote)
  const [userData, setData] = useState(initialData)
  const { t } = useTranslation(['task', 'common'])

  function handleSubmit(event) {
    event.preventDefault()
    setLoadingStatus(true)
    createTask({
      variables: {
        body: title,
        description,
        due: selectedDate ? selectedDate.toISOString() : null,
        category: taskType,
        flagged: true,
        userId: userData.userId,
        parentNoteId: parentTaskId,
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
      <Typography variant="h6">Contact Information</Typography>
        
      <TextField
        name="first_name"
        label="First Name"
        // placeholder={t('common:form_placeholders.note_body')}
        style={{ width: '100%' }}
        onChange={e => setFirstName(e.target.value)}
        value={title}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'first_name'
        }}
        InputLabelProps={{
          shrink: true
        }}
        required
      />
      <TextField
        name="last_name"
        label="Last Name"
        // placeholder={t('common:form_placeholders.note_description')}
        style={{ width: '100%' }}
        onChange={e => setLastName(e.target.value)}
        value={description}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'last_name'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

     <TextField
        name="title"
        label="Title"
        // placeholder={t('common:form_placeholders.note_description')}
        style={{ width: '100%' }}
        onChange={e => setTitle(e.target.value)}
        value={description}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'title'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />


     <TextField
        name="primary_email"
        label="Primary Email"
        // placeholder={t('common:form_placeholders.note_description')}
        style={{ width: '100%' }}
        onChange={e => setPrimaryEmail(e.target.value)}
        value={description}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'primary_email'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="secondary_email"
        label="Secondary Email"
        // placeholder={t('common:form_placeholders.note_description')}
        style={{ width: '100%' }}
        onChange={e => setPrimaryEmail(e.target.value)}
        value={description}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'secondary_email'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="mobile"
        label="Mobile"
        // placeholder={t('common:form_placeholders.note_description')}
        style={{ width: '100%' }}
        onChange={e => setMobile(e.target.value)}
        value={description}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'Mobile'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="phone"
        label="Phone"
        // placeholder={t('common:form_placeholders.note_description')}
        style={{ width: '100%' }}
        onChange={e => setMobile(e.target.value)}
        value={description}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'Phone'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

<     TextField
        name="linkedin"
        label="Linkedin"
        // placeholder={t('common:form_placeholders.note_description')}
        style={{ width: '100%' }}
        onChange={e => setMobile(e.target.value)}
        value={description}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'Linkedin'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />
      <br />
      <p className="text-center">
        {Boolean(error.length) && error}
      </p>
    </form>
  )
}

LeadManagementForm.defaultProps = {
  users: [],
  parentTaskId: ''
}

LeadManagementForm.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape),
  close: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  assignUser: PropTypes.func.isRequired,
  parentTaskId: PropTypes.string
}
