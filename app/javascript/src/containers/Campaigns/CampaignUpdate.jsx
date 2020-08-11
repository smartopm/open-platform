import React, { useState, useContext } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Redirect } from 'react-router-dom'
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@material-ui/core'
import { DateAndTimePickers } from '../../components/DatePickerDialog'
import { useMutation, useQuery } from 'react-apollo'
import { CampaignUpdate } from '../../graphql/mutations'
import { Campaign } from '../../graphql/queries'
import { DelimitorFormator as DelimiterFormatter } from '../../utils/helpers'
import { saniteError } from '../../utils/helpers'
import { Context as AuthStateContext } from '../Provider/AuthStateProvider.js'
import Loading from '../../components/Loading'
import { dateTimeToString, dateToString } from '../../components/DateContainer'
import CampaignLabels from '../../components/CampaignLabels.jsx'
import Nav from '../../components/Nav'
import ErrorPage from '../../components/Error'

export default function UpdateCampaign({ match }) {
  const authState = useContext(AuthStateContext)
  const [label, setLabel] = useState([])
  const { data, error, loading } = useQuery(Campaign, {
    variables: { id: match.params.id }
  })
  const [campaign] = useMutation(CampaignUpdate)

  // TODO: @Dennis, populate the the autocorrect with labels 
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    message: '',
    batchTime: '',
    userIdList: '',
    loaded: false,
    labels: []

  })
  const [batchTime, setBatchTime] = useState(new Date().toISOString())
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (authState.user.userType !== 'admin') {
    return <Redirect push to="/" />
  }
  if (loading) return <Loading />
  if (error) return <ErrorPage />

  if (!formData.loaded && data) {
    setFormData({ ...data.campaign, loaded: true })
  }

  function handleInputChange(e) {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  function handleSubmit(e) {
    e.preventDefault()

    setTimeout(() => {
      window.location.reload(false)
    }, 3000)
   
 
    const campaignData = {
      id: formData.id,
      name: formData.name,
      message: formData.message,
      batchTime: batchTime,
      userIdList: formData.userIdList,
      labels: label.toString()
    }

    campaign({ variables: campaignData })
      .then(() => {
        setIsSubmitted(true)
      })
      .catch(err => {
        setErrorMsg(err.message)
      })
  }

  function handleLabelSelect(lastLabel) {
    const { id } = lastLabel
    setLabel([...label, id])
  }

  function handleUserIDList(_event, value) {
    let userIds = DelimiterFormatter(value)
    setFormData({
      ...formData,
      userIdList: userIds.toString()
    })
  }
  return (
    <>
      <Nav navName="Campaign Update" menuButton="back" backTo="/campaigns" />
      <div className="container">
        <form
          onSubmit={e => {
            handleSubmit(e)
          }}
        >
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="firstName">
              Campaign Name
            </label>
            <input
              className="form-control"
              type="text"
              onChange={handleInputChange}
              value={formData.name}
              name="name"
              required
            />
          </div>
          <div className="form-group">
            <TextField
              label="Message"
              name="message"
              rows={5}
              multiline
              required
              className="form-control"
              value={formData.message}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <TextField
              label="User ID List"
              rows={5}
              multiline
              required
              className="form-control"
              value={formData.userIdList}
              onChange={e => handleUserIDList(e, e.target.value)}
            />
          </div>
          <div>
            <br />
            <br />
            <div className=" row d-flex justify-content-start align-items-center">
              {formData.labels.length
                ? formData.labels.map(label => (
                  <Chip
                    data-testid="campaignChip-label"
                    key={label.id}
                    size="medium"
                    label={label.shortDesc}
                  />
                )) : null
              }
            </div>
            <CampaignLabels handleLabelSelect={handleLabelSelect} />
          </div>
          <br />
          <div style={{ paddingBottom: '3%' }}>
            <DateAndTimePickers
              label="Batch Time"
              required
              selectedDateTime={batchTime}
              handleDateChange={setBatchTime}
            />
          </div>
          <div>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Batch&nbsp;Date</TableCell>
                    <TableCell align="left">Batch&nbsp;Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">
                      {dateToString(formData.batchTime)}
                    </TableCell>
                    <TableCell align="left">
                      {dateTimeToString(new Date(formData.batchTime))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div className="d-flex row justify-content-center">
            <Button
              variant="contained"
              type="submit"
              className={`btn ${css(styles.getStartedButton)} enz-lg-btn`}
            >
              <span>Update</span>
            </Button>
          </div>
          <br />
          <div className="d-flex row justify-content-center">
            {Boolean(errorMsg) && (
              <p className="text-danger text-center">{saniteError(errorMsg)}</p>
            )}
            {isSubmitted && <p>Campaign has been submitted</p>}
          </div>
        </form>
      </div>
    </>
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
  },
  access: {
    color: '#1f2026',
    fontSize: 14,
    letterSpacing: 0.17,
    fontWeight: 400
  }
})
