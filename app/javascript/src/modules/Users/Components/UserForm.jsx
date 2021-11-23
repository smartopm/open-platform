/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { StyleSheet, css } from 'aphrodite';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import { useApolloClient, useLazyQuery, useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-input-2'
import {
  reasons,
  requiredFields,
  userState,
  userSubStatus
} from '../../../utils/constants';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { UserQuery } from '../../../graphql/queries';
import { CreateUserMutation, NonAdminUpdateMutation } from '../../../graphql/mutations';
import { useFileUpload } from '../../../graphql/useFileUpload';
import crudHandler from '../../../graphql/crud_handler';
import Loading from '../../../shared/Loading';
import FormOptionInput, {
  FormOptionWithOwnActions
} from '../../Forms/components/FormOptionInput';
import { saniteError } from '../../../utils/helpers';
import { ModalDialog } from '../../../components/Dialog';
import CenteredContent from '../../../components/CenteredContent';
import { UpdateUserMutation } from '../../../graphql/mutations/user';
import ImageAuth from '../../../shared/ImageAuth';

const initialValues = {
  name: '',
  email: '',
  phoneNumber: '',
  requestReason: '',
  userType: '',
  state: '',
  signedBlobId: '',
  imageUrl: '',
  subStatus: '',
  primaryAddress: '',
  contactInfos: [],
  extRefId: '',
  avatarUrl: ''
};

export function formatContactType(value, type) {
  return { contactType: type, info: value };
}

export default function UserForm({ isEditing, isFromRef, isAdmin }) {
  const { id } = useParams();
  const history = useHistory();
  const { t } = useTranslation('common');
  const authState = React.useContext(AuthStateContext);
  const [data, setData] = React.useState(initialValues);
  const [phoneNumbers, setPhoneNumbers] = React.useState([]);
  const [emails, setEmails] = React.useState([]);
  const [address, setAddress] = React.useState([]);
  const [isModalOpen, setDenyModal] = React.useState(false);
  const [modalAction, setModalAction] = React.useState('grant');
  const [msg, setMsg] = React.useState('');
  const [selectedDate, handleDateChange] = React.useState(null);
  const [showResults, setShowResults] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const { isLoading, error, result, createOrUpdate, loadRecord } = crudHandler({
    typeName: 'user',
    readLazyQuery: useLazyQuery(UserQuery),
    updateMutation: useMutation(isAdmin ? UpdateUserMutation : NonAdminUpdateMutation),
    createMutation: useMutation(CreateUserMutation)
  });
  const { onChange, status, signedBlobId } = useFileUpload({
    client: useApolloClient()
  });
  const [userImage, setUserImage] = React.useState(null);
  const communityRoles = authState?.user?.communityRoles

  function uploadUserImage(image) {
    setUserImage(URL.createObjectURL(image));
    onChange(image);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    const secondaryInfo = {
      phone: phoneNumbers,
      email: emails,
      address
    };
    // if editing then restructure the phoneNumbers and emails
    const phones = phoneNumbers.map(value => formatContactType(value, 'phone'));
    const email = emails.map(value => formatContactType(value, 'email'));
    const homeAddress = address.map(value => formatContactType(value, 'address'));

    const vals = data.contactInfos;
    //  get existing secondaryInfo and add newly created ones with no ids
    vals.push(...phones, ...email, ...homeAddress);

    const values = {
      ...data,
      name: data.name.trim(),
      phoneNumber: data.phoneNumber?.replace(/ /g, ''),
      address: data.primaryAddress,
      avatarBlobId: signedBlobId,
      expiresAt: selectedDate ? new Date(selectedDate).toISOString() : null,
      secondaryInfo: isEditing ? vals : JSON.stringify(secondaryInfo)
    };

    if (isFromRef) {
      setTimeout(() => {
        window.location.reload(false);
      }, 3000);
    }

    createOrUpdate(values)
      // eslint-disable-next-line no-shadow
      .then(({ data }) => {
        setSubmitting(false);
        if (isFromRef) {
          setShowResults(true);
        } else {
          history.push(`/user/${data.result.user.id}`);
        }
      })
      .catch(err => {
        setSubmitting(false);
        setMsg(err.message);
      });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value
    });
  }

  if (id) {
    if (isLoading) {
      return <Loading />;
    }
    if (!result.id && !error) {
      loadRecord({ variables: { id } });
    } else if (!data.dataLoaded && result.id) {
      setData({
        ...result,
        primaryAddress: result.address,
        dataLoaded: true
      });
      handleDateChange(result.expiresAt);
    }
  }
  function handleModal(type) {
    if (type === 'grant') {
      setModalAction('grant');
    } else {
      setModalAction('deny');
    }
    setDenyModal(!isModalOpen);
  }

  function handleModalConfirm() {
    createOrUpdate({
      id: result.id,
      state: modalAction === 'grant' ? 'valid' : 'banned'
    })
      .then(() => {
        setDenyModal(!isModalOpen);
      })
      .then(() => {
        history.push('/pending');
      });
  }
  function handleOptionChange(event, contactId, index) {
    const info = event.target.value;
    const emailRegex = /\S+@\S+\.\S+/;
    const type = emailRegex.test(info);
    const newValue = {
      id: contactId,
      info,
      contactType: type ? 'email' : 'phone'
    };
    const opts = data.contactInfos;
    setData({
      ...data,
      contactInfos: [
        ...opts.slice(0, index),
        { ...opts[parseInt(index, 10)], ...newValue },
        ...opts.slice(index + 1)
      ]
    });
  }

  function handleRemoveOption(index) {
    const values = data.contactInfos;
    values.splice(index, 1);
    setData({
      ...data,
      contactInfos: values
    });
  }

  if (isFromRef) {
    data.userType = 'prospective_client';
  }
  return (
    <div className="container">
      <ModalDialog
        handleClose={handleModal}
        handleConfirm={handleModalConfirm}
        open={isModalOpen}
        imageURL={result.avatarUrl} // TODO: this should be removed
        action={modalAction}
        name={data.name}
      />
      <form onSubmit={handleSubmit}>
        {!isFromRef && (
          <div className="form-group">
            <div style={{ width: 200, height: 'auto' }}>
              {status === 'INIT' && !userImage && data.dataLoaded && (
                <ImageAuth imageLink={data.avatarUrl} />
              )}
            </div>

            {userImage && (
              <img
                src={userImage}
                alt="pic to be uploaded"
                className={`${css(styles.uploadedImage)}`}
              />
            )}
            <div>
              <br />
              <Typography color="primary">
                {
                 status !== 'INIT' && t(`common:upload_state.${status}`)
                }
              </Typography>
              <br />
            </div>
            <div className={`${css(styles.photoUpload)}`}>
              <br />
              <input
                type="file"
                accepts="image/*"
                capture
                id="file"
                onChange={event => uploadUserImage(event.target.files[0])}
                className={`${css(styles.fileInput)}`}
              />
              <PhotoCameraIcon />
              <label htmlFor="file">{t('common:misc.take_photo')}</label>
            </div>
          </div>
        )}

        {isFromRef && (
          <div className="form-group">
            <TextField
              className="form-control"
              label={t('common:form_fields.client_name')}
              type="text"
              onChange={handleInputChange}
              value={authState.user?.name || ''}
              disabled
              name="name"
              inputProps={{ 'data-testid': 'clientName' }}
              required
            />
          </div>
        )}
        <div className="form-group">
          <TextField
            className="form-control"
            label={t('common:form_fields.full_name')}
            type="text"
            onChange={handleInputChange}
            value={data.name || ''}
            name="name"
            inputProps={{ 'data-testid': 'username' }}
            required
          />
        </div>
        <div className="form-group">
          <label className="MuiFormLabel-root MuiInputLabel-shrink MuiInputLabel-root">
            {t('common:form_fields.primary_number')}
            <span
              aria-hidden="true"
              className="MuiFormLabel-asterisk
            MuiInputLabel-asterisk"
            >
              &nbsp;*
            </span>
          </label>
          <PhoneInput
            value={data.phoneNumber || ''}
            inputStyle={{ width: "100%" }}
            enableSearch
            inputProps={{
              name: 'phoneNumber',
              required: true,
              'data-testid': 'primary_phone'
            }}
            placeholder={t('common:form_placeholders.phone_number')}
            onChange={value => setData({...data, phoneNumber: value})}
            preferredCountries={['hn', 'zm', 'ng', 'in', 'us']}
          />
        </div>
        <div className="form-group">
          <TextField
            className="form-control"
            label={t('common:form_fields.primary_email')}
            name="email"
            type="email"
            onChange={handleInputChange}
            value={data.email || ''}
            inputProps={{ 'data-testid': 'email' }}
            disabled={!isFromRef && !isAdmin}
          />
        </div>

        {!isFromRef && (
          <>
            <div className="form-group">
              <TextField
                className="form-control"
                label={t('common:form_fields.external_reference')}
                name="extRefId"
                type="text"
                onChange={handleInputChange}
                value={data.extRefId || ''}
                inputProps={{ 'data-testid': 'ext-ref-id' }}
              />
            </div>
            {data.contactInfos.map((contact, i) => (
              <FormOptionWithOwnActions
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                id={i + 1}
                value={contact.info}
                actions={{
                  handleRemoveOption: () => handleRemoveOption(i),
                  handleOptionChange: event => handleOptionChange(event, contact.id, i)
                }}
              />
            ))}
            <FormOptionInput
              label={t('common:form_fields.secondary_number')}
              options={phoneNumbers}
              setOptions={setPhoneNumbers}
            />

            <FormOptionInput
              label={t('common:form_fields.secondary_email')}
              options={emails}
              setOptions={setEmails}
            />

            <div className="form-group">
              <TextField
                className="form-control"
                label={t('common:form_fields.primary_address')}
                name="primaryAddress"
                type="text"
                onChange={handleInputChange}
                value={data.primaryAddress || ''}
                inputProps={{ 'data-testid': 'address' }}
              />
            </div>

            <FormOptionInput
              label={t('common:form_fields.secondary_address')}
              options={address}
              setOptions={setAddress}
            />
            {isAdmin && (
              <>
                <div className="form-group">
                  <TextField
                    id="reason"
                    select
                    label={t('common:form_fields.reason')}
                    name="requestReason"
                    value={data.requestReason || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    inputProps={{ 'aria-label': 'requestReason' }}
                    className={`${css(styles.selectInput)}`}
                  >
                    {Object.keys(reasons).map(key => (
                      <MenuItem key={key} value={key}>
                        {t(`user_reasons.${key}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="form-group">
                  <TextField
                    id="userType"
                    select
                    label={t('common:form_fields.user_type')}
                    value={data.userType || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    name="userType"
                    inputProps={{ 'aria-label': 'User Type' }}
                    required
                    className={`${css(styles.selectInput)}`}
                  >
                    {communityRoles &&
                    Object.keys(communityRoles).map(key => (
                      <MenuItem key={key} value={key}>
                        {t(`user_types.${key}`)}
                      </MenuItem>
                    ))}

                  </TextField>
                </div>

                <div className="form-group">
                  <TextField
                    id="state"
                    select
                    label={t('common:form_fields.state')}
                    value={data.state || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    name="state"
                    inputProps={{ 'aria-label': 'state' }}
                    className={`${css(styles.selectInput)}`}
                  >
                    {Object.keys(userState).map(key => (
                      <MenuItem key={key} value={key}>
                        {t(`user_states.${key}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="form-group">
                  <TextField
                    id="sub-status"
                    select
                    label={t('common:misc.customer_journey_stage')}
                    value={data.subStatus || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    name="subStatus"
                    inputProps={{ 'aria-label': 'subStatus' }}
                    className={`${css(styles.selectInput)}`}
                  >
                    <MenuItem key="none" value={null}>
                      {t('misc.none')}
                    </MenuItem>
                    {Object.keys(userSubStatus).map(key => (
                      <MenuItem key={key} value={key}>
                        {t(`user_sub_status.${key}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div>
                  <DatePickerDialog
                    selectedDate={selectedDate}
                    label={t('common:misc.expiration_date')}
                    handleDateChange={handleDateChange}
                  />
                </div>
              </>
            )}
            <CenteredContent>
              <Button
                variant="contained"
                type="submit"
                className={`${css(styles.getStartedButton)} enz-lg-btn`}
                disabled={submitting}
                data-testid="submit_btn"
                color="primary"
              >
                {!submitting
                  ? t('common:form_actions.submit')
                  : t('common:form_actions.submitting')}
              </Button>
            </CenteredContent>
          </>
        )}

        {Boolean(msg.length) && !isFromRef && (
          <p className="text-danger text-center">{saniteError(requiredFields, msg)}</p>
        )}
        {isFromRef && (
          <div className="d-flex row justify-content-center">
            <div
              className="col-8 p-0 justify-content-center"
              style={{ width: 256, marginRight: '10%' }}
            >
              <Typography
                color="textSecondary"
                variant="body2"
                style={{ fontSize: 13 }}
                data-testid="referralText"
              >
                {t('common:misc.referral_text', { communityName: authState.user?.community.name })}
              </Typography>
            </div>
            <Button
              variant="contained"
              type="submit"
              className={`${css(styles.getStartedButton)} enz-lg-btn`}
              data-testid="referralBtn"
              color="primary"
            >
              <span>{t('common:misc.refer')}</span>
            </Button>
          </div>
        )}

        {// eslint-disable-next-line no-nested-ternary
        showResults && isFromRef ? (
          <div className="d-flex row justify-content-center">
            <p>{t('common:misc.referral_thanks')}</p>
          </div>
        ) : isFromRef ? (
          Boolean(msg.length) && (
            <p className="text-danger text-center">{saniteError(requiredFields, msg)}</p>
          )
        ) : null
}
      </form>
    </div>
  );
}

const styles = StyleSheet.create({
  getStartedButton: {
    width: '30%',
    height: 51,
    boxShadow: 'none',
    marginTop: 50,
    alignItems: 'center'
  },
  selectInput: {
    width: '100%'
  },
  photoUpload: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    cursor: 'pointer',
    width: '40%'
  },
  idUpload: {
    width: '80%',
    padding: '60px'
  },
  fileInput: {
    width: 0.1,
    height: 0.1,
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
  },
  uploadedImage: {
    width: '40%',
    borderRadius: 8
  }
});

UserForm.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  isFromRef: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired
};
