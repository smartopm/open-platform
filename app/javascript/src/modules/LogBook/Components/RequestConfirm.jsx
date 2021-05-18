/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { Fragment, useState } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { TextField, MenuItem, Button } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import { useTranslation } from 'react-i18next';
import { EntryRequestQuery } from '../../../graphql/queries';
import { AcknowledgeRequest, CreateNote } from '../../../graphql/mutations';
import Loading from '../../../shared/Loading';
import { ModalDialog } from '../../../components/Dialog';
import { dateTimeToString, dateToString } from '../../../components/DateContainer';

export default function RequestConfirm({ match, history }) {
  const { loading, data } = useQuery(EntryRequestQuery, {
    variables: { id: match.params.id }
  });
  const [acknowledgeRequest] = useMutation(AcknowledgeRequest);
  const [noteCreate, { loading: mutationLoading }] = useMutation(CreateNote);
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  const [isModalOpen, setModal] = useState(false);
  const [modalAction, setModalAction] = useState('flag');
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    nrc: '',
    vehiclePlate: '',
    reason: '',
    loaded: false
  });
  const { t } = useTranslation(['common', 'logbook'])

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

  function handleAcknowledgeRequest() {
    setLoading(true);
    acknowledgeRequest({
      variables: { id: match.params.id }
    })
      .then(() => {
        setLoading(false);
        history.push('/entry_logs');
      })
      .catch(error => {
        setLoading(false);
        setMessage(error.message);
      });
  }

  function handleModal() {
    setModalAction('flag');
    setModal(!isModalOpen);
  }

  function handleNoteChange(event) {
    setNote(event.target.value);
  }

  function flagNote() {
    // create a flagged todo note here
    noteCreate({
      variables: { userId: formData.guard.id, body: note, flagged: true }
    })
      .then(() => {
        setModal(!isModalOpen);
        history.push('/entry_logs');
      })
      .catch(error => {
        setMessage(error.message);
        setModal(!isModalOpen);
      });
  }

  return (
    <>
      <ModalDialog
        handleClose={handleModal}
        handleConfirm={flagNote}
        open={isModalOpen}
        action={modalAction}
        name={formData.name}
      >
        {modalAction === 'flag' && (
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              value={note}
              onChange={handleNoteChange}
              name="note"
              placeholder={t('form_placeholders.action_note')}
            />
            {mutationLoading && <p className="text-center">{t('form_actions.saving')}</p>}
          </div>
        )}
      </ModalDialog>
      <div className="container">
        <form>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="date">
              {t('logbook:logbook.date_time_submitted')}
            </label>
            <input
              className="form-control"
              type="text"
              value={
                formData.guard
                  ? `${dateToString(formData.createdAt)} at ${dateTimeToString(
                      new Date(formData.createdAt)
                    )}`
                  : ''
              }
              disabled
              name="date"
            />
          </div>

          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              {t('logbook:logbook.guard')}
            </label>
            <input
              className="form-control"
              type="text"
              value={formData.guard ? formData.guard.name : ''}
              disabled
              name="name"
            />
          </div>

          <div className="form-group">
            <label className="bmd-label-static" htmlFor="_name">
              {t('common.form_fields.full_name')}
            </label>

            <input
              className="form-control"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              name="name"
              disabled
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="nrc">
              {t('common.form_fields.nrc')}
            </label>
            <input
              className="form-control"
              type="text"
              value={formData.nrc || ''}
              onChange={handleInputChange}
              name="nrc"
              disabled
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="phoneNumber">
              {t('common.form_fields.phone_number')}
            </label>
            <input
              className="form-control"
              type="text"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
              name="phoneNumber"
              disabled
            />
          </div>
          <div className="form-group">
            <label className="bmd-label-static" htmlFor="vehicle">
              VEHICLE PLATE N&#176;
              {t('common.form_fields.vehicle_plate_number')}
            </label>
            <input
              className="form-control"
              type="text"
              onChange={handleInputChange}
              value={formData.vehiclePlate || ''}
              name="vehiclePlate"
              disabled
            />
          </div>
          <div className="form-group">
            <TextField
              id="reason"
              select
              label={t('common.form_fields.reason')}
              name="reason"
              value={formData.reason || ''}
              onChange={handleInputChange}
              disabled
              className={`${css(styles.selectInput)}`}
            >
              <MenuItem value={formData.reason}>{formData.reason}</MenuItem>
            </TextField>
          </div>
          <div className="row justify-content-center align-items-center">
            <div className="col">
              <Button
                variant="contained"
                onClick={handleAcknowledgeRequest}
                className={`btn ${css(styles.grantButton)}`}
                disabled={isLoading}
              >
                {isLoading ? t('common.misc.loading') : t('common.misc.acknowledge')}
              </Button>
            </div>
            <div className="col">
              <Button
                variant="contained"
                onClick={handleModal}
                className={`btn  ${css(styles.denyButton)}`}
                disabled={isLoading}
              >
                { t('common.misc.flag')}
              </Button>
            </div>
            <div className="col">
              <a
                href={`tel:${formData.guard && formData.guard.phoneNumber}`}
                className={` ${css(styles.callButton)}`}
              >
                {t('common.misc.call')}
                {formData.guard && formData.guard.name}
              </a>
            </div>
          </div>
        </form>
        <br />
        {Boolean(message.length) && <p className="text-center text-danger">{message}</p>}
      </div>
    </>
  );
}

const styles = StyleSheet.create({
  logButton: {
    backgroundColor: '#69ABA4',
    color: '#FFF',
    width: '75%',
    boxShadow: 'none'
  },
  selectInput: {
    width: '100%'
  },
  grantButton: {
    backgroundColor: '#69ABA4',
    color: '#FFF',
    marginRight: 60
    // width: "35%"
  },
  denyButton: {
    // backgroundColor: "rgb(230, 63, 69)",
    backgroundColor: 'rgb(38, 38, 38)',
    color: '#FFF'
    // width: "35%"
  },
  callButton: {
    color: 'rgb(230, 63, 69)',
    textTransform: 'unset',
    textDecoration: 'none'
  }
});
