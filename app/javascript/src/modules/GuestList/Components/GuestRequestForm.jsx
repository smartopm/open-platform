/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from 'react';
import { useMutation, useLazyQuery } from 'react-apollo';
import { TextField, MenuItem, Button } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { useHistory} from 'react-router';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types'
import { GuestListEntryQuery } from '../../../graphql/queries';
import { GuestEntryRequestCreate } from '../../../graphql/mutations';
import { Spinner } from "../../../shared/Loading";
import { objectAccessor } from '../../../utils/helpers';

import { ReasonInputModal } from "../../../components/Dialog"
import { defaultBusinessReasons } from '../../../utils/constants'
import { dateToString, updateDateWithTime } from "../../../components/DateContainer";
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { GuestEntrytUpdateMutation } from '../graphql/guest_list_mutation';
import MessageAlert from '../../../components/MessageAlert'
import { checkInValidRequiredFields, defaultRequiredFields } from '../../LogBook/utils';
import GuestTime from '../../LogBook/Components/GuestTime';

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
    isGuest: true
}

export default function GuestRequestForm({ id }) {
  const history = useHistory()
  const authState = useContext(Context)
  const [loadRequest, { data }] = useLazyQuery(GuestListEntryQuery, {
    variables: { id }
  });
  const [createGuestListEntryRequest] = useMutation(GuestEntryRequestCreate)
  const [updateRequest] = useMutation(GuestEntrytUpdateMutation)
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState({ isError: false, detail: ''});
  const [inputValidationMsg, setInputValidationMsg] = useState({ isError: false, isSubmitting: false })
  const [formData, setFormData] = useState(initialState);
  const requiredFields = defaultRequiredFields
  const { t } = useTranslation(['common', 'logbook'])
  const [isReasonModalOpen, setReasonModal] = useState(false)
  const isGuestRequest = true 

  useEffect(() => {
    if (id!== 'action=new-guest' && id !== null && id !== 'undefined') {
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

  const closeGuestRequestForm = () =>{
    history.push({pathname: '/guest-list'})
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

    const requestFormData = {
      ...formData,
      // return reason if not other
      reason: formData.business || formData.reason,
      startTime: dateToString(formData.startTime, 'YYYY-MM-DD HH:mm'),
      endTime: dateToString(formData.endTime, 'YYYY-MM-DD HH:mm')
    }

      return createGuestListEntryRequest({ variables: requestFormData })
      // eslint-disable-next-line no-shadow
        .then(() => {
          setMessage({
            isError: false,
            detail: t('logbook:logbook.guest_entry_created_successful')
          });
          setLoading({ ...isLoading, loading: false });

          history.push('/guest-list')

        })
        .catch(err => {
          setMessage({isError: true, detail: err.message });
        });
  }

  function handleUpdateRequest() {
    const requestFormData = {
      ...formData,
      reason: formData.business || formData.reason,
      startTime: updateDateWithTime(formData.visitationDate, formData.startTime),
      endTime: updateDateWithTime(formData.visitationDate, formData.endTime),
    };
    setLoading(true);
    updateRequest({ variables: { id, ...requestFormData } })
      .then(() => {
        setLoading(false);
        setMessage({
          isError: false,
          detail: t('logbook:logbook.guest_entry_updated_successful')
        });
        history.push('/guest-list')
      })
      .catch(error => {
        setLoading(false);
        setMessage({ isError: true, detail: error.message });
      });
  }


  function handleModal(_event, type) {
    const isAnyInvalid = checkInValidRequiredFields(formData, requiredFields)
    if(isAnyInvalid ){
      setInputValidationMsg({ isError: true })
      return
    }
    if (isGuestRequest && !formData.visitationDate) {
      setMessage({ isError: true, detail: t('logbook:logbook.visit_end_error') });
      return
    }

    switch (type) {
      case 'update':
        handleUpdateRequest()
        break;
      case 'create':
        handleCreateRequest()
        break;
      default:
        break;
    }
  }

  function handleAddOtherReason(){
    if (!formData.business) {
      setInputValidationMsg({ isError: true })
      return
    }
    setReasonModal(!isReasonModalOpen)
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

      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />

      <div className="container">
        <form>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              {t('logbook:guest_book.host')}
            </label>
            <TextField
              className="form-control"
              type="text"
              value={authState.user.name}
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
              inputProps={{ 'data-testid': 'guest_entry_user_name' }}
              error={inputValidationMsg.isError && requiredFields.includes('name') && !formData.name}
              helperText={inputValidationMsg.isError &&
                requiredFields.includes('name') &&
                !formData.name &&
                'Name is Required'}
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
              inputProps={{ 'data-testid': 'guest_entry_user_nrc' }}
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
              inputProps={{ 'data-testid': 'guest_entry_user_phone' }}
              error={inputValidationMsg.isError &&
                requiredFields.includes('phoneNumber') &&
                !formData.phoneNumber}
              helperText={inputValidationMsg.isError &&
                requiredFields.includes('phoneNumber') &&
                !formData.phoneNumber &&
                'Phone Number is Required'}
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
              inputProps={{ 'data-testid': 'guest_entry_user_vehicle' }}
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
              inputProps={{ 'data-testid': 'guest_company_name' }}
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
              inputProps={{ 'data-testid': 'guest_entry_visit_reason' }}
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
                    {t(`logbook:business_reasons.${_reason}`) || objectAccessor(defaultBusinessReasons, _reason)}
                  </MenuItem>
                  ))
              }
            </TextField>
          </div>

      
          {/* This should only show for registered users */}
          {
            isGuestRequest && (
              <GuestTime
                days={formData.occursOn}
                userData={formData}
                handleChange={handleInputChange}
                handleChangeOccurrence={handleChangeOccurrence}
              />
            )
          }

          <div className=" d-flex row justify-content-center ">
            <Button
              variant="contained"
              aria-label="guest_cancel"
              color="secondary"
              onClick={closeGuestRequestForm}
              className={`${css(styles.cancelGuestButton)}`}
              data-testid="cancel_update_guest_btn"
            >
              {t('common:form_actions.cancel')}
            </Button>
            {id!== 'action=new-guest' && id !== null && id !== 'undefined' ? (
              <Button
                variant="contained"
                className={`${css(styles.inviteGuestButton)}`}
                data-testid="update_guest_btn"
                onClick={event => handleModal(event, 'update')}
                disabled={isLoading}
                startIcon={isLoading && <Spinner />}
                color="primary"
              >
                {isLoading ? ` ${t('form_actions.submitting')} ...` : ` ${t('logbook:guest_book.update_guest')} `}
              </Button>
                ) : (

                  <Button
                    variant="contained"
                    className={`${css(styles.inviteGuestButton)}`}
                    data-testid="invite_guest_btn"
                    onClick={event => handleModal(event, 'create')}
                    disabled={isLoading}
                    startIcon={isLoading && <Spinner />}
                    color="primary"
                  >
                    {isLoading ? ` ${t('form_actions.submitting')} ...` : ` ${t('form_actions.invite_guest')} `}
                  </Button>
                )}

              
          </div>
          


          <br />
        </form>
      </div>
    </>
  );
}

GuestRequestForm.defaultProps = {
  id: null,
}

GuestRequestForm.propTypes = {
  id: PropTypes.string,
}


const styles = StyleSheet.create({
  selectInput: {
    width: '100%'
  },
  denyButton: {
    backgroundColor: "#C31515",
    color: "#FFFFFF"
  },
  inviteGuestButton: {
    width: '20%',
    boxShadow: 'none',
    marginTop: 50,
    alignItems: 'center',
    height: 50,
    color: "#FFFFFF",
    '@media (min-device-width: 320px) and (max-device-height: 568px)' : {
      width: '50%',
      height: 30
    
    }
  },

  cancelGuestButton: {
    width: '20%',
    boxShadow: 'none',
    marginRight: '15vw',
    alignItems: 'center',
    marginTop: 50,
    color: "#FFFFFF",

    '@media (min-device-width: 320px) and (max-device-height: 568px)' : {
      height: 30
    
    }
  },
});
