/* eslint-disable max-params */
/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { StyleSheet, css } from 'aphrodite';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { useApolloClient, useLazyQuery, useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-input-2';
import {
  reasons,
  requiredFields,
  userState,
  userSubStatus,
  userStatus,
} from '../../../utils/constants';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { UserQuery } from '../../../graphql/queries';
import { CreateUserMutation, NonAdminUpdateMutation } from '../../../graphql/mutations';
import useFileUpload from '../../../graphql/useFileUpload';
import crudHandler from '../../../graphql/crud_handler';
import { Spinner } from '../../../shared/Loading';
import FormOptionInput, { FormOptionWithOwnActions } from '../../Forms/components/FormOptionInput';
import { saniteError, validateEmail, extractCountry } from '../../../utils/helpers';
import { ModalDialog } from '../../../components/Dialog';
import CenteredContent from '../../../shared/CenteredContent';
import { UpdateUserMutation } from '../../../graphql/mutations/user';
import ImageAuth from '../../../shared/ImageAuth';
import PageWrapper from '../../../shared/PageWrapper';

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
  avatarUrl: '',
  status: '',
};

export function formatContactType(value, type) {
  return { contactType: type, info: value };
}

export default function UserForm({ isEditing, isFromRef, isAdminOrMarketingAdmin }) {
  const { id } = useParams();
  const history = useHistory();
  const { t } = useTranslation('common');
  const authState = React.useContext(AuthStateContext);
  const [data, setData] = React.useState(initialValues);
  const [phoneNumbers, setPhoneNumbers] = React.useState([]);
  const [emails, setEmails] = React.useState([]);
  const [address, setAddress] = React.useState([]);
  const [isModalOpen, setDenyModal] = React.useState(false);
  const [emailError, setEmailValidationError] = React.useState(null);
  const [modalAction, setModalAction] = React.useState('grant');
  const [msg, setMsg] = React.useState('');
  const [selectedDate, handleDateChange] = React.useState(null);
  const [showResults, setShowResults] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const { isLoading, error, result, createOrUpdate, loadRecord } = crudHandler({
    typeName: 'user',
    readLazyQuery: useLazyQuery(UserQuery),
    updateMutation: useMutation(
      isAdminOrMarketingAdmin ? UpdateUserMutation : NonAdminUpdateMutation
    ),
    createMutation: useMutation(CreateUserMutation),
  });
  const { onChange, status, signedBlobId } = useFileUpload({
    client: useApolloClient(),
  });
  const [userImage, setUserImage] = React.useState(null);

  const communityRoles =
    authState?.user?.community?.name === 'Tilisi'
      ? authState?.user?.community?.roles.filter(e => e !== 'client')
      : authState?.user?.community?.roles;

  function uploadUserImage(image) {
    setUserImage(URL.createObjectURL(image));
    onChange(image, { maxWidthOrHeight: 224 })
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (data.email && !validateEmail(data.email)) {
      setEmailValidationError(t('common:errors.invalid_email'));
      return;
    }
    setSubmitting(true);
    const secondaryInfo = {
      phone: phoneNumbers,
      email: emails,
      address,
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
      secondaryInfo: isEditing ? vals : JSON.stringify(secondaryInfo),
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

  if (id) {
    if (isLoading) {
      return <Spinner />;
    }
    if (!result.id && !error) {
      loadRecord({ variables: { id } });
    } else if (!data.dataLoaded && result.id) {
      setData({
        ...result,
        primaryAddress: result.address,
        dataLoaded: true,
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
      state: modalAction === 'grant' ? 'valid' : 'banned',
    })
      .then(() => {
        setDenyModal(!isModalOpen);
      })
      .then(() => {
        history.push('/pending');
      });
  }

  const phoneContactInfos = data?.contactInfos?.filter(c => c.contactType === 'phone');
  const emailContactInfos = data?.contactInfos?.filter(c => c.contactType === 'email');
  const addressContactInfos = data?.contactInfos?.filter(c => c.contactType === 'address');

  function changeOptionAndUpdate(index, value, optionsToUpdate, rest) {
    const newValue = [...optionsToUpdate];
    newValue[Number(index)].info = value;
    setData({
      ...data,
      contactInfos: [...newValue, ...rest],
    });
  }

  function handleOptionChange(event, index, type) {
    const { value } = event.target;

    if (type === 'phone') {
      changeOptionAndUpdate(index, value, phoneContactInfos, [
        ...emailContactInfos,
        ...addressContactInfos,
      ]);
      return;
    }

    if (type === 'email') {
      changeOptionAndUpdate(index, value, emailContactInfos, [
        ...phoneContactInfos,
        ...addressContactInfos,
      ]);
      return;
    }

    if (type === 'address') {
      changeOptionAndUpdate(index, value, addressContactInfos, [
        ...phoneContactInfos,
        ...emailContactInfos,
      ]);
    }
  }

  function removeOptionAndUpdate(index, optionsToUpdate, rest) {
    optionsToUpdate.splice(index, 1);
    setData({
      ...data,
      contactInfos: [...optionsToUpdate, ...rest],
    });
  }

  function handleRemoveOption(index, type) {
    if (type === 'phone') {
      removeOptionAndUpdate(index, phoneContactInfos, [
        ...emailContactInfos,
        ...addressContactInfos,
      ]);
      return;
    }

    if (type === 'email') {
      removeOptionAndUpdate(index, emailContactInfos, [
        ...phoneContactInfos,
        ...addressContactInfos,
      ]);
      return;
    }

    if (type === 'address') {
      removeOptionAndUpdate(index, addressContactInfos, [
        ...phoneContactInfos,
        ...emailContactInfos,
      ]);
    }
  }

  if (isFromRef) {
    data.userType = 'prospective_client';
  }

  return (
    <PageWrapper
      oneCol={isFromRef}
      pageTitle={isFromRef ? t('common:misc.referrals') : t('menu.user_edit')}
    >
      <ModalDialog
        handleClose={handleModal}
        handleConfirm={handleModalConfirm}
        open={isModalOpen}
        action={modalAction}
        name={data.name}
      />
      <form onSubmit={handleSubmit} data-testid="submit-form">
        {!isFromRef && (
          <div className="form-group">
            <div style={{ width: 200, height: 'auto' }}>
              {status === 'INIT' && !userImage && data.avatarUrl && (
                // Here we only display uploaded avatar
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
              <Typography color="primary">
                {status !== 'INIT' && t(`common:upload_state.${status}`)}
              </Typography>
            </div>
            <div>
              <label htmlFor="file" className={`${css(styles.photoUpload)}`}>
                <span>
                  <PhotoCameraIcon className={css(styles.uploadIcon)} />
                  <br />
                  <span>{t('common:misc.take_photo')}</span>
                </span>
                <input
                  type="file"
                  accepts="image/*"
                  capture
                  id="file"
                  onChange={event => uploadUserImage(event.target.files[0])}
                  className={`${css(styles.fileInput)}`}
                />
              </label>
            </div>
          </div>
        )}

        {isFromRef && (
          <Typography variant="body2" style={{ marginBottom: 15 }} data-testid="referralText">
            {t('common:misc.referral_text', { communityName: authState.user?.community.name })}
          </Typography>
        )}
        <div className="form-group">
          <TextField
            fullWidth
            label={
              isFromRef
                ? t('common:form_fields.friends_full_name')
                : t('common:form_fields.full_name')
            }
            type="text"
            onChange={event => setData({ ...data, name: event.target.value })}
            value={data.name || ''}
            name="name"
            inputProps={{ 'data-testid': 'username' }}
            required
          />
        </div>
        <div className="form-group">
          <label className="MuiFormLabel-root MuiInputLabel-shrink MuiInputLabel-root">
            {isFromRef
              ? t('common:form_fields.phone_number')
              : t('common:form_fields.primary_number')}
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
            inputStyle={{ width: '100%', height: '3.5em' }}
            enableSearch
            inputProps={{
              name: 'phoneNumber',
              required: true,
              'data-testid': 'primary_phone',
            }}
            country={extractCountry(authState?.user?.community?.locale)}
            placeholder={t('common:form_placeholders.phone_number')}
            onChange={value => setData({ ...data, phoneNumber: value })}
            preferredCountries={['hn', 'zm', 'ng', 'in', 'us']}
          />
        </div>
        <div className="form-group">
          <TextField
            fullWidth
            label={
              isFromRef
                ? t('common:form_fields.email_address')
                : t('common:form_fields.primary_email')
            }
            name="email"
            type="email"
            onChange={event => setData({ ...data, email: event.target.value })}
            value={data.email || ''}
            inputProps={{ 'data-testid': 'email' }}
            disabled={!isFromRef && !isAdminOrMarketingAdmin}
            error={!!emailError}
            helperText={emailError}
          />
        </div>

        {!isFromRef && (
          <>
            <div className="form-group">
              <TextField
                fullWidth
                label={t('common:form_fields.external_reference')}
                name="extRefId"
                type="text"
                onChange={event => setData({ ...data, extRefId: event.target.value })}
                value={data.extRefId || ''}
                inputProps={{ 'data-testid': 'ext-ref-id' }}
              />
            </div>

            {phoneContactInfos.length > 0 && (
              <div>
                <Typography align="center" variant="caption">
                  {t('common:form_fields.secondary_number')}
                </Typography>
                <FormOptionWithOwnActions
                  options={phoneContactInfos}
                  actions={{
                    handleRemoveOption: i => handleRemoveOption(i, 'phone'),
                    handleOptionChange: (event, index) => handleOptionChange(event, index, 'phone'),
                  }}
                />
              </div>
            )}

            <FormOptionInput
              label={t('common:form_fields.secondary_number')}
              options={phoneNumbers}
              setOptions={setPhoneNumbers}
            />
            {emailContactInfos.length > 0 && (
              <div>
                <Typography align="center" variant="caption">
                  {t('common:form_fields.secondary_email')}
                </Typography>
                <FormOptionWithOwnActions
                  options={emailContactInfos}
                  actions={{
                    handleRemoveOption: i => handleRemoveOption(i, 'email'),
                    handleOptionChange: (event, index) => handleOptionChange(event, index, 'email'),
                  }}
                />
              </div>
            )}

            <FormOptionInput
              label={t('common:form_fields.secondary_email')}
              options={emails}
              setOptions={setEmails}
            />

            <div className="form-group">
              <TextField
                fullWidth
                label={t('common:form_fields.primary_address')}
                name="primaryAddress"
                type="text"
                onChange={event => setData({ ...data, primaryAddress: event.target.value })}
                value={data.primaryAddress || ''}
                inputProps={{ 'data-testid': 'address' }}
              />
            </div>

            {addressContactInfos.length > 0 && (
              <div>
                <Typography align="center" variant="caption">
                  {t('common:form_fields.secondary_address')}
                </Typography>
                <FormOptionWithOwnActions
                  options={addressContactInfos}
                  actions={{
                    handleRemoveOption: i => handleRemoveOption(i, 'address'),
                    handleOptionChange: (event, index) =>
                      handleOptionChange(event, index, 'address'),
                  }}
                />
              </div>
            )}

            <FormOptionInput
              label={t('common:form_fields.secondary_address')}
              options={address}
              setOptions={setAddress}
            />
            {isAdminOrMarketingAdmin && (
              <>
                <div className="form-group">
                  <TextField
                    id="reason"
                    select
                    label={t('common:form_fields.reason')}
                    name="requestReason"
                    value={data.requestReason || ''}
                    onChange={event => setData({ ...data, requestReason: event.target.value })}
                    margin="normal"
                    inputProps={{ 'aria-label': 'requestReason' }}
                    className={`${css(styles.selectInput)}`}
                  >
                    <MenuItem value="" />
                    {Object.keys(reasons).map(key => (
                      <MenuItem key={key} value={key}>
                        {t(`user_reasons.${key}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="form-group">
                  {communityRoles && (
                    <TextField
                      id="userType"
                      select
                      label={t('common:form_fields.user_type')}
                      value={data.userType || ''}
                      onChange={event => setData({ ...data, userType: event.target.value })}
                      margin="normal"
                      name="userType"
                      inputProps={{ 'aria-label': 'User Type' }}
                      required
                      className={`${css(styles.selectInput)}`}
                    >
                      <MenuItem value="" />
                      {communityRoles.map(key => (
                        <MenuItem key={key} value={key}>
                          {t(`user_types.${key}`)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </div>

                <div className="form-group">
                  <TextField
                    id="state"
                    select
                    label={t('common:form_fields.state')}
                    value={data.state || ''}
                    onChange={event => setData({ ...data, state: event.target.value })}
                    margin="normal"
                    name="state"
                    inputProps={{ 'aria-label': 'state' }}
                    className={`${css(styles.selectInput)}`}
                  >
                    <MenuItem value="" />
                    {Object.keys(userState).map(key => (
                      <MenuItem key={key} value={key}>
                        {t(`user_states.${key}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="form-group">
                  <TextField
                    id="status"
                    select
                    label={t('common:form_fields.status')}
                    value={data.status || ''}
                    onChange={event => setData({ ...data, status: event.target.value })}
                    margin="normal"
                    name="status"
                    inputProps={{ 'aria-label': 'status' }}
                    className={`${css(styles.selectInput)}`}
                  >
                    <MenuItem value="" />
                    {Object.keys(userStatus).map(key => (
                      <MenuItem key={key} value={key}>
                        {t(`user_status.${key}`)}
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
                    onChange={event => setData({ ...data, subStatus: event.target.value })}
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
                    t={t}
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
            <Button
              variant="contained"
              type="submit"
              className={`${css(styles.getStartedButton)} enz-lg-btn`}
              data-testid="referralBtn"
              color="primary"
              disabled={submitting}
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
        ) : null}
      </form>
    </PageWrapper>
  );
}

const styles = StyleSheet.create({
  getStartedButton: {
    width: '30%',
    height: 51,
    boxShadow: 'none',
    marginTop: 50,
    alignItems: 'center',
    color: '#FFFFFF',
  },
  selectInput: {
    width: '100%',
  },
  photoUpload: {
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
  },
  fileInput: {
    width: '40%',
    height: 0.1,
    opacity: 0,
    overflow: 'hidden',
    position: 'absolute',
    zIndex: -1,
  },
  uploadedImage: {
    width: '35%',
    borderRadius: 8,
  },
  uploadIcon: {
    marginTop: 3,
    marginLeft: '40%',
  },
});

UserForm.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  isFromRef: PropTypes.bool.isRequired,
  isAdminOrMarketingAdmin: PropTypes.bool.isRequired,
};
