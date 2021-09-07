/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from 'react';
import { useMutation, useLazyQuery } from 'react-apollo';
import { TextField, MenuItem, Button , Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { useHistory} from 'react-router';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types'
import CallIcon from '@material-ui/icons/Call';
import { EntryRequestQuery } from '../../../graphql/queries';
import {
  EntryRequestGrant,
  EntryRequestDeny,
  CreateUserMutation,
  UpdateLogMutation,
  EntryRequestCreate
} from '../../../graphql/mutations';
import { Spinner } from "../../../shared/Loading";
import { isTimeValid, getWeekDay } from '../../../utils/dateutil';
import { userState, userType, communityVisitingHours, defaultBusinessReasons } from '../../../utils/constants'
import { ModalDialog, ReasonInputModal } from "../../../components/Dialog"
import { dateToString, dateTimeToString } from "../../../components/DateContainer";
import { Context } from '../../../containers/Provider/AuthStateProvider';
import EntryNoteDialog from '../../../shared/dialogs/EntryNoteDialog';
import CenteredContent from '../../../components/CenteredContent';
import AddObservationNoteMutation, { EntryRequestUpdateMutation } from '../graphql/logbook_mutations';
import MessageAlert from '../../../components/MessageAlert'
import { checkInValidRequiredFields, defaultRequiredFields } from '../utils';
import GuestTime from './GuestTime';

const initialState = {
    name: '',
    phoneNumber: '',
    nrc: '',
    vehiclePlate: '',
    reason: '',
    business: '',
    state: '',
    userType: '',
    expiresAt: '',
    email: '',
    companyName: '',
    temperature: '',
    loaded: false,
    occursOn: [],
    visitationDate: null,
    visitEndDate: null,
    startTime: new Date(),
    endTime: new Date(),
}
// TODO: move react router hooks out of this component to make it easy to test different functionalities
export default function RequestUpdate({ id, previousRoute, requestType, tabValue }) {
  const history = useHistory()
  const authState = useContext(Context)
  const isFromLogs = previousRoute === 'logs' ||  false
  const [loadRequest, { data }] = useLazyQuery(EntryRequestQuery, {
    variables: { id }
  });
  const [createEntryRequest] = useMutation(EntryRequestCreate)
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [denyEntry] = useMutation(EntryRequestDeny);
  const [updateRequest] = useMutation(EntryRequestUpdateMutation)
  const [createUser] = useMutation(CreateUserMutation)
  const [updateLog] = useMutation(UpdateLogMutation)
  const [addObservationNote] = useMutation(AddObservationNoteMutation)
  const [isLoading, setLoading] = useState(false)
  const [isModalOpen, setModal] = useState(false)
  const [modalAction, setModalAction] = useState('')
  const [date] = useState(new Date());
  const [isClicked, setIsClicked] = useState(false)
  const [isObservationOpen, setIsObservationOpen] = useState(false)
  const [observationNote, setObservationNote] = useState("")
  const [reqId, setRequestId] = useState(id)
  const [observationDetails, setDetails] = useState({ isError: false, message: '', loading: false })
  const [inputValidationMsg, setInputValidationMsg] = useState({ isError: false, isSubmitting: false })
  const [formData, setFormData] = useState(initialState);
  const requiredFields = authState?.user?.community?.communityRequiredFields?.manualEntryRequestForm || defaultRequiredFields
  const { t } = useTranslation(['common', 'logbook'])
  const [isReasonModalOpen, setReasonModal] = useState(false)
  

  useEffect(() => {
    if (id) {
      loadRequest({ variables: { id } })
    }
  }, [id, loadRequest])

  useEffect(() => {
    if (formData.reason === 'other') {
      setReasonModal(true)
    }
  }, [formData.reason, id])


  // Data is loaded, so set the initialState, but only once
  if (!formData.loaded && data && id) {
    setFormData({ ...data.result, loaded: true });
  }
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // if a different reason is picked then reset the other reason
    if (name === 'reason' && formData.business) {
      setFormData({ ...formData, business: '' })
    }
  }

  function handleChangeOccurrence(day){
    if(formData.occursOn.includes(day)){
      const leftDays = formData.occursOn.filter(d => d !== day)
      setFormData({
        ...formData,
        occursOn: leftDays
      });
      return
    }
    setFormData({
      ...formData,
      occursOn: [ ...formData.occursOn, day]
    });
  }

  function handleCreateRequest() {

    const otherFormData = {
      ...formData,
      // return reason if not other
      reason: formData.business || formData.reason,
      startTime: dateToString(formData.startTime, 'YYYY-MM-DD HH:mm'),
      endTime: dateToString(formData.endTime, 'YYYY-MM-DD HH:mm')
    }

      return createEntryRequest({ variables: otherFormData })
      // eslint-disable-next-line no-shadow
        .then(({ data }) => {
          setRequestId(data.result.entryRequest.id)
          if (requestType === 'guest') {
            history.push(`/entry_logs?tab=${tabValue}`)
          }
          return data.result.entryRequest.id
        })
        .catch(err => {
          setDetails({ ...observationDetails, isError: true, message: err.message });
        });
  }

  function handleUpdateRequest() {
    const otherFormData = {
      ...formData,
      reason: formData.business || formData.reason,
      startTime: dateToString(formData.startTime, 'YYYY-MM-DD HH:mm'),
      endTime: dateToString(formData.endTime, 'YYYY-MM-DD HH:mm')
    };

    if (!formData.visitationDate || (formData.occursOn.length && !formData.visitEndDate)) {
      setDetails({ ...observationDetails, isError: true, message: t('logbook:logbook.visit_end_error') });
      return
    }

    setLoading(true);
    updateRequest({ variables: { id, ...otherFormData } })
      .then(() => {
        setLoading(false);
        setDetails({ ...observationDetails, message: t('logbook:logbook.registered_guest_updated') });
        history.push(`/entry_logs?tab=${tabValue}`)
      })
      .catch(error => {
        setLoading(false);
        setDetails({ ...observationDetails, isError: true, message: error.message });
      });
  }

  function handleGrantRequest() {
    setLoading(true)
    setModal(false)
    handleCreateRequest()
      .then(requestId => grantEntry({ variables: { id: requestId } }))
      .then(() => {
        setDetails({ ...observationDetails, message: t('logbook:logbook.success_message', { action: t('logbook:logbook.granted') }) })
        setIsObservationOpen(true)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        setDetails({ ...observationDetails, isError: true, message: error.message })
      });
  }

  function handleDenyRequest() {
    const isAnyInvalid = checkInValidRequiredFields(formData, requiredFields)
    if(isAnyInvalid){
      setInputValidationMsg({ isError: true })
      return
    }
    setIsClicked(!isClicked)
    setLoading(true)
    handleCreateRequest()
      .then(requestId => denyEntry({ variables: { id: requestId } }))
      .then(() => {
        setDetails({ ...observationDetails, message: t('logbook:logbook.success_message', { action: t('logbook:logbook.denied')}) })
        setIsObservationOpen(true)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        setDetails({ ...observationDetails, isError: true, message: error.message })
      });
  }

  function handleEnrollUser() {
    setLoading(true)
    createUser({
      variables: {
        name: formData.name,
        state: formData.state,
        userType: formData.userType,
        email: formData.email,
        reason: formData.reason,
        phoneNumber: formData.phoneNumber,
        nrc: formData.nrc,
        vehicle: formData.vehiclePlate
      }
    })
      .then((response) => {
        updateLog({
          variables: {
            refId: id
          }
        }).then(() => {
          setLoading(false)
          setDetails({ ...observationDetails, message: t('logbook:logbook.user_enrolled') })
          history.push(`/user/${response.data.result.user.id}`)
        })
      })
      .catch((err) => {
        setLoading(false)
        setDetails({ ...observationDetails, isError: true, message: err.message })
      })
  }

  function handleModal(_event, type) {
    const isAnyInvalid = checkInValidRequiredFields(formData, requiredFields)
    if(isAnyInvalid){
      setInputValidationMsg({ isError: true })
      return
    }
    switch (type) {
      case 'grant':
        setModalAction('grant')
        setModal(!isModalOpen)
        break;
      case 'deny':
        setModalAction('deny')
        setModal(!isModalOpen)
        break;
      case 'update':
        handleUpdateRequest()
        break;
      default:
        break;
    }
  }

  function resetForm(to){
    setFormData(initialState)
    setObservationNote("")
    setRequestId("")
    setIsObservationOpen(false)
    setModal(false)
    history.push(to)
  }

  function handleSaveObservation(to){
    // we are skipping the observation notes
    if(!observationNote) {
      resetForm(to)
      return
    }
    setDetails({ ...observationDetails, loading: true })
    addObservationNote({ variables: { id: reqId, note: observationNote, refType: 'Logs::EntryRequest'} })
      .then(() => {
        setDetails({ ...observationDetails, loading: false, isError: false, message: t('logbook:observations.created_observation') })
        resetForm(to)
      })
      .catch(error => {
        setDetails({ ...observationDetails, loading: false, isError: true, message: error.message })
      })
  }
  function checkTimeIsValid(){
    const communityName = authState.user.community.name
    const visitingHours = communityVisitingHours[String(communityName.toLowerCase())];

    return isTimeValid({ date, visitingHours })
  }

  function handleAddOtherReason(){
    if (!formData.business) {
      setInputValidationMsg({ isError: true })
      return
    }
    setReasonModal(!isReasonModalOpen)
  }

  const observationAction = observationNote ? 'Save' : 'Skip'
  return (
    <>
      <ReasonInputModal
        handleAddReason={handleAddOtherReason}
        handleClose={() => setReasonModal(!isReasonModalOpen)}
        open={isReasonModalOpen}
      >
        <div className="form-group">
          <TextField
            className="form-control"
            type="text"
            name="business"
            value={formData.business}
            onChange={event => setFormData({ ...formData, business: event.target.value })}
            placeholder={t('logbook:logbook.other_reason')}
          />
        </div>
      </ReasonInputModal>

      <MessageAlert
        type={!observationDetails.isError ? 'success' : 'error'}
        message={observationDetails.message}
        open={!!observationDetails.message}
        handleClose={() => setDetails({ ...observationDetails, message: '' })}
      />
      <ModalDialog
        handleClose={handleModal}
        handleConfirm={handleGrantRequest}
        open={isModalOpen}
        action={t(`logbook:access_actions.${modalAction}`)}
        name={formData.name}
      >
        {modalAction === 'grant' && !checkTimeIsValid() && (
          <div>
            <p>
              {t('logbook:logbook.today_is', {
                day: getWeekDay(date),
                time: dateTimeToString(date)
              })}
            </p>
            <p>{t('logbook:logbook.beyond_time')}</p>
          </div>
        )}
      </ModalDialog>

      {/* Observation note goes here */}
      <EntryNoteDialog
        open={isObservationOpen}
        handleDialogStatus={() => setIsObservationOpen(!isObservationOpen)}
        observationHandler={{
          value: observationNote,
          handleChange: value => setObservationNote(value)
        }}
      >
        {observationDetails.loading ? (
          <Spinner />
        ) : (
          <CenteredContent>
            <Button
              onClick={() => handleSaveObservation('/scan')}
              variant="outlined"
              className={css(styles.observationButton)}
              color="primary"
              fullWidth
            >
              {t('logbook:observations.skip_scan_next_entry', { action: observationAction })}
            </Button>
            <Button
              onClick={() => handleSaveObservation('/request')}
              variant="outlined"
              className={css(styles.observationButton)}
              color="primary"
              fullWidth
            >
              {t('logbook:observations.skip_record_manual_entry', { action: observationAction })}
            </Button>
            <Button
              onClick={() => history.push('/')}
              variant="contained"
              className={css(styles.observationButton)}
              color="primary"
              fullWidth
            >
              {t('logbook:observations.close_go_dashboard')}
            </Button>
          </CenteredContent>
        )}
      </EntryNoteDialog>

      <div className="container">
        <form>
          {isFromLogs && (
            <div className="form-group">
              <label className="bmd-label-static" htmlFor="date" data-testid="submitted_date">
                {t('logbook:logbook.date_time_submitted')}
              </label>
              <TextField
                className="form-control"
                type="text"
                value={
                  formData.guard
                    ? `${dateToString(formData.createdAt)} at ${dateTimeToString(
                        formData.createdAt
                      )}`
                    : ''
                }
                disabled
                name="date"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              {t('logbook:log_title.guard')}
            </label>
            <TextField
              className="form-control"
              type="text"
              value={formData.guard?.name || authState.user.name}
              disabled
              name="name"
              required
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              {t('form_fields.full_name')}
            </label>
            <TextField
              className="form-control"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              name="name"
              inputProps={{ 'data-testid': 'entry_user_name' }}
              error={inputValidationMsg.isError && requiredFields.includes('name') && !formData.name}
              helperText={inputValidationMsg.isError &&
                requiredFields.includes('name') &&
                !formData.name &&
                'Name is Required'}
            />
          </div>

          <div className="form-group">
            <label className="bmd-label-static" htmlFor="nrc">
              {t('form_fields.nrc')}
            </label>
            <TextField
              className="form-control"
              type="text"
              value={formData.nrc || ''}
              onChange={handleInputChange}
              name="nrc"
              inputProps={{ 'data-testid': 'entry_user_nrc' }}
              error={inputValidationMsg.isError &&
                requiredFields.includes('nrc') &&
                !formData.nrc}
              helperText={inputValidationMsg.isError &&
                requiredFields.includes('nrc') &&
                !formData.nrc &&
                'ID is Required'}
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="phoneNumber">
              {t('form_fields.phone_number')}
            </label>
            <TextField
              className="form-control"
              type="text"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
              name="phoneNumber"
              inputProps={{ 'data-testid': 'entry_user_phone' }}
              error={inputValidationMsg.isError &&
                requiredFields.includes('phoneNumber') &&
                !formData.phoneNumber}
              helperText={inputValidationMsg.isError &&
                requiredFields.includes('phoneNumber') &&
                !formData.phoneNumber &&
                'Phone Number is Required'}
            />
          </div>
          {previousRoute === 'enroll' && (
            <>
              <div className="form-group">
                <TextField
                  id="userType"
                  select
                  label={t('form_fields.user_type')}
                  value={formData.userType || ''}
                  onChange={handleInputChange}
                  margin="normal"
                  name="userType"
                  className={`${css(styles.selectInput)}`}
                >
                  {Object.entries(userType).map(([key, val]) => (
                    <MenuItem key={key} value={key}>
                      {val}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="form-group">
                <TextField
                  id="state"
                  select
                  label={t('form_fields.state')}
                  value={formData.state || ''}
                  onChange={handleInputChange}
                  margin="normal"
                  name="state"
                  className={`${css(styles.selectInput)}`}
                >
                  {Object.entries(userState).map(([key, val]) => (
                    <MenuItem key={key} value={key}>
                      {val}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              <div className="form-group">
                <div className="form-group">
                  <label className="bmd-label-static" htmlFor="expiresAt">
                    {t('misc.expiration_date')}
                  </label>
                  {/* Todo: This should be replaced by a date picker */}
                  <input
                    className="form-control"
                    name="expiresAt"
                    type="text"
                    pattern="([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))"
                    placeholder="YYYYY-MM-DD"
                    defaultValue={formData.expiresAt || 'YYYYY-MM-DD'}
                    onChange={handleInputChange}
                    title={t('errors.date_error')}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="bmd-label-static" htmlFor="vehicle">
              {t('form_fields.vehicle_plate_number')}
            </label>
            <TextField
              className="form-control"
              type="text"
              onChange={handleInputChange}
              value={formData.vehiclePlate || ''}
              name="vehiclePlate"
              inputProps={{ 'data-testid': 'entry_user_vehicle' }}
              error={inputValidationMsg.isError &&
                requiredFields.includes('vehiclePlate') &&
                !formData.vehiclePlate}
              helperText={inputValidationMsg.isError &&
                requiredFields.includes('vehiclePlate') &&
                !formData.vehiclePlate &&
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
              value={formData.companyName || ''}
              onChange={handleInputChange}
              inputProps={{ 'data-testid': 'companyName' }}
              error={inputValidationMsg.isError &&
                    requiredFields.includes('companyName') &&
                    !formData.companyName}
              helperText={inputValidationMsg.isError &&
                    requiredFields.includes('companyName') &&
                    !formData.companyName &&
                    'Company Name is Required'}
            />
          </div>
          <div className="form-group">
            <TextField
              id="reason"
              select
              label={t('logbook:logbook.visiting_reason')}
              name="reason"
              value={formData.reason || ''}
              onChange={handleInputChange}
              className={`${css(styles.selectInput)}`}
              inputProps={{ 'data-testid': 'entry_user_visit' }}
              error={inputValidationMsg.isError &&
                requiredFields.includes('reason') &&
                (!formData.reason)}
              helperText={inputValidationMsg.isError &&
                requiredFields.includes('reason') &&
                !formData.reason ?
                'Reason is Required' : formData.business}
            >
              {
                Object.keys(defaultBusinessReasons).map(_reason => (
                  <MenuItem key={_reason} value={_reason}>
                    {t(`logbook:business_reasons.${_reason}`) || defaultBusinessReasons[String(_reason)]}
                  </MenuItem>
                  ))
              }
            </TextField>
          </div>

          {
            // TODO: Find better ways to disable specific small feature per community 
            !reqId && authState.user.community.name !== 'Ciudad Morazán' && (
              <div className="form-group">
                <TextField
                  className="form-control"
                  type="text"
                  label="Temperature(°C)"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  name="temperature"
                  inputProps={{ 'data-testid': 'temperature' }}
                  style={{ width: 200 }}
                />
              </div>
            )
          }

          {/* This should only show for registered users */}
          {
            requestType === 'guest' && (
              <GuestTime
                days={formData.occursOn}
                userData={formData}
                handleChange={handleInputChange}
                handleChangeOccurrence={handleChangeOccurrence}
              />
            )
          }

          {
            requestType === 'guest' && !id && (
              <div className="row justify-content-center align-items-center ">
                <Button
                  variant="contained"
                  className={`${css(styles.inviteGuestButton)}`}
                  onClick={handleCreateRequest}
                  disabled={isLoading}
                  startIcon={isLoading && <Spinner />}
                  color="primary"
                  data-testid="submit_button"
                >
                  {isLoading ? ` ${t('form_actions.submitting')} ...` : ` ${t('form_actions.invite_guest')} `}
                </Button>
              </div>
            )
          }

          <br />
          {previousRoute !== 'enroll' && id && (
          <Button
            variant="contained"
            onClick={event => handleModal(event, requestType === 'guest' ? 'update' : 'grant')}
            className={css(styles.grantButton)}
            disabled={isLoading}
            data-testid="entry_user_grant_request"
            startIcon={isLoading && <Spinner />}
          >
            {
              requestType === 'guest' ? t('logbook:guest_book.update_guest') : t('misc.log_new_entry')
            }
          </Button>
          )}

          <br />
          <br />
          {previousRoute === 'enroll' ? (
            <>
              <div className="row justify-content-center align-items-center">
                <Button
                  variant="contained"
                  onClick={handleEnrollUser}
                  className={css(styles.grantButton)}
                  data-testid="entry_user_enroll"
                  disabled={isLoading}
                  startIcon={isLoading && <Spinner />}
                >
                  {isLoading
                    ? `${t('logbook:logbook.enrolling')} ...`
                    : ` ${t('logbook:logbook.enroll')}`}
                </Button>
              </div>
            </>
          ) : !/logs|enroll|guests/.test(previousRoute) && !tabValue ? (
            <>
              <Grid container direction="row" justify="flex-start" spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={event => handleModal(event, 'grant')}
                    className={css(styles.grantButton)}
                    disabled={isLoading}
                    data-testid="entry_user_grant"
                    startIcon={isLoading && <Spinner />}
                  >

                    {
                      t('logbook:logbook.grant')
                    }
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleDenyRequest}
                    className={css(styles.denyButton)}
                    disabled={isLoading}
                    data-testid="entry_user_deny"
                    startIcon={isLoading && <Spinner />}
                  >
                    {
                      t('logbook:logbook.deny')
                    }
                  </Button>
                </Grid>
              </Grid>
              <br />
              <Grid container direction="row" justify="flex-start">
                <Grid item>
                  <a
                    href={`tel:${authState.user.community.securityManager}`}
                    className={` ${css(styles.callButton)}`}
                    data-testid="entry_user_call_mgr"
                  >
                    <CallIcon />
                    {' '}
                    <p style={{ margin: '-28px 30px' }}>{t('logbook:logbook.call_manager')}</p>
                  </a>
                </Grid>
              </Grid>
            </>
          ) : (
            <span />
          )}


        </form>
      </div>
    </>
  );
}

RequestUpdate.defaultProps = {
  id: null,
  previousRoute: '',
  requestType: '',
  tabValue: null,
}

RequestUpdate.propTypes = {
  id: PropTypes.string,
  previousRoute: PropTypes.string,
  requestType: PropTypes.string,
  tabValue: PropTypes.string,
}


const styles = StyleSheet.create({
  selectInput: {
    width: '100%'
  },
  grantButton: {
    backgroundColor: "#66A59A",
    color: "#FFFFFF"
  },
  denyButton: {
    backgroundColor: "#C31515",
    color: "#FFFFFF"
  },
  callButton: {
    color: '#66A59A',
    textTransform: 'unset',
    textDecoration: 'none'
  },
  observationButton: {
    margin: 5,
  },
  inviteGuestButton: {
    width: '75%',
    boxShadow: 'none',
    marginTop: 60,
    height: 50,
    color: "#FFFFFF"
  },
});
