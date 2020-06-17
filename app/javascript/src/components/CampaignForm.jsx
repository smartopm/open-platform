import React, { useState } from 'react'
import { StyleSheet, css } from 'aphrodite'
import { Redirect } from 'react-router-dom'
import { Button, TextField } from '@material-ui/core'
import { DateAndTimePickers } from './DatePickerDialog'
import { useMutation } from 'react-apollo'
import { CampaignCreate } from '../graphql/mutations'
import { DelimitorFormator } from '../utils/helpers'

export default function CampaignForm({ authState }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [userIdList, setUserIdList] = useState('')
  const [batchTime, setBatchTime] = useState('')
  const [campaign] = useMutation(CampaignCreate)

  function handleSubmit(e) {
    e.preventDefault()
    const campaingData={
      name: name,
      message: message,
      batchTime: batchTime,
      userIdList: userIdList
    }
    campaign({ variables:campaingData }).then(e => {
      console.log(e)
    })
  }

  function handleUserIDList(_event, value) {
    let userIds = DelimitorFormator(value)

    console.log(userIds.toString())
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
            className="form-control"
            value={userIdList}
            onChange={e => handleUserIDList(e, e.target.value)}
          />
        </div>
        <br />
        <div>
          <DateAndTimePickers
            label="Start Time"
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
