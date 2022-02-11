import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import {
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider
} from '@material-ui/core'
import { Grid,Typography } from '@mui/material';
import { useLazyQuery, useMutation } from 'react-apollo'
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
         industryBusinessActivityOptions, regionOptions, countries } from '../../../utils/constants';

export default function LeadManagementForm({ userId }) {
  const matches = useMediaQuery('(max-width:800px)');
  const initialData = {
    user: {
      roleName: '',
      companyName: '',
      phoneNumber: '',
      email: '',
      country: '',
      region: '',
      companyDescription: '',
      companyLinkedin: '',
      companyWebsite: '',
      relevantLink: '',
      companyEmployees: '',
      companyAnnualRevenue: '',
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
      firstContactDate: new Date(),
      lastContactDate: new Date(),
      followupAt: new Date(),
      secondaryPhoneNumber: '',
      secondaryInfo: [],
      industrySubSector: '',

      // Contact information to help pick values from form
      name: '',
      title: null,
      primaryEmail: '',
      secondaryEmail: '',
      primaryPhoneNumber: '',
      secondaryPhoneNumber: '',
      linkedinUrl: '',

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

  const[disabled, setDisabled] = useState(true)

  function handleChange(event) {
    setDisabled(false)
    const { name, value } = event.target;
    setLeadFormData({
      user: { ...leadFormData?.user, [name]: value }
    });
  }

  function handleSecondaryContact1Change(event){
    setDisabled(false)
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
    setDisabled(false)
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
    setDisabled(false)
    const { name, value } = event.target;
      setLeadFormData({
        ...leadFormData,
       user: { ...leadFormData?.user, [name]: value }
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

    const secondaryInfo = [   
      { contactType: "email", info: leadFormData?.user?.secondaryEmail },
      { contactType: "phone", info: leadFormData?.user?.secondaryPhoneNumber }
     ]


    leadDataUpdate({
      variables: {
        ...leadFormData?.user,
        secondaryInfo: [...secondaryInfo],
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
        user: {
          ...data.user,
          contactDetails: {
            ...data.user.contactDetails,
            secondaryContact1: {
              ...data.user.contactDetails?.secondaryContact1

            },
            secondaryContact2: {
              ...data.user.contactDetails?.secondaryContact2
            }
          }
        }
      });
    }
  }, [data]);

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
            disabled={disabled}
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
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.name}
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
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.title}
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
        name="email"
        label="Primary Email"
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.email}
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
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.secondaryEmail}
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
        name="phoneNumber"
        label="Mobile"
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.phoneNumber}
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
        label="Phone"
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.secondaryPhoneNumber}
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
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.linkedinUrl}
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
      <Grid item md={12} xs={12} style={{ marginBottom: '2px'}}>
        <Divider />
      </Grid>
      <br/> 
      <Typography variant="h6"> Secondary Contact 1</Typography>
      <br/>
      <TextField
        name="name"
        label="Name"
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.name}
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
      />

     <TextField
        name="title"
        label="Title"
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.title}
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
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.primaryEmail}
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
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.secondaryEmail}
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
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.primaryPhoneNumber}
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
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact1?.secondaryPhoneNumber}
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
        style={{ width: '100%' }}
        onChange={handleSecondaryContact1Change}
        value={leadFormData?.user?.contactDetails.secondaryContact1?.linkedinUrl}
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
      <Grid item md={12} xs={12} style={{ marginBottom: '2px'}}>
        <Divider />
      </Grid>
      <br/> 
      <Typography variant="h6"> Secondary Contact 2</Typography>
      <br/>
      <TextField
        name="name"
        label="Name"
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.name}
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
      />

     <TextField
        name="title"
        label="Title"
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.title}
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
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.primaryEmail}
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
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.secondaryEmail}
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
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.primaryPhoneNumber}
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
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails?.secondaryContact2?.secondaryPhoneNumber}
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
        style={{ width: '100%' }}
        onChange={handleSecondaryContact2Change}
        value={leadFormData?.user?.contactDetails.secondaryContact2?.linkedinUrl}
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
      <Grid item md={12} xs={12} style={{ marginBottom: '2px'}}>
        <Divider />
      </Grid>
      <br/> 
      <Typography variant="h6">Company Information</Typography>
      <TextField
        name="companyName"
        label="Company Name"
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.companyName}
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
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.companyLinkedin}
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
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.companyWebsitecompanyWebsite}
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
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.relevantLink}
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
                value={leadFormData?.user?.countries}
                onChange={handleChange}
                name="country"
                fullWidth
                variant="outlined"
              >
           {Object.entries(countries).map(([key, val]) => (
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
                value={leadFormData?.user?.industryBusinessActivity}
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
                value={leadFormData?.user?.region}
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
              <InputLabel id="industrySub">Industry Sector</InputLabel>
              <Select
                id="industry_sector"
                value={leadFormData?.user?.industrySub}
                onChange={handleChange}
                name="industrySub"
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
              style={{ width: '100%' }}
              onChange={handleChange}
              value={leadFormData?.user?.companyEmployees}
              variant="outlined"
              fullWidth
              rows={2}
              size="small"
              inputProps={{
                'aria-label': 'number_of_employees',
              }}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>


          <Grid item md={6} xs={12}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="industrySubSector">Industry Sub Sector</InputLabel>
              <Select
                id="industrySubSector"
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

          <Grid item md={6} xs={12}>
            <TextField
              name="companyAnnualRevenue"
              label="Annual Revenue"
              style={{ width: '100%' }}
              onChange={handleChange}
              value={leadFormData?.user?.companyAnnualRevenue}
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              size="small"
              inputProps={{
                'aria-label': 'annual_revenue',
              }}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>

      </Grid>
      <br/>
      <br/>
      <Grid item md={12} xs={12} style={{ marginBottom: '2px'}}>
        <Divider />
      </Grid>
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
        style={{ width: '100%' }}
        onChange={handleChange}
        value={leadFormData?.user?.nextSteps}
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
          style={{ width: '100%' }}
          onChange={handleChange}
          value={leadFormData?.user?.leadOwner}
          variant="outlined"
          multiline
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
          selectedDate={leadFormData?.user?.firstContactDate}
          inputProps={{ 'data-testid': 'start_time_input' }}
          inputVariant="outlined"
        />
        </Grid>


        <Grid item md={6} xs={12}>
        <TextField
          name="createdBy"
          label="Created By"
          style={{ width: '100%' }}
          onChange={handleChange}
          value={leadFormData?.user?.createdBy}
          variant="outlined"
          multiline
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
          inputProps={{ 'data-testid': 'last_contact_date_input' }}
          handleDateChange={date => handleTimeInputChange({ target: { name: 'lastContactDate', value: date } })}
          selectedDate={leadFormData?.user?.lastContactDate}
          inputVariant="outlined"
        />
        </Grid>


        <Grid item md={6} xs={12}>
        <TextField
          name="modifiedBy"
          label="Modified By"
          style={{ width: '100%' }}
          onChange={handleChange}
          value={leadFormData?.user?.modifiedBy}
          variant="outlined"
          fullWidth
          multiline
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
