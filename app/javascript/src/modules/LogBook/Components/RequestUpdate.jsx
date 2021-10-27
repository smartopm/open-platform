/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from 'react';
import { useMutation } from 'react-apollo';
import { TextField, MenuItem, Button, Grid } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import CallIcon from '@material-ui/icons/Call';
import {
  EntryRequestGrant,
  EntryRequestDeny,
  CreateUserMutation,
  UpdateLogMutation,
  EntryRequestCreate
} from '../../../graphql/mutations';
import { Spinner } from '../../../shared/Loading';
import { isTimeValid, getWeekDay } from '../../../utils/dateutil';
import { objectAccessor, validateEmail } from '../../../utils/helpers';
import { dateToString, dateTimeToString } from '../../../components/DateContainer';
import { userState, userType, communityVisitingHours, defaultBusinessReasons, CommunityFeaturesWhiteList } from '../../../utils/constants'
import { ModalDialog, ReasonInputModal } from "../../../components/Dialog"
import { Context } from '../../../containers/Provider/AuthStateProvider';
import {
  EntryRequestUpdateMutation,
  SendGuestQrCodeMutation
} from '../graphql/logbook_mutations';
import MessageAlert from '../../../components/MessageAlert';
import { checkInValidRequiredFields, defaultRequiredFields , checkRequests } from '../utils';
import GuestTime from './GuestTime';
import QRCodeConfirmation from './QRCodeConfirmation';
import FeatureCheck from '../../Features';
import { EntryRequestContext } from '../GuestVerification/Context';
import { initialRequestState } from '../GuestVerification/constants'



