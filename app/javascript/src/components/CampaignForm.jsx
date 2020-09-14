/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Redirect, useParams } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import { Button, TextField, Chip, Snackbar, MenuItem } from '@material-ui/core'
import { DateAndTimePickers } from './DatePickerDialog'
import { 
    CampaignCreate, 
    CampaignUpdateMutation, 
    CampaignLabelRemoveMutation, 
    CampaignDraftCreate 
  } from '../graphql/mutations'
import { saniteError, getJustLabels, delimitorFormator } from '../utils/helpers'
import CampaignLabels from './CampaignLabels'

const initData = {
  id: '',
  name: '',
  campaignType: 'sms',
  status: 'draft',
  message: '',
  batchTime: '',
  userIdList: '',
  subject: '',
  preHeader: '',
  templateStyle: '',
  loaded: false,
  labels: []
}
export default function CampaignForm({ authState, data, loading, refetch, campaignCreateType }) {
  const [label, setLabel] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [mutationLoading, setLoading] = useState(false)
  const [campaignCreate] = useMutation(CampaignCreate)
  const [campaignDraftCreate] = useMutation(CampaignDraftCreate)
  const [campaignUpdate] = useMutation(CampaignUpdateMutation)
  const [campaignLabelRemove] = useMutation(CampaignLabelRemoveMutation)
  const { id } = useParams() // will only exist on campaign update
  const [formData, setFormData] = useState(initData)

  async function createCampaignOnSubmit(campData) {
    setLoading(true)
    try {
      if (campaignCreateType === "schedule") {
        await campaignCreate({ variables: campData })
      } else {
        await campaignDraftCreate({ variables: campData })
      }
      setIsSubmitted(true)
      setFormData(initData)
      setLoading(false)
    }
    catch (err) {
      setErrorMsg(err.message)
      setLoading(false)
    }
  }
  async function campaignUpdateOnSubmit(campData) {
    setLoading(true)
    try {
      await campaignUpdate({ variables: campData })
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
    // if creating a campaign don't spread
    const labels = id ? [...label, ...getJustLabels(formData.labels)] : label
    
    const campaignData = {
      id: formData.id,
      name: formData.name,
      campaignType: formData.campaignType,
      status: formData.status,
      message: formData.message,
      batchTime: formData.batchTime,
      userIdList: delimitorFormator(formData.userIdList).toString(),
      labels: labels.toString(),
      subject: formData.subject,
      preHeader: formData.preHeader,
      templateStyle: formData.templateStyle
    }
    if (id) {
      return campaignUpdateOnSubmit(campaignData)
    }
   return createCampaignOnSubmit(campaignData)
  }
  function handleLabelSelect(value) {
    setLabel([...getJustLabels(value)])
  }
  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  function handleDateChange(date) {
    setFormData({
      ...formData,
      batchTime: date
    })
  }
  function handleLabelDelete(labelId) {
    // need campaign id and labelId
    campaignLabelRemove({
      variables: { campaignId: id, labelId }
    })
      .then(() => refetch())
      .catch(err => setErrorMsg(err.message))
  }
  if (authState.user.userType !== 'admin') {
    return <Redirect push to="/" />
  }
  if (!loading && !formData.loaded && data) {
    setFormData({ ...data, loaded: true, }) 
  }
  return (
    <div className="container">
      <Snackbar
        open={isSubmitted}
        autoHideDuration={3000}
        onClose={() => setIsSubmitted(!isSubmitted)}
        color="primary"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={`Campaign ${id ? 'updated' : 'created'} sucessfully`}
      />
      <form onSubmit={handleSubmit} aria-label="campaign-form">
        <TextField
          label="Campaign Type"
          name="campaignType"
          required
          className="form-control"
          value={formData.campaignType}
          onChange={handleInputChange}
          aria-label="campaign_type"
          inputProps={{ 'data-testid': 'campaign_type' }}
          select
        >
          <MenuItem value="sms">SMS</MenuItem>
          <MenuItem value="email">Email</MenuItem>
        </TextField>
        <TextField
          label="Campaign Name"
          name="name"
          required
          className="form-control"
          value={formData.name}
          onChange={handleInputChange}
          aria-label="campaign_name"
          inputProps={{ 'data-testid': 'campaign_name' }}
        />
        <TextField
          label="Message"
          name="message"
          rows={2}
          multiline
          required={campaignCreateType === "schedule"}
          className="form-control"
          value={formData.message || ''}
          onChange={handleInputChange}
          aria-label="campaign_message"
          inputProps={{ 'data-testid': 'campaign_message' }}
        />
        {formData.campaignType === 'email' && (
          <>
            <TextField
              label="Subject"
              name="subject"
              rows={1}
              multiline
              className="form-control"
              value={formData.subject || ''}
              onChange={handleInputChange}
              aria-label="campaign_subject"
              inputProps={{ 'data-testid': 'campaign_subject' }}
            />
            <TextField
              label="Pre Header"
              name="preHeader"
              rows={1}
              multiline
              className="form-control"
              value={formData.preHeader || ''}
              onChange={handleInputChange}
              aria-label="campaign_pre_header"
              inputProps={{ 'data-testid': 'campaign_pre_header' }}
            />
            <TextField
              label="Template Style"
              rows={1}
              multiline
              className="form-control"
              aria-label="campaign_template_style"
              inputProps={{ 'data-testid': 'campaign_template_style' }}
              name="templateStyle"
              value={formData.templateStyle || ''}
              onChange={handleInputChange}
            />
          </>
        )}
        <TextField
          label="User ID List"
          rows={5}
          multiline
          required={campaignCreateType === "schedule"}
          className="form-control"
          aria-label="campaign_ids"
          inputProps={{ 'data-testid': 'campaign_ids' }}
          name="userIdList"
          value={formData.userIdList || ''}
          onChange={handleInputChange}
        />
        <br />
        <br />
        <div className=" row d-flex justify-content-start align-items-center">
          {label.map((labl, i) => (
            <Chip
              data-testid="campaignChip-label"
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              size="medium"
              label={labl?.shortDesc || labl}
            />
          ))}
          {Boolean(formData.labels.length) &&
            formData.labels.map(labl => (
              <Chip
                data-testid="campaignChip-label"
                key={labl.id}
                size="medium"
                onDelete={() => handleLabelDelete(labl.id)}
                label={labl.shortDesc}
              />
            ))}
        </div>
        <div>
          <CampaignLabels handleLabelSelect={handleLabelSelect} />
        </div>
        <br />
        <div>
          <DateAndTimePickers
            label="Batch Time"
            required={campaignCreateType === "schedule"}
            selectedDateTime={formData.batchTime}
            handleDateChange={handleDateChange}
          />
        </div>
        <div className="d-flex row justify-content-center">
          <Button
            variant="contained"
            type="submit"
            disabled={mutationLoading}
            aria-label="campaign_submit"
            className={`btn ${css(styles.getStartedButton)} enz-lg-btn`}
          >
            <span>{id ? 'Update Campaign' : 'Create Campaign'}</span>
          </Button>
        </div>
        <br />
        <div className="d-flex row justify-content-center">
          {Boolean(errorMsg.length) && (
            <p className="text-danger text-center">
              {saniteError([], errorMsg)}
            </p>
          )}
        </div>
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
