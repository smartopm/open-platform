/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react'
import { useMutation } from 'react-apollo'
import { StyleSheet, css } from 'aphrodite'
import { Button, TextField, MenuItem } from '@material-ui/core'
import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import { entryReason } from '../../utils/constants'
import { EntryRequestCreate } from '../../graphql/mutations'
import { ReasonInputModal } from '../Dialog'
import { Footer } from '../Footer'
import DatePickerDialog, { ThemedTimePicker } from '../DatePickerDialog'

export default function RequestForm({ path }) {
  const history = useHistory()
  const name = useFormInput('')
  const nrc = useFormInput('')
  const phoneNumber = useFormInput('')
  const vehicle = useFormInput('')
  const business = useFormInput('')
  const reason = useFormInput('')
  const [createEntryRequest] = useMutation(EntryRequestCreate)
  const [isSubmitted, setSubmitted] = useState(false)
  const [isModalOpen, setModal] = useState(false)
  const [visitationDate, setVisitDate] = useState(null)
  const [startTime, setVisitTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())

  function handleSubmit() {
    setSubmitted(!isSubmitted)
    const userData = {
      name: name.value,
      vehiclePlate: vehicle.value,
      phoneNumber: phoneNumber.value,
      nrc: nrc.value,
      reason: business.value === 'Other' ? reason.value : business.value,
      visitationDate,
      startTime,
      endTime
    }

    createEntryRequest({ variables: userData }).then(({ data }) => {
      // Send them to the wait page if it is an entry request
      if(path.includes('entry_request')){
        history.push(`/request/${data.result.entryRequest.id}`, {
          from: 'entry_request'
        })
      }
      history.push('/entry_logs')
    })
  }

  useEffect(() => {
    if (business.value === 'Other') {
      setModal(!isModalOpen)
    }
   /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [business.value])

  return (
    <>
      <ReasonInputModal
        handleClose={() => setModal(!isModalOpen)}
        open={isModalOpen}
      >
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            {...reason}
            name="reason"
            placeholder="Other"
            required
          />
        </div>
      </ReasonInputModal>
      <div className="container">
        <form>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              NAME
            </label>
            <input
              className="form-control"
              type="text"
              {...name}
              name="_name"
              required
              autoCapitalize="words"
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="phoneNumber">
              Phone N&#176;
            </label>
            <input
              className="form-control"
              {...phoneNumber}
              name="phoneNumber"
              type="number"
            />
           
          </div>
          {path.includes('entry_request') && (
            <>
              <div className="form-group">
                <label className="bmd-label-static" htmlFor="nrc">
                  NRC
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...nrc}
                  name="nrc"
                  required
                />
                
              </div>
              <div className="form-group">
                <label className="bmd-label-static" htmlFor="vehicle">
                  VEHICLE PLATE N&#176;
                </label>
                <input
                  className="form-control"
                  type="text"
                  {...vehicle}
                  name="vehicle"
                />
                
              </div>
            </>
          )}
          <div className="form-group">
            <TextField
              id="reason"
              select
              label="Reason for visit"
              name="reason"
              {...business}
              className={`${css(styles.selectInput)}`}
            >
              {entryReason.map(_reason => (
                <MenuItem key={_reason} value={_reason}>
                  {_reason}
                </MenuItem>
              ))}
            </TextField>
          </div>
          {path.includes('visit_request') && (
            <>
              <DatePickerDialog
                selectedDate={visitationDate}
                handleDateChange={date => setVisitDate(date)}
                label="Date of Visit"
              />
              <ThemedTimePicker
                time={startTime}
                handleTimeChange={date => setVisitTime(date)}
                label="Start Time"
              />
              <span style={{ marginLeft: 20 }}>
                <ThemedTimePicker
                  time={endTime}
                  handleTimeChange={date => setEndTime(date)}
                  label="End Time"
                />
              </span>
            </>
          )}
          <br />

          <div className="row justify-content-center align-items-center ">
            <Button
              variant="contained"
              className={`btn ${css(styles.logButton)}`}
              onClick={handleSubmit}
              disabled={isSubmitted}
            >
              {isSubmitted ? 'Submitting ...' : ' Submit'}
            </Button>
          </div>
        </form>
        <Footer position="5vh" />
      </div>
    </>
  )
}
// Todo: refactor the above form to just use one state object
function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue)
  const handleChange = event => {
    setValue(event.target.value)
  }
  return { value, onChange: handleChange }
}

RequestForm.propTypes = {
  path: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  logButton: {
    backgroundColor: '#69ABA4',
    color: '#FFF',
    width: '75%',
    boxShadow: 'none',
    marginTop: 60,
    height: 50
  },
  selectInput: {
    width: '100%'
  },
  signatureContainer: {
    width: '100%',
    height: '80%',
    margin: '0 auto',
    backgroundColor: '#FFFFFF'
  },
  signaturePad: {
    width: '100%',
    height: '100%'
  }
})
