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
        leadSourceOptions, leadTypeOptions, industryCategoryOptions,
         industryBusinessActivityOptions, regionOptions } from '../../../utils/constants';

export default function LeadManagementForm({ userId }) {
  const matches = useMediaQuery('(max-width:800px)');
  const initialData = {
    user: {
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
      followupAt: '',
      secondaryPhoneNumber: '',
      secondaryInfo: [],
      industrySubSector,

      // Contact information to help pick values from form
      name: '',
      title: '',
      primaryEmail: '',
      secondaryEmail: '',
      primaryPhoneNumber: '',
      secondaryPhoneNumber: '',
      linkedinUrl: '',

      name1: '',
      title1: '',
      primaryEmail1: '',
      secondaryEmail1: '',
      primaryPhoneNumber1: '',
      secondaryPhoneNumber1: '',
      linkedinUrl1: '',

      name2: '',
      title2: '',
      primaryEmail2: '',
      secondaryEmail2: '',
      primaryPhoneNumber2: '',
      secondaryPhoneNumber2: '',
      linkedinUrl2: '',

      // contact details object for easier update
      contactDetails: {
        primaryContact: {
          name: '',
          title: '',
          primaryEmail: '',
          secondaryEmail: '',
          primaryPhoneNumber: '',
          secondaryPhoneNumber: '',
          linkedinUrl: ''
        },
        secondaryContact1: {
          name: '',
          title: '',
          primaryEmail: '',
          secondaryEmail: '',
          primaryPhoneNumber: '',
          secondaryPhoneNumber: '',
          linkedinUrl: ''
        },
        secondaryContact2: {
          name: '',
          title: '',
          primaryEmail: '',
          secondaryEmail: '',
          primaryPhoneNumber: '',
          secondaryPhoneNumber: '',
          linkedinUrl: ''
        }
      }
    }
  };


  const [leadFormData, setLeadFormData] = useState(initialData);
  const [loadingStatus, setLoadingStatus] = useState(false)

  const [errors, setErr] = useState('')

  function handleChange(event) {
    const { name, value } = event.target;
    setLeadFormData({
      user: { ...leadFormData?.user, [name]: value }
    });
  }


  function handlePrimaryContactChange(event){
    const {name, value } = event.target
    
    setLeadFormData({
      user: {...leadFormData?.user,
        contactDetails: {
          ...leadFormData?.user?.contactDetails,
          primaryContact: {
            ...leadFormData?.user?.contactDetails?.primaryContact,
            [name]: value 
          }
        }
      },
    });
  }

  function handleSecondaryContact1Change(event){
    const {name, value} = event.target
    setLeadFormData({
      user: {...leadFormData?.user,
        contactDetails: {
          ...leadFormData?.user?.contactDetails,
          secondaryContact1: {
            ...leadFormData?.user?.contactDetails?.secondaryContact1,
            [name]: value 
          }
        }
      },
    });
  }


  function handleSecondaryContact2Change(event){
    const {name, value} = event.target
    setLeadFormData({
      user: {...leadFormData?.user,
        contactDetails: {
          ...leadFormData?.user?.contactDetails,
          secondaryContact2: {
            ...leadFormData?.user?.contactDetails?.secondaryContact2,
            [name]: value 
          }
        }
      },
    });
  }


  function handleTimeInputChange(event) {
    const { name, value } = event.target;
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
        ...leadFormData?.user,
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
  console.log("Api Data", leadFormData)

  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  if (errors) return <CenteredContent>{formatError(errors.message)}</CenteredContent>;
  if (loading || loadingStatus) return <Spinner />;
  return (
<Grid container>
  <Grid item md={12} xs={12}>
  <form onSubmit={handleSubmit} style={{ margin: '0 -25px 0 -25px' }} >
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
        onChange={handlePrimaryContactChange}
        value={leadFormData?.user?.contactDetails?.primaryContact?.name}
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
        onChange={handlePrimaryContactChange}
        value={leadFormData?.user?.contactDetails?.primaryContact?.title}
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
        name="primaryEmail"
        label="Primary Email"
        // placeholder={t('common:form_placeholders.primary_email')}
        style={{ width: '100%' }}
        onChange={handlePrimaryContactChange}
        value={leadFormData?.user?.contactDetails?.primaryContact?.primaryEmail}
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
        onChange={handlePrimaryContactChange}
        value={leadFormData?.user?.contactDetails?.primaryContact?.secondaryEmail}
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
        name="primaryPhoneNumber"
        label="Primary Phone/Mobile"
        // placeholder={t('common:form_placeholders.primary_phone_number')}
        style={{ width: '100%' }}
        onChange={handlePrimaryContactChange}
        value={leadFormData?.user?.contactDetails?.primaryContact?.primaryPhoneNumber}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'primary_phone_number/mobile'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="secondaryPhoneNumber"
        label="Secondary Phone/Mobile"
        // placeholder={t('common:form_placeholders.secondary_phone_number')}
        style={{ width: '100%' }}
        onChange={handlePrimaryContactChange}
        value={leadFormData?.user?.contactDetails?.primaryContact?.secondaryPhoneNumber}
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
        name="linkedinUrl"
        label="Linkedin"
        // placeholder={t('common:form_placeholders.linkedin_url')}
        style={{ width: '100%' }}
        onChange={handlePrimaryContactChange}
        value={leadFormData?.user?.contactDetails?.primaryContact?.linkedinUrl}
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
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.name}
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
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.title}
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
        name="primaryEmail"
        label="Primary Email"
        // placeholder={t('common:form_placeholders.primary_email')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.primaryEmail}
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
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.secondaryEmail}
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
        name="primaryPhoneNumber"
        label="Primary Phone/Mobile"
        // placeholder={t('common:form_placeholders.primary_phone_number')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.primaryPhoneNumber}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'primary_phone_number/mobile'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="secondaryPhoneNumber"
        label="secondary Phone/Mobile"
        // placeholder={t('common:form_placeholders.secondary_phone_number')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.secondaryPhoneNumber}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'secondary_phone_number/mobile'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="linkedinUrl"
        label="Linkedin"
        // placeholder={t('common:form_placeholders.linkedin_url')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails.secondaryContact1?.linkedinUrl}
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
        // placeholder={t('common:form_placeholders.name')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.name}
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
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.title}
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
        name="primaryEmail"
        label="Primary Email"
        // placeholder={t('common:form_placeholders.primary_email')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.primaryEmail}
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
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.secondaryEmail}
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
        name="primaryPhoneNumber"
        label="Primary Phone/Mobile"
        // placeholder={t('common:form_placeholders.primary_phone_number')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.primaryPhoneNumber}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'primary_phone_number/mobile'
        }}
        InputLabelProps={{
          shrink: true
        }}
      />

      <TextField
        name="secondaryPhoneNumber"
        label="Secondary Phone/Mobile"
        // placeholder={t('common:form_placeholders.secondary_phone_number')}
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.secondaryPhoneNumber}
        multiline
        variant="outlined"
        fullWidth
        rows={2}
        size="small"
        margin="normal"
        inputProps={{
          'aria-label': 'secondary_phone_number/mobile'
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
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails.secondaryContact2?.linkedinUrl}
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
        name="companyName"
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
        name="companyDescription"
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
        name="companyLinkedin"
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
        name="companyWebsite"
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
        name="relevantLink"
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

      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
              <InputLabel id="country">Country</InputLabel>
              <Select
                id="country"
                value={leadFormData?.user?.leadSource}
                onChange={handleChange}
                name="country"
                fullWidth
                variant="outlined"
              >
           {Object.entries(leadSourceOptions).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>))}
              </Select>
            </FormControl>
        </Grid>


        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
              <InputLabel id="industryBusinessActivity">Industry Business Activity</InputLabel>
              <Select
                id="industryBusinessActivity"
                // value={leadFormData?.user?.industryBusinessActivity}
                onChange={handleChange}
                name="industryBusinessActivity"
                fullWidth
                variant="outlined"
              >
           {Object.entries(industryBusinessActivityOptions).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>))}
              </Select>
            </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
              <InputLabel id="region">Region</InputLabel>
              <Select
                id="region"
                // value={leadFormData?.user?.region}
                onChange={handleChange}
                name="region"
                fullWidth
                variant="outlined"
              >
           {Object.entries(regionOptions).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>))}
              </Select>
            </FormControl>
        </Grid>

          <Grid item md={6} xs={12}>
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
                {Object.entries(internationalizationLevels).map(([key, val]) => (
                  <MenuItem key={key} value={key}>
                    {val}
                  </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>


          <Grid item md={6} xs={12}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="industry">Industry Sector</InputLabel>
              <Select
                id="industry"
                value={leadFormData?.user?.industry}
                onChange={handleChange}
                name="industry"
                fullWidth
                variant="outlined"
              >
                {Object.entries(industryCategoryOptions).map(([key, val]) => (
                  <MenuItem key={key} value={key}>
                    {val}
                  </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={6} xs={12}>
            <TextField
              name="companyEmployees"
              label="Number Of Employees"
              // placeholder={t('common:form_placeholders.number_of_employees')}
              style={{ width: '100%' }}
              onChange={handleChange}
              value={leadFormData?.user?.numberOfEmployees}
              multiline
              variant="outlined"
              fullWidth
              // rows={2}
              size="small"
              margin="normal"
              inputProps={{
                'aria-label': 'number_of_employees'
              }}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>


          <Grid item md={6} xs={12}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="industry">Industry Sub Sector</InputLabel>
              <Select
                id="industry"
                value={leadFormData?.user?.industrySubSector}
                onChange={handleChange}
                name="industrySubSector"
                fullWidth
                variant="outlined"
              >
                {Object.entries(industrySubSectorOptions).map(([key, val]) => (
                  <MenuItem key={key} value={key}>
                    {val}
                  </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>













      </Grid>

      {/* <TextField
        name="companyEmployees"
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
      /> */}

    <TextField
        name="companyAnnualRevenue"
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

      <br/>
      <br/>







      <br/>
      <Typography variant="h6">Lead Information</Typography>
      <br/>
      <Grid  container  spacing= {2} style={{ display: 'flex', justifyContent: 'center' }}>
        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
            <InputLabel id="lead_temperature">Lead Temperature</InputLabel>
            <Select
              id="leadTemperature"
              value={leadFormData?.user?.leadTemperature}
              onChange={handleChange}
              name="lead_temperature"
              fullWidth
              variant="outlined"
            >
           {Object.entries(leadTemperatureOptions).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>))}
            </Select>
          </FormControl>

        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
              <InputLabel id="leadStatus">Lead Status</InputLabel>
              <Select
                id="leadStatus"
                value={leadFormData?.user?.leadStatus}
                onChange={handleChange}
                name="lead_status"
                fullWidth
                variant="outlined"
              >
           {Object.entries(leadStatusOptions).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>))}
              </Select>
            </FormControl>
        </Grid>
        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
              <InputLabel id="leadSource">Lead Source</InputLabel>
              <Select
                id="lead_source"
                value={leadFormData?.user?.leadSource}
                onChange={handleChange}
                name="lead_source"
                fullWidth
                variant="outlined"
              >
           {Object.entries(leadSourceOptions).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>))}
              </Select>
            </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
              <InputLabel id="company_contacted">Company Contacted</InputLabel>
              <Select
                id="company_contacted"
                value={leadFormData?.user?.companyContacted}
                onChange={handleChange}
                name="companyContacted"
                fullWidth
                variant="outlined"
              >
                <MenuItem value={10}>1</MenuItem>
                <MenuItem value={20}>2</MenuItem>
                <MenuItem value={30}>3</MenuItem>
              </Select>
            </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
              <InputLabel id="client_category">Client Category</InputLabel>
              <Select
                id="client_category"
                value={leadFormData?.user?.clientCategory}
                onChange={handleChange}
                name="clientCategory"
                fullWidth
                variant="outlined"
              >
           {Object.entries(clientCategories).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>))}
              </Select>
            </FormControl>
        </Grid>

        <Grid item md={6} xs={12}>
          <FormControl fullWidth>
              <InputLabel id="lead_type">Lead Type</InputLabel>
              <Select
                id="lead_type"
                value={leadFormData?.user?.leadType}
                onChange={handleChange}
                name="leadType"
                fullWidth
                variant="outlined"
              >
           {Object.entries(leadTypeOptions).map(([key, val]) => (
            <MenuItem key={key} value={key}>
              {val}
            </MenuItem>))}
              </Select>
            </FormControl>
        </Grid>
      </Grid>
      <br />

      <TextField
        name="nextSteps"
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
          name="leadOwner"
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
          name="createdBy"
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
          name="modifiedBy"
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
