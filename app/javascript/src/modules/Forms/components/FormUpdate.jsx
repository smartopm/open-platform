/* eslint-disable no-use-before-define */
import React, { Fragment, useRef, useState } from 'react';
import { Button, Container, TextField, Typography } from '@material-ui/core';
import { useApolloClient, useMutation, useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { FormUserQuery, UserFormPropertiesQuery } from '../graphql/forms_queries';
import ErrorPage from '../../../components/Error';
import CenteredContent from '../../../components/CenteredContent';
import { FormUserStatusUpdateMutation, FormUserUpdateMutation } from '../graphql/forms_mutation';
import TextInput from './TextInput';
import { convertBase64ToFile, sortPropertyOrder } from '../../../utils/helpers';
import DialogueBox from '../../../shared/dialogs/DeleteDialogue';
import UploadField from './UploadField';
import SignaturePad from './SignaturePad';
import { useFileUpload } from '../../../graphql/useFileUpload';
import { dateFormatter } from '../../../components/DateContainer';
import { formStatus as updatedFormStatus } from '../../../utils/constants';
import RadioInput from './RadioInput';
import ImageAuth from '../../../shared/ImageAuth';
import Loading from '../../../shared/Loading';
import FormTitle from './FormTitle';

// date
// text input (TextField or TextArea)
// upload
const initialData = {
  fieldType: '',
  fieldName: ' ',
  date: { value: null },
  radio: { value: { label: '', checked: null } },
};

export default function FormUpdate({ formUserId, userId, authState }) {
  const [properties, setProperties] = useState(initialData);
  const [message, setMessage] = useState({ err: false, info: '', signed: false });
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [formAction, setFormAction] = useState('');
  const history = useHistory();
  const signRef = useRef(null);
  const { t } = useTranslation(['form', 'common']);
  // create form user
  const [updateFormUser] = useMutation(FormUserUpdateMutation);
  const [updateFormUserStatus] = useMutation(FormUserStatusUpdateMutation);

  const { data, error, loading } = useQuery(UserFormPropertiesQuery, {
    variables: { userId, formUserId },
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  const formUserData = useQuery(FormUserQuery, {
    variables: { userId, formUserId },
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  });

  const { onChange, status, url, signedBlobId } = useFileUpload({
    client: useApolloClient(),
  });
  const {
    onChange: uploadSignature,
    status: signatureStatus,
    signedBlobId: signatureBlobId,
  } = useFileUpload({
    client: useApolloClient(),
  });

  async function handleSignatureUpload() {
    setMessage({ ...message, signed: true });
    const url64 = signRef.current.toDataURL('image/png');
    // convert the file
    const signature = await convertBase64ToFile(url64);
    await uploadSignature(signature);
  }

  function handleValueChange(event, propId) {
    const { name, value } = event.target;
    setProperties({
      ...properties,
      [name]: { value, form_property_id: propId },
    });
  }

  function handleDateChange(date, id) {
    setProperties({
      ...properties,
      date: { value: date, form_property_id: id },
    });
  }

  function handleRadioValueChange(event, propId, fieldName) {
    const { name, value } = event.target;
    setProperties({
      ...properties,
      [fieldName]: { value: { checked: value, label: name }, form_property_id: propId },
    });
  }

  function handleStatusUpdate(formStatus) {
    updateFormUserStatus({
      variables: {
        formUserId,
        status: formStatus,
      },
    })
      .then(() =>
        setMessage({
          ...message,
          err: false,
          info: t('misc.form_action_success', { status: t(`form_status.${formStatus}`) }),
        })
      )
      .catch((err) => setMessage({ ...message, err: true, info: err.message }));
  }

  function saveFormData() {
    const fileUploadType = data.formUserProperties.filter(
      (item) => item.formProperty.fieldType === 'image'
    )[0];
    const fileSignType = data.formUserProperties.filter(
      (item) => item.formProperty.fieldType === 'signature'
    )[0];

    // get values from properties state
    const formattedProperties = Object.entries(properties).map(([, value]) => value);
    const filledInProperties = formattedProperties.filter(
      (item) => item.value && item.value?.checked !== null && item.form_property_id !== null
    );

    // get signedBlobId as value and attach it to the form_property_id
    if (message.signed && signatureBlobId) {
      const newValue = {
        value: signatureBlobId,
        form_property_id: fileSignType.formProperty.id,
        image_blob_id: signatureBlobId,
      };
      filledInProperties.push(newValue);
    }
    // check if we uploaded then attach the blob id to the newValue
    if (signedBlobId && url) {
      const newValue = {
        value: signedBlobId,
        form_property_id: fileUploadType.formProperty.id,
        image_blob_id: signedBlobId,
      };
      filledInProperties.push(newValue);
    }

    const cleanFormData = JSON.stringify({ user_form_properties: filledInProperties });

    updateFormUser({
      variables: {
        userId,
        formUserId,
        propValues: cleanFormData,
      },
    })
      .then(() => {
        setLoading(false);
        setMessage({
          ...message,
          err: false,
          info: t('misc.form_action_success', { status: 'updated' }),
        });
      })
      .catch((err) => {
        setLoading(false);
        setMessage({ ...message, err: true, info: err.message });
      });
  }

  function handleActionClick(_event, action) {
    _event.preventDefault(); // especially on submission trigger
    setFormAction(action);
    setOpenModal(!openModal);
  }

  function handleAction() {
    // check which button was clicked, pattern matching couldn't work here
    setLoading(!isLoading);
    switch (formAction) {
      case 'update':
        saveFormData();
        break;
      case 'approve':
        handleStatusUpdate('approved');
        break;
      case 'reject':
        handleStatusUpdate('rejected');
        break;
      default:
        break;
    }
    setOpenModal(!openModal);
    // wait a moment and route back where the user came from
    setTimeout(() => {
      setLoading(false);
      history.goBack();
    }, 2000);
  }

  function renderForm(formPropertiesData) {
    const editable = !formPropertiesData.formProperty.adminUse
      ? false
      : !(formPropertiesData.formProperty.adminUse && authState.user.userType === 'admin');
    const fields = {
      text: (
        <TextInput
          id={formPropertiesData.formProperty.id}
          key={formPropertiesData.formProperty.id}
          properties={formPropertiesData.formProperty}
          value={formPropertiesData.value}
          handleValue={(event) => handleValueChange(event, formPropertiesData.formProperty.id)}
          editable={editable}
          name={formPropertiesData.formProperty.fieldName}
        />
      ),
      date: (
        <DatePickerDialog
          key={formPropertiesData.formProperty.id}
          selectedDate={properties.date.value || formPropertiesData.value}
          handleDateChange={(date) => handleDateChange(date, formPropertiesData.formProperty.id)}
          label={formPropertiesData.formProperty.fieldName}
        />
      ),
      image: (
        <div key={formPropertiesData.formProperty.id}>
          {formPropertiesData.imageUrl && (
            <>
              {t('misc.attachments')}
              <br />
              <ImageAuth
                type={formPropertiesData.fileType?.split('/')[0]}
                imageLink={formPropertiesData.imageUrl}
                token={authState.token}
              />
            </>
          )}
          <UploadField
            detail={{ type: 'file', status }}
            key={formPropertiesData.id}
            upload={(evt) => onChange(evt.target.files[0])}
            editable={editable}
          />
        </div>
      ),
      signature: (
        <div key={formPropertiesData.formProperty.id}>
          {formPropertiesData.imageUrl && (
            <>
              {t('misc.signature')}
              <br />
              <ImageAuth imageLink={formPropertiesData.imageUrl} token={authState.token} />
            </>
          )}
          <SignaturePad
            key={formPropertiesData.id}
            detail={{ type: 'signature', status: signatureStatus }}
            signRef={signRef}
            onEnd={() => handleSignatureUpload(formPropertiesData.id)}
          />
        </div>
      ),
      radio: (
        <Fragment key={formPropertiesData.formProperty.id}>
          <br />
          <br />
          <RadioInput
            properties={formPropertiesData}
            value={properties.radio.value.checked}
            handleValue={(event) =>
              handleRadioValueChange(
                event,
                formPropertiesData.formProperty.id,
                formPropertiesData.formProperty.fieldName
              )
            }
          />
          <br />
        </Fragment>
      ),
      dropdown: (
        <TextInput
          id={formPropertiesData.formProperty.id}
          key={formPropertiesData.formProperty.id}
          properties={formPropertiesData.formProperty}
          value={formPropertiesData.value}
          handleValue={(event) => handleValueChange(event, formPropertiesData.formProperty.id)}
          editable={editable}
          name={formPropertiesData.formProperty.fieldName}
        />
      ),
    };
    return fields[formPropertiesData.formProperty.fieldType];
  }

  if (loading || formUserData.loading) return <Loading />;
  if (error || formUserData.error)
    return <ErrorPage title={error?.message || formUserData.error?.message} />;

  return (
    <>
      <Container>
        <FormTitle
          name={formUserData.data?.formUser.form.name}
          description={formUserData.data?.formUser.form.description}
        />
        <form onSubmit={(event) => handleActionClick(event, 'update')}>
          {authState.user.userType === 'admin' && userId && (
            <>
              <TextField
                label={t('form_fields.form_status')}
                value={`${updatedFormStatus[formUserData.data?.formUser.status]} - ${dateFormatter(
                  formUserData.data?.formUser.updatedAt
                )}`}
                disabled
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: '100%' }}
              />
              <TextField
                label={t('form_fields.form_status_updated_by')}
                value={formUserData.data.formUser.statusUpdatedBy.name}
                disabled
                margin="dense"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: '100%' }}
              />
            </>
          )}
          {data?.formUserProperties.sort(sortPropertyOrder).map(renderForm)}
          <br />
          <br />
          <div className="d-flex row justify-content-center">
            <Button
              type="submit"
              color="primary"
              aria-label="form_update"
              variant="outlined"
              disabled={isLoading}
            >
              {t('form_status_actions.update')}
            </Button>
            {authState.user.userType === 'admin' && (
              <>
                <Button
                  variant="contained"
                  onClick={(event) => handleActionClick(event, 'approve')}
                  color="primary"
                  aria-label="form_approve"
                  style={{ marginLeft: '10vw' }}
                  disabled={isLoading}
                >
                  {t('form_status_actions.approved')}
                </Button>
                <Button
                  variant="contained"
                  onClick={(event) => handleActionClick(event, 'reject')}
                  aria-label="form_reject"
                  style={{ marginLeft: '10vw', backgroundColor: '#DC004E', color: '#FFFFFF' }}
                  disabled={isLoading}
                >
                  {t('form_status_actions.rejected')}
                </Button>
              </>
            )}
          </div>

          <br />
          <CenteredContent>
            {Boolean(message.info.length) && (
              <Typography variant="subtitle1" color={message.err ? 'error' : 'primary'}>
                {message.info}
              </Typography>
            )}
          </CenteredContent>
        </form>
      </Container>

      {/* dialog */}
      <DialogueBox
        open={openModal}
        handleClose={handleActionClick}
        handleAction={handleAction}
        title="form"
        action={formAction}
      />
    </>
  );
}

FormUpdate.propTypes = {
  userId: PropTypes.string.isRequired,
  formUserId: PropTypes.string.isRequired,
  authState: PropTypes.shape({
    user: PropTypes.shape({ userType: PropTypes.string }),
    token: PropTypes.string,
  }).isRequired,
};
