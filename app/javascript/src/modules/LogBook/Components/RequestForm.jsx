/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react'
import { useMutation } from 'react-apollo'
import { StyleSheet, css } from 'aphrodite'
import { useTranslation } from 'react-i18next'
import { Button, TextField, MenuItem, IconButton , Avatar, Typography } from '@material-ui/core'
import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import { EntryRequestCreate } from '../../../graphql/mutations'
import { ReasonInputModal } from '../../../components/Dialog'
import { Footer } from '../../../components/Footer'
import DatePickerDialog, { ThemedTimePicker } from '../../../components/DatePickerDialog'
import { defaultBusinessReasons } from '../../../utils/constants'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'
import { checkInValidRequiredFields, defaultRequiredFields } from '../utils'
import { formatError, useParamsQuery } from '../../../utils/helpers'
import MessageAlert from '../../../components/MessageAlert'
import { Spinner } from '../../../shared/Loading'


// TODO: As of now this is only serving the visit_request, we can still migrate to reuse the 2 forms
// - RequestUpdate
// - RequestForm
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
    visitEndDate: null,
    startTime: new Date(),
    endTime: new Date(),
  }

  const history = useHistory()
  const authState = useContext(AuthStateContext)
  const [userData, setUserData] = useState(initialState)
  const [days, setDays] = useState([])
  const [createEntryRequest] = useMutation(EntryRequestCreate)
  const [isModalOpen, setModal] = useState(false)
  const [inputValidationMsg, setInputValidationMsg] = useState({ isError: false, isSubmitting: false })
  const { t } = useTranslation(['common', 'logbook'])
  const requestPath = useParamsQuery()
  const tabValue = requestPath.get('tab');
  const [message, setMessage] = useState({ isError: false, detail: ''});

  const requiredFields = authState?.user?.community?.communityRequiredFields?.manualEntryRequestForm || defaultRequiredFields

  function handleSubmit() {
    const variables = {
      ...userData,
      otherReason: userData.business === 'other' ? userData.reason : '',
      reason: userData.business,
      occursOn: days, 
    }

    const isAnyInvalid = checkInValidRequiredFields(variables, requiredFields)
    if(isAnyInvalid && !path.includes('visit_request')){
      setInputValidationMsg({ isError: true })
      return
    }
    if (days.length && !userData.visitEndDate) {
      setMessage({ isError: true, detail: t('logbook:logbook.visit_end_error') });
      return
    }

    setInputValidationMsg({ isSubmitting: true })

    delete variables.business
    createEntryRequest({ variables })
      .then(() => {
        history.push(`/entry_logs?tab=${tabValue}`)
      })
      .catch(err => {
        setInputValidationMsg({ isSubmitting: false })
        setMessage({ isError: true, detail: formatError(err.message) });
      })
  }

  function handleChange(event){
    const { name, value } = event.target;
    const fields = { ...userData }
    fields[String(name)] = value
    setUserData(fields)
  }

  function handleChangeOccurrence(day){
    if(days.includes(day)){
      const leftDays = days.filter(d => d !== day)
      setDays(leftDays)
      return
    }
    setDays([...days, day])
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
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />

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
              {Object.keys(defaultBusinessReasons).map(_reason => (
                <MenuItem key={_reason} value={_reason}>
                  {t(`logbook:business_reasons.${_reason}`) || defaultBusinessReasons[String(_reason)]}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <DatePickerDialog
            selectedDate={userData.visitationDate}
            handleDateChange={date => handleChange({ target: { name: 'visitationDate', value: date }})}
            label="Day of visit"
          /> 
         
          <div>
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
          </div>

          <br />
          <Typography gutterBottom>{t('logbook:guest_book.repeats_on')}</Typography>
          {Object.entries(t('logbook:days', { returnObjects: true })).map(([key, value]) => (
            <IconButton
              key={key}
              color="primary"
              aria-label="choose day of week"
              component="span"
              onClick={() => handleChangeOccurrence(key)}
              data-testid="week_days"
            >
              <Avatar style={{ backgroundColor: new Set(days).has(key) ? '#009CFF' : '#ADA7A7' }}>{value.charAt(0)}</Avatar>
            </IconButton>
          ))}
          {
              Boolean(days.length) && (
                <DatePickerDialog
                  selectedDate={userData.visitEndDate}
                  handleDateChange={date => handleChange({ target: { name: 'visitEndDate', value: date }})}
                  label={t('logbook:guest_book.repeats_until')}
                  disablePastDate
                /> 
              )
            }

          <div className="row justify-content-center align-items-center ">
            <Button
              variant="contained"
              className={`${css(styles.logButton)}`}
              onClick={handleSubmit}
              disabled={inputValidationMsg.isSubmitting}
              startIcon={inputValidationMsg.isSubmitting && <Spinner />}
              color="primary"
              data-testid="submit_button"
            >
              {inputValidationMsg.isSubmitting ? ` ${t('form_actions.submitting')} ...` : ` ${t('form_actions.invite_guest')} `}
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
    height: 50,
    color: "#FFFFFF"
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
