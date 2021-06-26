/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react'
import { useMutation } from 'react-apollo'
import { StyleSheet, css } from 'aphrodite'
import { useTranslation } from 'react-i18next'
import { Button, TextField, MenuItem } from '@material-ui/core'
import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import { EntryRequestCreate } from '../../../graphql/mutations'
import { ReasonInputModal } from '../../../components/Dialog'
import { Footer } from '../../../components/Footer'
import DatePickerDialog, { ThemedTimePicker } from '../../../components/DatePickerDialog'
import { businessReasons, defaultBusinessReasons } from '../../../utils/constants'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'

export default function RequestForm({ path }) {
  const initialState = {
    name: '',
    nrc: '',
    phoneNumber: '',
    vehiclePlate: '',
    companyName: '',
    business: '',
    reason: '',
    visitationDate: null,
    startTime: new Date(),
    endTime: new Date(),
  }

  const history = useHistory()
  const authState = useContext(AuthStateContext)
  const [userData, setUserData] = useState(initialState)
  const [createEntryRequest] = useMutation(EntryRequestCreate)
  const [isModalOpen, setModal] = useState(false)
  const [inputValidationMsg, setInputValidationMsg] = useState({ isError: false, isSubmitting: false })
  const { t } = useTranslation(['common', 'logbook'])

  const defaultRequiredFields= ['name', 'phoneNumber', 'nrc', 'vehiclePlate', 'reason', 'business']
  const requiredFields = authState?.user?.community?.communityRequiredFields?.manualEntryRequestForm || defaultRequiredFields
  function checkInValidRequiredFields(formData){
    const values = requiredFields.map(field => formData[String(field)])

    function isNotValid(element){
      return !element
    }

    return (values.some(isNotValid))
  }

  function handleSubmit() {
    const variables = {
      ...userData,
      otherReason: userData.business === 'other' ? userData.reason : '',
      reason: userData.business
    }

    const isAnyInvalid = checkInValidRequiredFields(variables)
    if(isAnyInvalid){
      setInputValidationMsg({ isError: true })
      return
    }

    setInputValidationMsg({ isSubmitting: true })
    
    delete variables.business
    createEntryRequest({ variables }).then(({ data }) => {
      // Send them to the wait page if it is an entry request
      if(path.includes('entry_request')){
        history.push(`/request/${data.result.entryRequest.id}`, {
          from: 'entry_request'
        })
      } else {
        history.push('/entry_logs')
      }
    })
  }

  function handleChange(event){
    const { name, value } = event.target;
    const fields = { ...userData }
    fields[String(name)] = value
    setUserData(fields)
  }

  function handleAddOtherReason(){
    if (!userData.reason) {
      setInputValidationMsg({ isError: true })
      return
    }
    setModal(!isModalOpen)
  }

  useEffect(() => {
    if (userData.business === 'other') {
      setModal(!isModalOpen)
    }
   /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [userData.business])

  return (
    <>
      <ReasonInputModal
        handleAddReason={handleAddOtherReason}
        handleClose={() => setModal(!isModalOpen)}
        open={isModalOpen}
      >
        <div className="form-group">
          <TextField
            className="form-control"
            type="text"
            name="reason"
            value={userData.reason}
            onChange={handleChange}
            placeholder="Other"
            error={inputValidationMsg.isError &&
              requiredFields.includes('reason') && 
              userData.business === 'other' &&
              !userData.reason}
            helperText={inputValidationMsg.isError &&
              requiredFields.includes('reason') &&
              userData.business === 'other' &&
              !userData.reason &&
              'Other Reason is Required'}
          />
        </div>
      </ReasonInputModal>
      <div className="container">
        <form>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="name">
              {t('form_fields.full_name')}
            </label>
            <TextField
              className="form-control"
              name="name"
              value={userData.name}
              onChange={handleChange}
              autoCapitalize="words"
              inputProps={{ 'data-testid': 'name' }}
              error={inputValidationMsg.isError && requiredFields.includes('name') && !userData.name}
              helperText={inputValidationMsg.isError &&
                requiredFields.includes('name') &&
                !userData.name &&
                'Name is Required'}
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="phoneNumber">
              {t('form_fields.phone_number')}
            </label>

            <TextField
              className="form-control"
              name="phoneNumber"
              value={userData.phoneNumber}
              onChange={handleChange}
              type="number"
              inputProps={{ 'data-testid': 'phone_number' }}
              error={inputValidationMsg.isError &&
                requiredFields.includes('phoneNumber') &&
                !userData.phoneNumber}
              helperText={inputValidationMsg.isError &&
                requiredFields.includes('phoneNumber') &&
                !userData.phoneNumber &&
                'Phone Number is Required'}
            />

          </div>
          {path.includes('entry_request') && (
            <>
              <div className="form-group">
                <label className="bmd-label-static" htmlFor="nrc">
                  {t('form_fields.nrc')}
                </label>
                <TextField
                  className="form-control"
                  name="nrc"
                  value={userData.nrc}
                  onChange={handleChange}
                  inputProps={{ 'data-testid': 'nrc' }}
                  error={inputValidationMsg.isError &&
                    requiredFields.includes('nrc') &&
                    !userData.nrc}
                  helperText={inputValidationMsg.isError &&
                    requiredFields.includes('nrc') &&
                    !userData.nrc &&
                    'ID is Required'}
                />
              </div>
              <div className="form-group">
                <label className="bmd-label-static" htmlFor="vehiclePlate">
                  {t('form_fields.vehicle_plate_number')}
                </label>
                <TextField
                  className="form-control"
                  type="text"
                  name="vehiclePlate"
                  value={userData.vehiclePlate}
                  onChange={handleChange}
                  inputProps={{ 'data-testid': 'vehicle' }}
                  error={inputValidationMsg.isError &&
                    requiredFields.includes('vehiclePlate') &&
                    !userData.vehiclePlate}
                  helperText={inputValidationMsg.isError &&
                    requiredFields.includes('vehiclePlate') &&
                    !userData.vehiclePlate &&
                    'Vehicle Plate Number is Required'}
                />
              </div>
              <div className="form-group">
                <label className="bmd-label-static" htmlFor="companyName">
                  {t('form_fields.company_name')}
                </label>
                <TextField
                  className="form-control"
                  type="text"
                  name="companyName"
                  value={userData.companyName}
                  onChange={handleChange}
                  inputProps={{ 'data-testid': 'companyName' }}
                  error={inputValidationMsg.isError &&
                    requiredFields.includes('companyName') &&
                    !userData.companyName}
                  helperText={inputValidationMsg.isError &&
                    requiredFields.includes('companyName') &&
                    !userData.companyName &&
                    'Company Name is Required'}
                />
              </div>
            </>
          )}
          <div className="form-group">
            <TextField
              id="reason"
              select
              label={t('logbook:logbook.visiting_reason')}
              name="business"
              value={userData.business}
              onChange={handleChange}
              className={`${css(styles.selectInput)}`}
              error={inputValidationMsg.isError &&
                requiredFields.includes('business') &&
                (!userData.business) || (userData.business === 'other' &&
                !userData.reason)}
              helperText={inputValidationMsg.isError &&
                requiredFields.includes('business') &&
                !userData.business &&
                'Reason is Required'}
                // eslint-disable-next-line react/jsx-no-duplicate-props
              helperText={inputValidationMsg.isError &&
                requiredFields.includes('business') &&
                userData.business === 'other' &&
                !userData.reason &&
                'Other Reason is Required'}
            >
              {businessReasons.map(_reason => (
                <MenuItem key={_reason} value={_reason}>
                  {t(`logbook:business_reasons.${_reason}`) || defaultBusinessReasons[String(_reason)]}
                </MenuItem>
              ))}
            </TextField>
          </div>
          {path.includes('visit_request') && (
            <>
              <DatePickerDialog
                selectedDate={userData.visitationDate}
                handleDateChange={date => handleChange({ target: { name: 'visitationDate', value: date }})}
                label={t('logbook:logbook.date_of_visit')}
              />
              <ThemedTimePicker
                time={userData.startTime}
                handleTimeChange={date => handleChange({ target: { name: 'startTime', value: date }})}
                label={t('misc.start_time')}
              />
              <span style={{ marginLeft: 20 }}>
                <ThemedTimePicker
                  time={userData.endTime}
                  handleTimeChange={date => handleChange({ target: { name: 'endTime', value: date }})}
                  label={t('misc.end_time')}
                />
              </span>
            </>
          )}
          <br />

          <div className="row justify-content-center align-items-center ">
            <Button
              variant="contained"
              className={`${css(styles.logButton)}`}
              onClick={handleSubmit}
              disabled={inputValidationMsg.isSubmitting}
              color="primary"
              data-testid="submit_button"
            >
              {inputValidationMsg.isSubmitting ? ` ${t('form_actions.submitting')} ...` : ` ${t('form_actions.submit')} `}
            </Button>
          </div>
        </form>
        <Footer position="5vh" />
      </div>
    </>
  )
}

RequestForm.propTypes = {
  path: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  logButton: {
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