export default function RequestUpdate({ id, previousRoute, guestListRequest, isGuestRequest, tabValue, isScannedRequest, handleNext }) {
  const history = useHistory()
  const authState = useContext(Context)
  const requestContext = useContext(EntryRequestContext)
  const isFromLogs = previousRoute === 'logs' ||  false
  const [createEntryRequest] = useMutation(EntryRequestCreate);
  const [sendGuestQrCode] = useMutation(SendGuestQrCodeMutation);
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [denyEntry] = useMutation(EntryRequestDeny);
  const [updateRequest] = useMutation(EntryRequestUpdateMutation);
  const [createUser] = useMutation(CreateUserMutation);
  const [updateLog] = useMutation(UpdateLogMutation);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [date] = useState(new Date());
  const [isClicked, setIsClicked] = useState(false);
  const [reqId, setRequestId] = useState(id);
  const [observationDetails, setDetails] = useState({
    isError: false,
    message: '',
    loading: false,
    scanLoading: false
  });
  const [inputValidationMsg, setInputValidationMsg] = useState({
    isError: false,
    isSubmitting: false
  });
  const [formData, setFormData] = useState(initialRequestState);

  const { t } = useTranslation(['common', 'logbook', 'discussion']);
  const [isReasonModalOpen, setReasonModal] = useState(false);
  const [isQrModalOpen, setQrModal] = useState(false);
  const [qrCodeEmail, setQrCodeEmail] = useState('');
  const [guestRequest, setGuestRequest] = useState({ id: '' });
  const requiredFields = authState?.user?.community?.communityRequiredFields?.manualEntryRequestForm || defaultRequiredFields
  const [emailError, setEmailError] = useState(false);
  const showCancelBtn = previousRoute || tabValue || !!guestListRequest


  useEffect(() => {
    if (formData.reason === 'other') {
      setReasonModal(true);
    }
  }, [formData.reason, id]);


  useEffect(() => {
    if (formData.loaded && isScannedRequest) {
      const requestValidity = checkRequests(formData, t, authState?.user?.community?.timezone);
      if (requestValidity.valid) {
        grantEntry({ variables: { id: formData.id } })
          .then(() => {
            setDetails({
              ...observationDetails,
              isError: false,
              scanLoading: true,
              message: t('logbook:logbook.success_message', {
                action: t('logbook:logbook.granted')
              })
            });
            setTimeout(() => {
              setDetails({
                ...observationDetails,
                isError: false,
                scanLoading: false,
                message: ''
              });
              history.push(`/entry_logs?tab=2`);
            }, 1000);
          })
          .catch(err => {
            setDetails({
              ...observationDetails,
              isError: true,
              scanLoading: true,
              message: err.message
            });
            setTimeout(() => {
              setDetails({
                ...observationDetails,
                isError: false,
                scanLoading: false,
                message: ''
              });
              history.push(`/entry_logs?tab=2`);
            }, 1000);
          });
      } else {
        setDetails({
          ...observationDetails,
          isError: true,
          scanLoading: true,
          message: requestValidity.title
        });
        setTimeout(() => {
          setDetails({ ...observationDetails, isError: false, scanLoading: false, message: '' });
          history.push(`/entry_logs?tab=2`);
        }, 1000);
      }
    }
  }, [formData.loaded]);

  useEffect(() => {
    // Data is loaded, so set the initialState, but only once
    if (requestContext.request?.id) {
      return setFormData({ ...formData, ...requestContext.request });
    }
    return setFormData({ ...initialRequestState });

  }, [requestContext.request])


  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // if a different reason is picked then reset the other reason
    if (name === 'reason' && formData.business) {
      setFormData({ ...formData, business: '' });
    }
  }

  function sendQrCode(requestId, guestEmail) {
    sendGuestQrCode({
      variables: {
        id: requestId,
        guestEmail
      }
    })
      .then(() => {
        setDetails({
          ...observationDetails,
          message: t('qrcode_confirmation.qr_code_sent')
        });
        setTimeout(() => closeQrModal(), 100);
      })
      .catch(error => {
        setDetails({ ...observationDetails, isError: true, message: error.message });
      });
  }

  function handleChangeOccurrence(day) {
    if (formData.occursOn.includes(day)) {
      const leftDays = formData.occursOn.filter(d => d !== day);
      setFormData({
        ...formData,
        occursOn: leftDays
      });
      return;
    }
    setFormData({
      ...formData,
      occursOn: [...formData.occursOn, day]
    });
  }

  function closeQrModal() {
    setQrModal(false);
    if (guestListRequest) {
      history.push('/guest-list')
      return
    }
    handleNext(true)
  }

  function handleCreateRequest() {
    const otherFormData = {
      ...formData,
      // return reason if not other
      reason: formData.business || formData.reason,
      isGuest: guestListRequest,
      visitationDate: previousRoute !== 'entry_logs' ? formData.visitationDate : null
    }
    if(requestContext.request.id && communityName !== 'Nkwashi'){
      handleNext()
    }

    setLoading(true)
    return (
      createEntryRequest({ variables: otherFormData })
        // eslint-disable-next-line consistent-return
        .then((response) => {
          setRequestId(response.data.result.entryRequest.id);
          setLoading(false)
          if (isGuestRequest) {
            setDetails({
              ...observationDetails,
              isError: false,
              message: t('logbook:logbook.registered_guest_created')
            });
            setGuestRequest(response.data.result.entryRequest);
            setQrModal(true);
            return false
          }
          // hardcoding this for now before we make this a community setting
          if (communityName === 'Nkwashi') {
            return requestContext.grantAccess(response.data.result.entryRequest.id)
          }
          requestContext.updateRequest({
            ...requestContext.request, id: response.data.result.entryRequest.id
           })
           return response.data.result.entryRequest.id
        })
        .then(response => {
          if (communityName !== 'Nkwashi') {
            handleNext()
          }
          return response
        })
        .catch(err => {
          setLoading(false)
          setDetails({ ...observationDetails, isError: true, message: err.message });
        })
    );
  }

  function handleUpdateRequest() {
    const otherFormData = {
      ...formData,
      reason: formData.business || formData.reason
    };
    setLoading(true);
    updateRequest({ variables: { id, ...otherFormData } })
      // eslint-disable-next-line no-shadow
      .then(() => {
        setLoading(false);
        setDetails({
          ...observationDetails,
          message: t('logbook:logbook.registered_guest_updated')
        });
        setDetails({ ...observationDetails, message: t('logbook:logbook.registered_guest_updated') });
        handleNext(true)
      })
      .catch(error => {
        setLoading(false);
        setDetails({ ...observationDetails, isError: true, message: error.message });
      });
  }



  function handleDenyRequest() {
    const isAnyInvalid = checkInValidRequiredFields(formData, requiredFields);
    if (isAnyInvalid) {
      setInputValidationMsg({ isError: true });
      return;
    }
    setIsClicked(!isClicked);
    setLoading(true);
    handleCreateRequest()
      .then(requestId => denyEntry({ variables: { id: requestId } }))
      .then(() => {
        setDetails({
          ...observationDetails,
          message: t('logbook:logbook.success_message', { action: t('logbook:logbook.denied') })
        });
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        setDetails({ ...observationDetails, isError: true, message: error.message });
      });
  }

  function handleEnrollUser() {
    setLoading(true);
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
      .then(response => {
        updateLog({
          variables: {
            refId: id
          }
        }).then(() => {
          setLoading(false);
          setDetails({ ...observationDetails, message: t('logbook:logbook.user_enrolled') });
          history.push(`/user/${response.data.result.user.id}`);
        });
      })
      .catch(err => {
        setLoading(false);
        setDetails({ ...observationDetails, isError: true, message: err.message });
      });
  }

  function isEmailValid() {
    return formData?.email === '' ? true : validateEmail(formData.email);
  }

  function handleModal(_event, type) {
    const isAnyInvalid = checkInValidRequiredFields(formData, requiredFields);
    if (isAnyInvalid) {
      setInputValidationMsg({ isError: true });
      return;
    }

    if(!isEmailValid()) {
      setEmailError(true);
      return;
    }
    setEmailError(false);


    if (isGuestRequest && !formData.visitationDate) {
      setDetails({
        ...observationDetails,
        isError: true,
        message: t('logbook:logbook.visit_end_error')
      });
      return;
    }

    switch (type) {
      case 'grant':
        setModalAction('grant');
        setModal(!isModalOpen);
        break;
      case 'deny':
        setModalAction('deny');
        setModal(!isModalOpen);
        break;
      case 'update':
        handleUpdateRequest();
        break;
      case 'create':
        handleCreateRequest()
        break;
      default:
        break;
    }
  }

  function checkTimeIsValid() {
    const communityName = authState.user.community.name;
    const accessor = communityName.toLowerCase();
    const visitingHours = objectAccessor(communityVisitingHours, accessor);

    return isTimeValid({ date, visitingHours });
  }

  function handleAddOtherReason() {
    if (!formData.business) {
      setInputValidationMsg({ isError: true });
      return;
    }
    setReasonModal(!isReasonModalOpen);
  }


  // TODO: needs refactor
  function closeForm({id: _id}){

    if(_id === 'new-guest-entry' || guestListRequest ){
      history.push({pathname: '/guest-list'})
      return
    }
    history.push(`/entry_logs?tab=${tabValue}&offset=0`)
  }

  function disableEdit() {
    if(authState?.user?.userType !== 'admin' && isGuestRequest && formData?.user &&
        authState?.user?.id !== formData.user.id)
      return true;
    return false;
  }
  const communityName = authState.user.community.name
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

      <QRCodeConfirmation
        open={isQrModalOpen}
        guestEmail={formData.email}
        closeModal={closeQrModal}
        emailHandler={{ value: qrCodeEmail, handleEmailChange: setQrCodeEmail }}
        sendQrCode={sendQrCode}
        guestRequest={guestRequest}
      />
      <MessageAlert
        type={!observationDetails.isError ? 'success' : 'error'}
        message={observationDetails.message}
        open={!!observationDetails.message}
        handleClose={() => setDetails({ ...observationDetails, message: '' })}
      />
      <ModalDialog
        handleClose={() => setModal(false)}
        handleConfirm={() => requestContext.grantAccess()}
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
                formData.grantor
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
          {formData.grantor && (
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              {t('logbook:log_title.guard')}
            </label>
            <TextField
              className="form-control"
              type="text"
              value={formData.grantor?.name}
              disabled
              name="name"
            />
          </div>
        )}
          {isGuestRequest && formData.user && (
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              {t('logbook:log_title.host')}
            </label>
            <TextField
              className="form-control"
              type="text"
              value={formData.user?.name}
              disabled
              name="name"
            />
          </div>
        )}
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
              t('logbook:errors.required_field', { fieldName: 'Name' })}
              disabled={disableEdit()}
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              {t('form_fields.email')}
            </label>
            <TextField
              className="form-control"
              name="email"
              type="email"
              onChange={handleInputChange}
              value={formData.email}
              inputProps={{ 'data-testid': 'email' }}
              disabled={disableEdit()}
              error={emailError}
              helperText={emailError && !isEmailValid() && t('discussion:helper_text.invalid_email')}
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
              t('logbook:errors.required_field', { fieldName: 'ID' })}
              disabled={disableEdit()}
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
              t('logbook:errors.required_field', { fieldName: 'Phone Number' })}
              disabled={disableEdit()}
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
                  disabled={disableEdit()}
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
              t('logbook:errors.required_field', { fieldName: 'Vehicle Plate Number' })}
              disabled={disableEdit()}
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
                  t('logbook:errors.required_field', { fieldName: 'Company Name' })}
              disabled={disableEdit()}
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
              className={`${css(styles.selectInput)} visiting_reason`}
              inputProps={{ 'data-testid': 'entry_user_visit' }}
              error={inputValidationMsg.isError &&
              requiredFields.includes('reason') &&
              (!formData.reason)}
              helperText={inputValidationMsg.isError &&
              requiredFields.includes('reason') &&
              !formData.reason ?
              t('logbook:errors.required_field', { fieldName: 'Reason' }) : formData.business}
              disabled={disableEdit()}
            >
              {
              Object.keys(defaultBusinessReasons).map(_reason => (
                <MenuItem key={_reason} value={_reason}>
                  {t(`logbook:business_reasons.${_reason}`) || objectAccessor(defaultBusinessReasons, _reason)}
                </MenuItem>
                ))
            }
            </TextField>
          </div>

          {
          // TODO: Find better ways to disable specific small feature per community
          !reqId && authState.user.community.name !== 'Ciudad Morazán' && !isGuestRequest && (
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
          isGuestRequest && (
            <GuestTime
              days={formData.occursOn}
              userData={formData}
              handleChange={handleInputChange}
              handleChangeOccurrence={handleChangeOccurrence}
              authState={authState}
              disableEdit={disableEdit}
            />
          )
        }
          <div className=" d-flex row justify-content-center ">
            {
            showCancelBtn &&  (
            <Button
              variant="contained"
              aria-label="guest_cancel"
              color="secondary"
              onClick={() => closeForm({id})}
              className={`${css(styles.cancelGuestButton)}`}
              data-testid="cancel_update_guest_btn"
            >
              {t('common:form_actions.cancel')}
            </Button>
          )
          }


            {
              isGuestRequest && !id && (
                <Button
                  variant="contained"
                  className={`${css(styles.inviteGuestButton)}`}
                  data-testid="submit_button"
                  onClick={event => handleModal(event, 'create')}
                  disabled={isLoading}
                  startIcon={isLoading && <Spinner />}
                  color="primary"
                >
                  {isLoading ? ` ${t('form_actions.submitting')} ...` : ` ${t('form_actions.invite_guest')} `}
                </Button>
              )
        }
            {((previousRoute !== 'enroll' && id) && (authState?.user?.userType === 'admin' ||
              !isGuestRequest || authState?.user?.id === formData?.user?.id)) && (
              <Button
                variant="contained"
                onClick={event => handleModal(event, isGuestRequest ? 'update' : 'grant')}
                className={css(styles.grantButton)}
                disabled={isLoading}
                data-testid="entry_user_grant_request"
                startIcon={isLoading && <Spinner />}
              >
                {
                  isGuestRequest ? t('logbook:guest_book.update_guest') : t('misc.log_new_entry')
                }
              </Button>
          )}

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


        ) : !/logs|enroll|guests/.test(previousRoute) && !tabValue && !guestListRequest? (
          <>
            <Grid container justify="center" spacing={4} className={css(styles.grantSection)}>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={event => handleModal(event, 'create')}
                  color="primary"
                  disabled={isLoading}
                  data-testid="entry_user_next"
                  startIcon={isLoading && <Spinner />}
                >
                  {
                    communityName === 'Nkwashi' ? t('logbook:logbook.grant') : t('logbook:logbook.next_step')
                  }
                </Button>
              </Grid>
              {
                communityName !== 'Nkwashi' && (
                  <Grid item>
                    <Button
                      onClick={event => handleModal(event, 'grant')}
                      disabled={!requestContext.request.id}
                      data-testid="entry_user_grant"
                      startIcon={isLoading && <Spinner />}
                      color="primary"
                    >

                      {
                    t('logbook:logbook.grant')
                  }
                    </Button>
                  </Grid>
                )
              }
              <br />
              <Grid item>
                <FeatureCheck features={authState?.user?.community?.features} name="LogBook" subFeature={CommunityFeaturesWhiteList.denyGateAccessButton}>
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
                </FeatureCheck>
              </Grid>
              <Grid item>
                <a
                  href={`tel:${authState.user.community.securityManager}`}
                  className={css(styles.callButton)}
                  data-testid="entry_user_call_mgr"
                >
                  <CallIcon className={css(styles.callIcon)} />
                  <span>{t('logbook:logbook.call_manager')}</span>
                </a>
              </Grid>
            </Grid>
            <br />
          </>
        ) : (
          <span />
        )}
          </div>
        </form>
      </div>
    </>
 );
}


