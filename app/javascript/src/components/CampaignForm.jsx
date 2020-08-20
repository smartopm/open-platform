import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Redirect } from 'react-router-dom'
import { Button, TextField, Chip, Snackbar } from '@material-ui/core'
import { DateAndTimePickers } from './DatePickerDialog'
import { useMutation } from 'react-apollo'
import { CampaignCreate, CampaignUpdateMutation, CampaignLabelRemoveMutation } from '../graphql/mutations'
import { delimitorFormator } from '../utils/helpers'
import { saniteError } from '../utils/helpers'
import CampaignLabels from './CampaignLabels.jsx'
import { getJustLabels } from '../containers/Campaigns/CampaignUpdate'
import { useParams } from 'react-router-dom'

const initData = {
  id: '',
  name: '',
  message: '',
  batchTime: '',
  userIdList: '',
  loaded: false,
  labels: []
}
export default function CampaignForm({ authState, data, loading, refetch }) {
  const [label, setLabel] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [batchTime, setBatchTime] = useState(new Date())
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [mutationLoading, setLoading] = useState(false)
  const [campaignCreate] = useMutation(CampaignCreate)
  const [campaignUpdate] = useMutation(CampaignUpdateMutation)
  const [campaignLabelRemove] = useMutation(CampaignLabelRemoveMutation)
  const { id } = useParams() // will only exist on campaign update

  const [formData, setFormData] = useState(initData)

  async function createCampaignOnSubmit(data) {
    setLoading(true)
    try {
      await campaignCreate({ variables: data })
      setIsSubmitted(true)
      setFormData(initData)
      setLoading(false)
    }
    catch (err) {
      setErrorMsg(err.message)
      setLoading(false)
    }
  }

  async function campaignUpdateOnSubmit(data) {
    setLoading(true)
    try {
      await campaignUpdate({ variables: data })
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
      message: formData.message,
      batchTime,
      userIdList: delimitorFormator(formData.userIdList).toString(),
      labels: labels.toString()
    }
    if (id) {
      return campaignUpdateOnSubmit(campaignData)
    }
   return createCampaignOnSubmit(campaignData)
  }

  function handleLabelSelect(label) {
    setLabel([...getJustLabels(label)])
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
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
          open={isSubmitted} autoHideDuration={3000}
          onClose={() => setIsSubmitted(!isSubmitted)}
          color="primary"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          message={`Campaign ${id ? 'updated' : 'created'} sucessfully`}
      />
      <form
        onSubmit={handleSubmit}
        aria-label="campaign-form"
      >
        <TextField
          label="Campaign Name"
          name="name"
          required
          className="form-control"
          value={formData.name}
          onChange={handleInputChange}
          aria-label="campaign_name"
          inputProps={{ "data-testid": "campaign_name" }}
          />
        <TextField
          label="Message"
          name="message"
          rows={2}
          multiline
          required
          className="form-control"
          value={formData.message || ''}
          onChange={handleInputChange}
          aria-label="campaign_message"
          inputProps={{ "data-testid": "campaign_message" }}
          />
          <TextField
            label="User ID List"
            rows={5}
            multiline
            required
            className="form-control"
            aria-label="campaign_ids"
            inputProps={{ "data-testid": "campaign_ids" }}
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
                    key={i}
                    size="medium"
                    label={labl?.shortDesc || labl}
                  />
                ))
              }
              {Boolean(formData.labels.length) && formData.labels.map(labl => (
                  <Chip
                    data-testid="campaignChip-label"
                    key={labl.id}
                    size="medium"
                    onDelete={() => handleLabelDelete(labl.id)}
                    label={labl.shortDesc}
                  />
                ))
              }
            </div>

        <div >
          <CampaignLabels handleLabelSelect={handleLabelSelect} />
        </div>
        <br />
        <div>
          <DateAndTimePickers
            label="Batch Time"
            required
            selectedDateTime={batchTime}
            handleDateChange={setBatchTime}
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
            <p className="text-danger text-center">{saniteError([], errorMsg)}</p>
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
