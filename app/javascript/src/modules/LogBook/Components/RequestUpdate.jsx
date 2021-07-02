/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { TextField, MenuItem, Button , Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { useHistory, useLocation, useParams } from 'react-router';
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
import Loading, { Spinner } from "../../../shared/Loading";
import { isTimeValid, getWeekDay } from '../../../utils/dateutil';
import { userState, userType, communityVisitingHours, defaultBusinessReasons } from '../../../utils/constants'
import { ModalDialog } from "../../../components/Dialog"
import CaptureTemp from "../../../components/CaptureTemp";
import { dateToString, dateTimeToString } from "../../../components/DateContainer";
import { Context } from '../../../containers/Provider/AuthStateProvider';
import EntryNoteDialog from '../../../shared/dialogs/EntryNoteDialog';
import CenteredContent from '../../../components/CenteredContent';
import AddObservationNoteMutation from '../graphql/logbook_mutations';
import MessageAlert from '../../../components/MessageAlert'
import { checkInValidRequiredFields, defaultRequiredFields } from '../utils';

const initialState = {
    name: '',
    phoneNumber: '',
    nrc: '',
    vehiclePlate: '',
    reason: '',
    otherReason: '',
    state: '',
    userType: '',
    expiresAt: '',
    email: '',
    companyName: '',
    loaded: false
}
export default function RequestUpdate({ id }) {
    const { state } = useLocation()
    const { logs, } = useParams()
    const history = useHistory()
    const authState = useContext(Context)
    const previousRoute = state?.from || logs
    const isFromLogs = previousRoute === 'logs' ||  false

  const { loading, data } = useQuery(EntryRequestQuery, {
    variables: { id }
  });
  const [createEntryRequest] = useMutation(EntryRequestCreate)
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [denyEntry] = useMutation(EntryRequestDeny);
  const [createUser] = useMutation(CreateUserMutation)
  const [updateLog] = useMutation(UpdateLogMutation)
  const [addObservationNote] = useMutation(AddObservationNoteMutation)
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isModalOpen, setModal] = useState(false)
  const [modalAction, setModalAction] = useState('')
  const [date, setDate] = useState(new Date());
  const [isClicked, setIsClicked] = useState(false)
  const [isObservationOpen, setIsObservationOpen] = useState(false)
  const [observationNote, setObservationNote] = useState("")
  const [reqId, setRequestId] = useState(id)
  const [observationDetails, setDetails] = useState({ isError: false, message: '', loading: false })
  const [inputValidationMsg, setInputValidationMsg] = useState({ isError: false, isSubmitting: false })
  const [formData, setFormData] = useState(initialState);
  const requiredFields = authState?.user?.community?.communityRequiredFields?.manualEntryRequestForm || defaultRequiredFields
  const { t } = useTranslation(['common', 'logbook'])

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  if (loading) {
    return <Loading />;
  }

  // Data is loaded, so set the initialState, but only once
  if (!formData.loaded && data) {
    setFormData({ ...data.result, loaded: true });
  }
  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  function handleCreateRequest() {
      return createEntryRequest({ variables: formData })
      // eslint-disable-next-line no-shadow
        .then(({ data }) => {
          setRequestId(data.result.entryRequest.id)
          return data.result.entryRequest.id
        })
        .catch(err => {
          setDetails({ ...observationDetails, message: err.message });
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
        setDetails({ ...observationDetails, message: error.message })
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
        setDetails({ ...observationDetails, message: error.message })
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
          setMessage(t('logbook:logbook.user_enrolled'))
          history.push(`/user/${response.data.result.user.id}`)
        })
      })
      .catch((err) => {
        setLoading(false)
        setMessage(err.message)
      })
  }

  function handleModal(_event, type) {
    const isAnyInvalid = checkInValidRequiredFields(formData, requiredFields)
    if(isAnyInvalid){
      setInputValidationMsg({ isError: true })
      return
    }
    if (type === 'grant') {
      setModalAction('grant')
    } else {
      setModalAction('deny')
    }
    setModal(!isModalOpen)
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

  const observationAction = observationNote ? 'Save' : 'Skip'
  return (
    <>
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
                (!formData.reason) || (formData.reason === 'other' &&
                !formData.reason)}
              helperText={inputValidationMsg.isError &&
                requiredFields.includes('reason') &&
                !formData.reason &&
                'Reason is Required'}
            >
              {Object.keys(defaultBusinessReasons).map(_reason => (
                <MenuItem key={_reason} value={_reason}>
                  {t(`logbook:business_reasons.${_reason}`) || defaultBusinessReasons[String(_reason)]}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <br />
          {previousRoute !== 'enroll' && reqId &&(
            // TODO: @olivier ==> This needs to be revisited
            <CaptureTemp refId={reqId} refName={formData.name} refType="Logs::EntryRequest" />
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
                  disabled={isLoading}
                >
                  {isLoading
                    ? `${t('logbook:logbook.enrolling')} ...`
                    : ` ${t('logbook:logbook.enroll')}`}
                </Button>
              </div>
              <div className="row justify-content-center align-items-center">
                <br />
                <br />
                {!isLoading && message.length ? (
                  <span className="text-danger">{message}</span>
                ) : (
                  <span />
                )}
              </div>
            </>
          ) : !/logs|enroll/.test(previousRoute) ? (
            <>
              <Grid container direction="row" justify="flex-start" spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={event => handleModal(event, 'grant')}
                    className={css(styles.grantButton)}
                    disabled={isLoading}
                    data-testid="entry_user_grant"
                  >

                    {
                      isLoading ? <Spinner /> : t('logbook:logbook.grant')
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
                  >
                    {
                      isLoading ? <Spinner /> : t('logbook:logbook.deny')
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
  id: null
}

RequestUpdate.propTypes = {
  id: PropTypes.string
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
  }
});
