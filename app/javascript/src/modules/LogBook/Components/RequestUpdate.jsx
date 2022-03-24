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
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import CallIcon from '@material-ui/icons/Call';
import {
  EntryRequestGrant,
  EntryRequestDeny,
  EntryRequestCreate
} from '../../../graphql/mutations';
import { Spinner } from '../../../shared/Loading';
import { isTimeValid, getWeekDay } from '../../../utils/dateutil';
import { objectAccessor, validateEmail } from '../../../utils/helpers';
import { dateToString, dateTimeToString } from '../../../components/DateContainer';
import { communityVisitingHours, defaultBusinessReasons, CommunityFeaturesWhiteList } from '../../../utils/constants'
import { ModalDialog, ReasonInputModal } from "../../../components/Dialog"
import { Context } from '../../../containers/Provider/AuthStateProvider';
import {
  EntryRequestUpdateMutation,
  SendGuestQrCodeMutation
} from '../graphql/logbook_mutations';
import MessageAlert from '../../../components/MessageAlert';
import { checkInValidRequiredFields, defaultRequiredFields , checkRequests } from '../utils';
import QRCodeConfirmation from './QRCodeConfirmation';
import FeatureCheck, { featureCheckHelper } from '../../Features';
import { EntryRequestContext } from '../GuestVerification/Context';
import { initialRequestState } from '../GuestVerification/constants'
import AccessCheck from '../../Permissions/Components/AccessCheck';


export default function RequestUpdate({ id, previousRoute, guestListRequest, isGuestRequest, tabValue, isScannedRequest, handleNext }) {
  const history = useHistory()
  const authState = useContext(Context)
  const { state } = useLocation()
  const requestContext = useContext(EntryRequestContext)
  const isFromLogs = previousRoute === 'logs' ||  false
  const [createEntryRequest] = useMutation(EntryRequestCreate);
  const [sendGuestQrCode] = useMutation(SendGuestQrCodeMutation);
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [denyEntry] = useMutation(EntryRequestDeny);
  const [updateRequest] = useMutation(EntryRequestUpdateMutation);
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
              history.push(`/logbook?tab=1`);
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
              history.push(`/logbook?tab=1`);
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
          history.push(`/logbook?tab=1`);
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
        guestEmail,
        qrType: 'scan'
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

  function closeQrModal() {
    setQrModal(false);
    if (guestListRequest) {
      history.push('/logbook/guests')
      return
    }
    handleNext(true, '/logbook?tab=1&offset=0')
  }

  function handleCreateRequest(type='create') {
    const otherFormData = {
      ...formData,
      // return reason if not other
      reason: formData.business || formData.reason,
      isGuest: guestListRequest,
      visitationDate: previousRoute !== 'entry_logs' ? formData.visitationDate : null,
    }
    if(requestContext.request.id && featureCheckHelper(authState?.user?.community?.features, 'LogBook', CommunityFeaturesWhiteList.guestVerification)){
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
          if ((!featureCheckHelper(authState?.user?.community?.features, 'LogBook', CommunityFeaturesWhiteList.guestVerification) && type !==  'deny') || type === 'grant') {
            return requestContext.grantAccess(response.data.result.entryRequest.id)
          }
          requestContext.updateRequest({
            ...requestContext.request, id: response.data.result.entryRequest.id
           })
           return response.data.result.entryRequest.id
        })
        .then(response => {
          if (featureCheckHelper(authState?.user?.community?.features, 'LogBook', CommunityFeaturesWhiteList.guestVerification) && type !== 'grant') {
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
      .then((response) => {
        setLoading(false);
        setDetails({
          ...observationDetails,
          message: t('logbook:logbook.registered_guest_updated')
        });
        setDetails({ ...observationDetails, message: t('logbook:logbook.registered_guest_updated') });
        const res = response.data.result.entryRequest
        requestContext.updateRequest({
          ...requestContext.request, ...res
         })
        if (!requestContext.request.isEdit) {
          handleNext(true, '/logbook?tab=1&offset=0')
        }
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
    handleCreateRequest('deny')
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

  function isEmailValid() {
    return !formData?.email ? true : validateEmail(formData.email);
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

    switch (type) {
      case 'grant':
        handleCreateRequest('grant')
        break;
      case 'deny':
        setModalAction('deny');
        setModal(!isModalOpen);
        break;
      case 'update':
        handleUpdateRequest();
        break;
      case 'create':
        handleCreateRequest('create')
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
      history.push({pathname: '/logbook/guests'})
      return
    }
    history.push(`/logbook?tab=${state.tabValue}&offset=${state.offset}`)
  }

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
        handleConfirm={() => handleCreateRequest('grant')}
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
            />
          </div>
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

          {/* TODO: as we are slowly deprecating these actions, we should arrange them properly */}
          <div className=" d-flex row justify-content-center ">
            {
            showCancelBtn && !Number(tabValue) &&
            (
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
           !/logs/.test(previousRoute) && tabValue !== 2 ? (
             <>
               <Grid container justify="center" spacing={4} className={css(styles.grantSection)}>
                 {
                Boolean(id || requestContext.request.id ) && (
                  <AccessCheck module="entry_request" allowedPermissions={['can_update_entry_request']}>
                    <Grid item>
                      <Button
                        onClick={event => handleModal(event, 'update')}
                        data-testid="entry_user_update"
                        startIcon={isLoading && <Spinner />}
                        color="primary"
                        variant="contained"
                      >
                        {
                          t('logbook:image_capture.update')
                        }
                      </Button>
                    </Grid>
                  </AccessCheck>
                      )
                }
                 <AccessCheck module="entry_request" allowedPermissions={['can_grant_entry']}>
                   <Grid item>
                     <Button
                       onClick={event => handleModal(event, 'grant')}
                       data-testid="entry_user_grant"
                       startIcon={isLoading && <Spinner />}
                       color="primary"
                       variant="contained"
                     >
                       {
                      t('logbook:logbook.grant')
                    }
                     </Button>
                   </Grid>
                 </AccessCheck>


                 <br />
                 <FeatureCheck features={authState?.user?.community?.features} name="LogBook" subFeature={CommunityFeaturesWhiteList.denyGateAccessButton}>
                   <>
                     {!requestContext.request.isEdit && (
                     <AccessCheck module="entry_request" allowedPermissions={['can_grant_entry']}>
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
                     </AccessCheck>
                )}
                     <AccessCheck module="entry_request" allowedPermissions={['can_grant_entry']}>
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
                     </AccessCheck>
                   </>
                 </FeatureCheck>
                 <AccessCheck module="entry_request" allowedPermissions={['can_update_entry_request']}>
                   <FeatureCheck features={authState?.user?.community?.features} name="LogBook" subFeature={CommunityFeaturesWhiteList.guestVerification}>
                     <Grid item>
                       <Button
                         onClick={event => handleModal(event, 'create')}
                         color="primary"
                         disabled={isLoading}
                         data-testid="entry_user_next"
                         startIcon={isLoading && <Spinner />}
                       >
                         {
                          t('logbook:logbook.next_step')
                        }
                       </Button>
                     </Grid>
                   </FeatureCheck>
                 </AccessCheck>
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
