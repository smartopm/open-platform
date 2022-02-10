import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import {
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@material-ui/core'
import { Grid,Typography } from '@mui/material';
import { useLazyQuery, useMutation } from 'react-apollo'
import Box from '@mui/material/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types'
// import { useTranslation } from 'react-i18next';
import { LeadDetailsQuery } from '../../../graphql/queries';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { UpdateUserMutation } from '../../../graphql/mutations/user';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../shared/CenteredContent';
import { formatError } from '../../../utils/helpers';
import { clientCategories, internationalizationLevels, 
        leadTemperatureOptions, leadStatusOptions, industrySubSectorOptions,
        leadSourceOptions, leadTypeOptions, industryCategoryOptions, industryBusinessActivityOptions, regionOptions } from '../../../utils/constants';
import { ReactCountryDropdown } from 'react-country-dropdown'
import 'react-country-dropdown/dist/index.css'
export default function LeadManagementForm({ userId }) {
  const matches = useMediaQuery('(max-width:800px)');
  const initialData = {
    user: {
      name: '',
      title: '',
      linkedinUrl: '',
      roleName: '',
      companyName: '',
      phoneNumber: '',
      country: '',
      companyDescription: '',
      companyLinkedin: '',
      companyWebsite: '',
      relevantLink: '',
      companyEmployees: '',
      companyAnnualRevenue: '',
      industry: '',
      industrySub: '',
      industryBusinessActivity: '',
      levelOfInternationalization: '',
      leadTemperature: '',
      leadStatus: '',
      leadSource: '',
      companyContacted: '',
      clientCategory: '',
      leadType: '',
      leadOwner: '',
      modifiedBy: '',
      createdBy: '',
      nextSteps: '',
      firstContactDate: '',
      lastContactDate: '',
      followupAt: ''
    }
  };


  const [leadFormData, setLeadFormData] = useState(initialData);
  const [loadingStatus, setLoadingStatus] = useState(false)

  const [errors, setErr] = useState('')

  // const industryCategories = {
  //   call: 'Call',
  //   message: 'Message',
  //   email: 'Email',
  //   to_do: 'To-Do',
  //   form: 'Form',
  //   emergency: 'Emergency SOS',
  //   template: 'DRC Process Template'
  // };

  // const levelOfInternationalizationCategories = {
  //   call: 'Call',
  //   message: 'Message',
  //   email: 'Email',
  //   to_do: 'To-Do',
  //   form: 'Form',
  //   emergency: 'Emergency SOS',
  //   template: 'DRC Process Template'
  // };

  // function handleChange(event) {
  //   const { name, value } = event.target;
  //   setLeadFormData({
  //     user: { ...leadFormData?.user, [name]: value }
  //   });
  // }

  function handleTimeInputChange(event) {
    const { name, value } = event.target;
    console.log("Form data", name, value)
      setLeadFormData({
        ...leadFormData,
       user: { [name]: value } 
      });
  }

  const [leadDataUpdate] = useMutation(UpdateUserMutation)
  
  const [loadLeadData, { loading, error, data }] = useLazyQuery(LeadDetailsQuery, {
    variables: { id: userId },
    fetchPolicy: 'cache-and-network'
  })

  function handleSubmit(event) {
    event.preventDefault()
    setLoadingStatus(true)
    leadDataUpdate({
      variables: {
        ...leadFormData,
        name: leadFormData?.user?.name,
        id: userId,
      }
    })
      .then(() => {
        setLoadingStatus(false)
    })
    .catch(err => setErr(err))
  }

  useEffect(() => {
    loadLeadData();
    if (data?.user) {
      setLeadFormData({
        ...data
      });
    }
  }, [data]);

  if (error || errors) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (loading || loadingStatus) return <Spinner />;
  return (
<Grid container>
  <Grid item md={12} xs={12}>
  <form onSubmit={handleSubmit} style={{ margin: '0 -25px 0 -25px' }} >

  <div>
      <ReactCountryDropdown onSelect={handleSelect} countryCode='IN' />
    </div>


      <Grid container  >
        <Grid item md={6} xs={6}>
          <Typography variant="h6">{ matches ? 'Contact Info' : "Primary Contact"}</Typography>
        </Grid>
        <Grid item md={6} xs={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 0 }}>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            aria-label="task_submit"
          >
            { matches ? 'Save' : "Save Updates"}
          </Button>
        </Grid>
      </Grid>
      <br/>
      <TextField
        name="name"
        label="Name"
        // placeholder={t('common:form_placeholders.name')}
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.name}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'name'
        }}
        InputLabelProps={{
          shrink: true
        }}
        required
      />

     <TextField
        name="title"
        label="Title"
        // placeholder={t('common:form_placeholders.title')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={leadFormData?.user?.title}
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
        name="email"
        label="Primary Email"
        // placeholder={t('common:form_placeholders.primary_email')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={primaryEmail}
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
        name="secondaryEmail"
        label="Secondary Email"
        // placeholder={t('common:form_placeholders.secondary_email')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={secondaryEmail}
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
        name="phoneNumber"
        label="Mobile"
        // placeholder={t('common:form_placeholders.primary_phone')}
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.phoneNumber}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'primary_phone/mobile'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="secondaryPhoneNumber"
        label="Phone"
        // placeholder={t('common:form_placeholders.secondary_phone')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={leadFormData?.user?.secondaryPhoneNumber}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'secondary_phone/mobile'
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
        onChange={handleChange}
        // value={leadFormData?.user?.linkedinUrl}
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

      <br/>
      <br/>
      <br/>
      <Typography variant="h6"> Secondary Contact 1</Typography>
      <br/>
      <TextField
        name="name"
        label="Name"
        // placeholder={t('common:form_placeholders.name1')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={leadFormData?.user?.name1}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'name'
        }}
        InputLabelProps={{
          shrink: true
        }}
        required
      />

     <TextField
        name="title"
        label="Title"
        // placeholder={t('common:form_placeholders.title1')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={leadFormData?.user?.title1}
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
        onChange={handleChange}
        // value={leadFormData?.user?.primaryEmail1}
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
        // placeholder={t('common:form_placeholders.secondary_email1')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={leadFormData?.user?.secondaryEmail1}
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
        onChange={handleChange}
        // value={mobile}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'primary_phone/mobile'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="phone"
        label="Phone"
        // placeholder={t('common:form_placeholders.phone')}
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.phoneNumber}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'secondary_phone/mobile'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="linkedin"
        label="Linkedin"
        // placeholder={t('common:form_placeholders.linkedin1')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={leadFormData?.user?.linkedinUrl1}
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

      <br/>
      <br/>
      <br/>
      <Typography variant="h6"> Secondary Contact 2</Typography>
      <br/>
      <TextField
        name="name"
        label="Name"
        // placeholder={t('common:form_placeholders.name2')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={leadFormData?.user?.name2}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'name'
        }}
        InputLabelProps={{
          shrink: true
        }}
        required
      />

     <TextField
        name="title"
        label="Title"
        // placeholder={t('common:form_placeholders.title2')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={leadFormData?.user?.title2}
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
        // placeholder={t('common:form_placeholders.primary_email2')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={leadFormData?.user?.primaryEmail2}
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
        // placeholder={t('common:form_placeholders.secondary_email2')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={leadFormData?.user?.secondaryEmail2}
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
        // placeholder={t('common:form_placeholders.primary_phone2')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={leadFormData?.user?.phoneNumber2}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'primary_phone/mobile'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="phone"
        label="Phone"
        // placeholder={t('common:form_placeholders.phone')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={leadFormData?.user?.secondaryPhoneNumber2}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'secondary_phone/mobile'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="linkedin"
        label="Linkedin"
        // placeholder={t('common:form_placeholders.linkedin2')}
        style={{ width: '100%' }}
        onChange={handleChange}
        // value={leadFormData?.user?.linkedinUrl2}
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
    <br/>
    <br/>
    <br/>
      
      <Typography variant="h6">Company Information</Typography>
      <TextField
        name="company_name"
        label="Company Name"
        // placeholder={t('common:form_placeholders.company_name')}
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.companyName}
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
        onChange={handleChange}
        value={leadFormData?.user?.country}
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
        onChange={handleChange}
        value={leadFormData?.user?.companyDescription}
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
        onChange={handleChange}
        value={leadFormData?.user?.companyLinkedin}
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
        onChange={handleChange}
        value={leadFormData?.user?.companyWebsitecompanyWebsite}
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
        onChange={handleChange}
        value={leadFormData?.user?.relevantLink}
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
        onChange={handleChange}
        value={leadFormData?.user?.numberOfEmployees}
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
        onChange={handleChange}
        value={leadFormData?.user?.annualRevenue}
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
      <br/>
      <br/>
      <Box sx={{ maxWidth: 420 }}>
      <FormControl variant="standard" fullWidth>
        <InputLabel id="industry">Industry</InputLabel>
        <Select
          id="industry"
          value={leadFormData?.user?.industry}
          onChange={handleChange}
          // onChange={event => setIndustry(event.target.value)}
          name="industry"
          fullWidth
          variant="outlined"
        >
          {Object.entries(NotesCategories).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>
            ))}
        </Select>
      </FormControl>
      </Box>
      <br/>
      <br/>
      <Box sx={{ maxWidth: 420 }}>
      <FormControl variant="standard" fullWidth>
        <InputLabel id="level_of_internationalization">Level of Internationalization</InputLabel>
        <Select
          id="level_of_internationalization"
          value={leadFormData?.user?.levelOfInternationalization}
          onChange={handleChange}
          name="levelOfInternationalization"
          fullWidth
          variant="outlined"
        >
           {Object.entries(NotesCategories).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>
            ))}
        </Select>
      </FormControl>
      </Box>
      <br/>
      <Typography variant="h6">Lead Information</Typography>
      <br/>
      <Grid  container  spacing= {2} style={{ display: 'flex', justifyContent: 'center' }}>
        <Grid item md={6} xs={12}>
        <Box sx={{ maxWidth: 420 }}>
          <FormControl fullWidth>
            <InputLabel id="lead_temperature">Lead Temperature</InputLabel>
            <Select
              id="lead_temperature"
              value={leadFormData?.user?.leadTemperature}
              onChange={handleChange}
              name="lead_temperature"
              fullWidth
              variant="outlined"
            >
              <MenuItem value={10}>14</MenuItem>
              <MenuItem value={20}>23</MenuItem>
              <MenuItem value={30}>33</MenuItem>
            </Select>
          </FormControl>
          </Box>

        </Grid>
        <Grid item md={6} xs={12}>
        <Box sx={ { maxWidth: 420}}>
          <FormControl fullWidth>
              <InputLabel id="lead_status">Lead Status</InputLabel>
              <Select
                id="lead_status"
                value={leadFormData?.user?.leadStatus}
                onChange={handleChange}
                name="lead_status"
                fullWidth
                variant="outlined"
              >
                <MenuItem value={10}>1</MenuItem>
                <MenuItem value={20}>2</MenuItem>
                <MenuItem value={30}>3</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item md={6} xs={12}>
        <Box sx={ { maxWidth: 420}}>
          <FormControl fullWidth>
              <InputLabel id="lead_source">Lead Source</InputLabel>
              <Select
                id="lead_source"
                value={leadFormData?.user?.leadSource}
                onChange={handleChange}
                name="lead_source"
                fullWidth
                variant="outlined"
              >
                <MenuItem value={10}>1</MenuItem>
                <MenuItem value={20}>2</MenuItem>
                <MenuItem value={30}>3</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item md={6} xs={12}>
        <Box sx={ { maxWidth: 420}}>
          <FormControl fullWidth>
              <InputLabel id="company_contacted">Company Contacted</InputLabel>
              <Select
                id="company_contacted"
                value={leadFormData?.user?.companyContacted}
                onChange={handleChange}
                name="company_contacted"
                fullWidth
                variant="outlined"
              >
                <MenuItem value={10}>1</MenuItem>
                <MenuItem value={20}>2</MenuItem>
                <MenuItem value={30}>3</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item md={6} xs={12}>
        <Box sx={ { maxWidth: 420}}>
          <FormControl fullWidth>
              <InputLabel id="client_category">Client Category</InputLabel>
              <Select
                id="client_category"
                value={leadFormData?.user?.clientCategory}
                onChange={handleChange}
                name="client_category"
                fullWidth
                variant="outlined"
              >
                <MenuItem value={10}>1</MenuItem>
                <MenuItem value={20}>2</MenuItem>
                <MenuItem value={30}>3</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid item md={6} xs={12}>
        <Box sx={ { maxWidth: 420}}>
          <FormControl fullWidth>
              <InputLabel id="lead_type">Lead Type</InputLabel>
              <Select
                id="lead_type"
                value={leadFormData?.user?.leadType}
                onChange={handleChange}
                name="lead_type"
                fullWidth
                variant="outlined"
              >
                <MenuItem value={10}>1</MenuItem>
                <MenuItem value={20}>2</MenuItem>
                <MenuItem value={30}>3</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      <br />

      <TextField
        name="next_steps"
        label="Next Steps"
        // placeholder={t('common:form_placeholders.next_steps')}
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.nextSteps}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'next_steps'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <br/>
      <Grid container  spacing= {2} style={{ display: 'flex', justifyContent: 'center' , alignItems: 'center', placeContent: 'center'}}>
      <Grid item md={6} xs={12}>
        <TextField
          name="lead_owner"
          label="Lead Owner"
          // placeholder={t('common:form_placeholders.lead_owner')}
          style={{ width: '100%' }}
          onChange={handleChange}
          value={leadFormData?.user?.leadOwner}
          multiline
          variant="outlined"
          fullWidth
          rows={2}
          size="small"
          margin="normal"
          inputProps={{
            'aria-label': 'lead_owner'
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
        </Grid>

        <Grid item md={6} xs={12}>
        <DatePickerDialog
          label="First Contact Date"
          handleDateChange={date => handleTimeInputChange({ target: { name: 'firstContactDate', value: date } })}
          selectedDate={loadLeadData?.user?.firstContactDate}
          inputProps={{ 'data-testid': 'start_time_input' }}
          inputVariant="outlined"
        />
        </Grid>


        <Grid item md={6} xs={12}>
        <TextField
          name="created_by"
          label="Created By"
          // placeholder={t('common:form_placeholders.created_by')}
          style={{ width: '100%' }}
          onChange={handleChange}
          value={leadFormData?.user?.createdBy}
          multiline
          variant="outlined"
          fullWidth
          rows={2}
          size="small"
          margin="normal"
          inputProps={{
            'aria-label': 'created_by'
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
        </Grid>

        <Grid item md={6} xs={12}>
        <DatePickerDialog
          label="First Contact Date"
          inputProps={{ 'data-testid': 'first_contact_date_input' }}
          handleDateChange={date => handleTimeInputChange({ target: { name: 'firsContactDate', value: date } })}
          selectedDate={leadFormData?.user?.firsContactDate}
          inputVariant="outlined"
        />
        </Grid>


        <Grid item md={6} xs={12}>
        <TextField
          name="modified_by"
          label="Modified By"
          // placeholder={t('common:form_placeholders.modified_by')}
          style={{ width: '100%' }}
          onChange={handleChange}
          value={leadFormData?.user?.modifiedBy}
          multiline
          variant="outlined"
          fullWidth
          rows={2}
          size="small"
          margin="normal"
          inputProps={{
            'aria-label': 'modified_by'
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
        </Grid>

        <Grid item md={6} xs={12}>
        <DatePickerDialog
          label="Date Follow Up"
          inputProps={{ 'data-testid': 'date_follow_up_input' }}
          handleDateChange={date => handleTimeInputChange({ target: { name: 'followupAt', value: date } })}
          selectedDate={leadFormData?.user?.followupAt}
          inputVariant="outlined"
        />
        </Grid>

      </Grid>
      <p className="text-center">
        {/* {Boolean(error.length) && error} */}
      </p>
    </form>

  </Grid>

  </Grid>
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
