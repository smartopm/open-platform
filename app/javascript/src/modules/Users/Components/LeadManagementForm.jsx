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
import Box from '@mui/material/Box';
import { useMutation } from 'react-apollo'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import { CreateNote } from '../../../graphql/mutations'
// import DatePickerDialog from '../../../components/DatePickerDialog'

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
    updateUserDetails({
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
        // placeholder={t('common:form_placeholders.first_name')}
        style={{ width: '100%' }}
        onChange={e => setFirstName(e.target.value)}
        // value={first_name}
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
        // placeholder={t('common:form_placeholders.last_name')}
        style={{ width: '100%' }}
        onChange={e => setLastName(e.target.value)}
        // value={last_name}
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
        // placeholder={t('common:form_placeholders.title')}
        style={{ width: '100%' }}
        onChange={e => setTitle(e.target.value)}
        // value={title}
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
        // placeholder={t('common:form_placeholders.primary_email')}
        style={{ width: '100%' }}
        onChange={e => setPrimaryEmail(e.target.value)}
        // value={primary_email}
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
        // placeholder={t('common:form_placeholders.secondary_email')}
        style={{ width: '100%' }}
        onChange={e => setPrimaryEmail(e.target.value)}
        // value={secondary_email}
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
        // value={mobile}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'mobile'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="phone"
        label="Phone"
        // placeholder={t('common:form_placeholders.ohone')}
        style={{ width: '100%' }}
        onChange={e => setPhone(e.target.value)}
        // value={phone}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'phone'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="linkedin"
        label="Linkedin"
        // placeholder={t('common:form_placeholders.linkedin')}
        style={{ width: '100%' }}
        onChange={e => setMobile(e.target.value)}
        // value={linkedin}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'linkedin'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />
      <Typography variant="h6">Company Information</Typography>
      <TextField
        name="company_name"
        label="Company Name"
        // placeholder={t('common:form_placeholders.company_name')}
        style={{ width: '100%' }}
        onChange={e => setCompanyName(e.target.value)}
        // value={company_name}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'company_name'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="country"
        label="Country"
        // placeholder={t('common:form_placeholders.company_name')}
        style={{ width: '100%' }}
        onChange={e => setCountry(e.target.value)}
        // value={country}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'country'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="company_description"
        label="Company Description"
        // placeholder={t('common:form_placeholders.company_description')}
        style={{ width: '100%' }}
        onChange={e => setCompanyDescription(e.target.value)}
        // value={company_description}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'company_description'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="company_linkedin"
        label="Company Linkedin"
        // placeholder={t('common:form_placeholders.company_linkedin')}
        style={{ width: '100%' }}
        onChange={e => setCompanyLinkedin(e.target.value)}
        // value={company_linkedin}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'company_linkedin'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="company_website"
        label="Company Website"
        // placeholder={t('common:form_placeholders.company_website')}
        style={{ width: '100%' }}
        onChange={e => setCompanyWebsite(e.target.value)}
        // value={company_website}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'company_website'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

  
      <TextField
        name="news"
        label="Relevant Links/News"
        // placeholder={t('common:form_placeholders.news')}
        style={{ width: '100%' }}
        onChange={e => setNews(e.target.value)}
        // value={news}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'news'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="news"
        label="Relevant Links/News"
        // placeholder={t('common:form_placeholders.news')}
        style={{ width: '100%' }}
        onChange={e => setNews(e.target.value)}
        // value={news}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'news'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="number_of_employees"
        label="No. of Employees"
        // placeholder={t('common:form_placeholders.number_of_employees')}
        style={{ width: '100%' }}
        onChange={e => setNumberOfEmployees(e.target.value)}
        // value={number_of_employees}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'number_of_employees'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

    <TextField
        name="annual_revenue"
        label="Annual Revenue"
        // placeholder={t('common:form_placeholders.annual_revenue')}
        style={{ width: '100%' }}
        onChange={e => setAnnualRevenue(e.target.value)}
        // value={annual_revenue}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'annual_revenue'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />
      <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="industry">Industry</InputLabel>
        <Select
          id="industry"
          // value={industry}
          onChange={event => setIndustry(event.target.value)}
          name="industry"
          fullWidth
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      </Box>
      
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
