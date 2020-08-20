import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Redirect } from 'react-router-dom'
import { Button, TextField, Chip } from '@material-ui/core'
import { DateAndTimePickers } from './DatePickerDialog'
import { useMutation } from 'react-apollo'
import { CampaignCreate, CampaignUpdateMutation } from '../graphql/mutations'
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
export default function CampaignForm({ authState, data, loading }) {
  const [label, setLabel] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [batchTime, setBatchTime] = useState(new Date())
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [campaignCreate] = useMutation(CampaignCreate)
  const [campaignUpdate] = useMutation(CampaignUpdateMutation)
  const { id } = useParams() // will only exist on campaign update

  const [formData, setFormData] = useState(initData)

  async function createCampaignOnSubmit(data) {
    try {
      await campaignCreate({ variables: data })
      setIsSubmitted(true)
      setFormData(initData)
    }
    catch (err) {
      setErrorMsg(err.message)
    }
  }

  async function campaignUpdateOnSubmit(data) {
    try {
      await campaignUpdate({ variables: data })
      setIsSubmitted(true)
    }
    catch (err) {
      setErrorMsg(err.message)
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

  if (authState.user.userType !== 'admin') {
    return <Redirect push to="/" />
  }
  if (!loading && !formData.loaded && data) {
    setFormData({ ...data, loaded: true, }) 
  }

  return (
    <div className="container">
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
              {Boolean(formData.labels.length) && formData.labels.map((labl, i) => (
                  <Chip
                    data-testid="campaignChip-label"
                    key={i}
                    size="medium"
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
          {isSubmitted && <p>Campaign has been {id ? 'updated' : 'created'}</p>}
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