RequestUpdate.defaultProps = {
  id: null,
  previousRoute: '',
  tabValue: null,
  guestListRequest: false,
  handleNext: () => {}
};

RequestUpdate.propTypes = {
  id: PropTypes.string,
  previousRoute: PropTypes.string,
  isGuestRequest: PropTypes.bool.isRequired,
  isScannedRequest: PropTypes.bool.isRequired,
  tabValue: PropTypes.string,
  guestListRequest: PropTypes.bool,
  handleNext: PropTypes.func,
};


const styles = StyleSheet.create({
  selectInput: {
    width: '100%'
  },
  grantButton: {
    backgroundColor: '#66A59A',
    color: '#FFFFFF',
    height: 40,
    marginTop: 50
  },
  grantSection: {
    marginTop: 40
  },
  denyButton: {
    backgroundColor: '#C31515',
    color: '#FFFFFF',
  },
  callButton: {
    color: '#66A59A',
    textTransform: 'unset',
    textDecoration: 'none',
    boxShadow: 'none',
    alignItems: 'center',
    display: 'flex'
  },
  callIcon: {
    marginRight: 7
  },
  enrollButton: {
    backgroundColor: '#66A59A',
    color: '#FFFFFF',
    width: '60%',
    boxShadow: 'none',
    marginRight: '15vw',
    alignItems: 'center',
    '@media (min-device-width: 320px) and (max-device-height: 568px)': {
      height: 30,
      width: '100%'
    }
  },
  inviteGuestButton: {
    width: '20%',
    boxShadow: 'none',
    marginTop: 50,
    alignItems: 'center',
    height: 50,
    color: '#FFFFFF',

    '@media (min-device-width: 320px) and (max-device-height: 568px)': {
      height: 30,
      width: '50%'
    }
  },
  cancelGuestButton: {
    width: '20%',
    boxShadow: 'none',
    marginRight: '15vw',
    alignItems: 'center',
    marginTop: 50,
    color: '#FFFFFF',

    '@media (min-device-width: 320px) and (max-device-height: 568px)': {
      height: 30,
      width: '30%'
    }
  }
});
