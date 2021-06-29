/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useContext } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { TextField, MenuItem, Button } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { useHistory, useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { EntryRequestQuery } from '../../../graphql/queries';
import {
  EntryRequestUpdate,
  EntryRequestGrant,
  EntryRequestDeny,
  CreateUserMutation,
  UpdateLogMutation
} from '../../../graphql/mutations';
import Loading from "../../../shared/Loading";
import { isTimeValid, getWeekDay } from '../../../utils/dateutil';
import { userState, userType, communityVisitingHours } from '../../../utils/constants'
import { ModalDialog } from "../../../components/Dialog"
import CaptureTemp from "../../../components/CaptureTemp";
import { dateToString, dateTimeToString } from "../../../components/DateContainer";
import { Context } from '../../../containers/Provider/AuthStateProvider';

/**
 *
 * @deprecated This should be looked into, as it might be a duplicate of another similar component
 * basically we should find a way to re-use
 * Refer: RequestForm, RequestConfirm
 */
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
  const [updateEntryRequest] = useMutation(EntryRequestUpdate);
  const [grantEntry] = useMutation(EntryRequestGrant);
  const [denyEntry] = useMutation(EntryRequestDeny);
  const [createUser] = useMutation(CreateUserMutation)
  const [updateLog] = useMutation(UpdateLogMutation)
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isModalOpen, setModal] = useState(false)
  const [modalAction, setModalAction] = useState('')
  const [date, setDate] = useState(new Date());
  const [isClicked, setIsClicked] = useState(false)
  const [formData, setFormData] = useState({
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
    loaded: false
  });

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

  function handleUpdateRecord() {
    return updateEntryRequest({ variables: formData });
  }

  function handleGrantRequest() {
    setLoading(true)
    handleUpdateRecord()
      .then(grantEntry({ variables: { id } }))
      .then(() => {
        history.push('/entry_logs', { tab: 1 });
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        setMessage(error.message)
      });
  }

  function handleDenyRequest() {
    setIsClicked(!isClicked)
    setLoading(true)
    handleUpdateRecord()
      .then(denyEntry({ variables: { id } }))
      .then(() => {
        history.push('/entry_logs', { tab: 1 });
        setLoading(false)
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
    if (type === 'grant') {
      setModalAction('grant')
    } else {
      setModalAction('deny')
    }
    setModal(!isModalOpen)
    if (!isModalOpen) {
      setIsClicked(!isClicked)
    } else {
      setIsClicked(isClicked)
    }
  }

  function checkTimeIsValid(){
    const communityName = authState.user.community.name
    const visitingHours = communityVisitingHours[String(communityName.toLowerCase())];

    return isTimeValid({ date, visitingHours })
  }

  return (
    <>
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
              {t('logbook:logbook.today_is', { day: getWeekDay(date), time: dateTimeToString(date) })}
            </p>
            <p>
              {t('logbook:logbook.beyond_time')}
            </p>
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
              value={formData.guard ? formData.guard.name : ''}
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
              inputProps={{ "data-testid":"entry_user_name" }}
              required
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
              inputProps={{ "data-testid":"entry_user_nrc" }}
              required
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
              inputProps={{ "data-testid":"entry_user_phone" }}
              required={previousRoute === 'enroll'}
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
              inputProps={{ "data-testid":"entry_user_vehicle" }}
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
              inputProps={{ "data-testid":"entry_user_visit" }}
            >
              <MenuItem value={formData.reason}>
                {
                  (formData.reason && formData.reason === 'other')
                  ? formData.otherReason
                  : t(`logbook:business_reasons.${formData.reason}`)
                }
              </MenuItem>
            </TextField>
          </div>

          <br />
          {/* {Temproal component for temperature} */}

          {previousRoute !== 'enroll' && (
            <CaptureTemp
              refId={id}
              refName={formData.name}
              refType="Logs::EntryRequest"
            />
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
                  {isLoading ? `${t('logbook:logbook.enrolling')} ...` : ` ${t('logbook:logbook.enroll')}` }
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
            <div className="row justify-content-center align-items-center">
              <div className="col">
                <Button
                  variant="contained"
                  onClick={(event) => handleModal(event, 'grant')}
                  className={css(styles.grantButton)}
                  disabled={isLoading}
                  data-testid="entry_user_grant"
                >
                  {isLoading  && modalAction === 'grant' ? `${t('logbook:logbook.granting')} ...` : `${t('logbook:logbook.grant')}`}
                </Button>
              </div>
              <div className="col">
                <Button
                  variant="contained"
                  onClick={handleDenyRequest}
                  className={css(styles.denyButton)}
                  disabled={isLoading}
                  data-testid="entry_user_deny"
                >
                  {t('logbook:logbook.deny')}
                </Button>
              </div>
              <div className="col">
                <a
                  href={`tel:${authState.user.community.securityManager}`}
                  className={` ${css(styles.callButton)}`}
                  data-testid="entry_user_call_mgr"
                >
                  {t('logbook:logbook.call_manager')}
                </a>
              </div>
            </div>
          ) : (
            <span />
          )}
        </form>
      </div>
    </>
  )
}

const styles = StyleSheet.create({
  selectInput: {
    width: '100%'
  },
  grantButton: {
    marginRight: 60,
    backgroundColor: "#4caf50",
    color: "#FFFFFF"
  },
  denyButton: {
    backgroundColor: "#d32f2f",
    color: "#FFFFFF"
  },
  callButton: {
    color: 'rgb(230, 63, 69)',
    textTransform: 'unset',
    textDecoration: 'none'
  }
});
