import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Redirect } from 'react-router-dom'
import { Button, TextField } from '@material-ui/core'
import { DateAndTimePickers } from './DatePickerDialog'
import { useMutation,useQuery } from 'react-apollo'
import { CampaignCreate } from '../graphql/mutations'
import { DelimitorFormator } from '../utils/helpers'
import { saniteError } from '../utils/helpers'

export default function CampaignForm({authState }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [userIdList, setUserIdList] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [batchTime, setBatchTime] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [campaign] = useMutation(CampaignCreate)

  function handleSubmit(e) {
    e.preventDefault()
    const campaingData = {
      name,
      message,
      batchTime,
      userIdList
    }
    setTimeout(() => {
      window.location.reload(false)
    }, 3000)

    campaign({ variables: campaingData })
      .then(e => {
        setIsSubmitted(true)
      })
      .catch(err => {
        setErrorMsg(err.message)
      })
  }

  function handleUserIDList(_event, value) {
    let userIds = DelimitorFormator(value)
    setUserIdList(userIds.toString())
  }
  if (authState.user.userType !== 'admin') {
    return <Redirect push to="/" />
  }
  
  return (
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
            onChange={e => setName(e.target.value)}
            value={name}
            name="name"
            required
          />
        </div>
        <div className="form-group">
          <label className="bmd-label-static" htmlFor="firstName">
            Message
          </label>
          <input
            className="form-control"
            type="text"
            onChange={e => setMessage(e.target.value)}
            value={message}
            name="name"
            required
          />
        </div>
        <div>
          <TextField
            label="User ID List"
            rows={5}
            multiline
            required
            className="form-control"
            value={userIdList}
            onChange={e => handleUserIDList(e, e.target.value)}
          />
        </div>
        <br />
        <div>
          <DateAndTimePickers
            label="Start Time"
            required
            selectedDateTime={batchTime}
            handleDateChange={e => setBatchTime(e.target.value)}
          />
        </div>
        <div className="d-flex row justify-content-center">
          <Button
            variant="contained"
            type="submit"
            className={`btn ${css(styles.getStartedButton)} enz-lg-btn`}
          >
            <span>Submit</span>
          </Button>
        </div>
        <br />
        <div className="d-flex row justify-content-center">
          {Boolean(errorMsg.length) && (
            <p className="text-danger text-center">{saniteError(errorMsg)}</p>
          )}
          {isSubmitted && <p>Campaign has been submitted</p>}
        </div>
      </form>
    </div>
  )
}
const styles = StyleSheet.create({
  getStartedButton: {
    backgroundColor: '#25c0b0',
    color: '#FFF',
    width: '30%',
    height: 51,
    boxShadow: 'none',
    marginTop: 50,
    alignItems: 'center'
  }
})
