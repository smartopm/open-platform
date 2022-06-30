/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable no-use-before-define */
/* eslint-disable security/detect-object-injection */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Button, Grid, Divider, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useApolloClient, useMutation, useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import DatePickerDialog, {
  DateAndTimePickers,
  ThemedTimePicker
} from '../../../components/DatePickerDialog';
import { FormUserQuery, UserFormPropertiesQuery } from '../graphql/forms_queries';
import { FormUserStatusUpdateMutation, FormUserUpdateMutation } from '../graphql/forms_mutation';
import TextInput from './FormProperties/TextInput';
import {
  convertBase64ToFile,
  sortPropertyOrder,
  objectAccessor,
  secureFileDownload,
  formatError
} from '../../../utils/helpers';
import DialogueBox from '../../../shared/dialogs/DeleteDialogue';
import UploadField from './FormProperties/UploadField';
import SignaturePad from './FormProperties/SignaturePad';
import useFileUpload from '../../../graphql/useFileUpload';
import RadioInput from './FormProperties/RadioInput';
import ImageAuth from '../../../shared/ImageAuth';
import { Spinner } from '../../../shared/Loading';
import FormTitle from './FormTitle';
import CheckboxInput from './FormProperties/CheckboxInput';
import ListWrapper from '../../../shared/ListWrapper';
import CategoryItem from './Category/CategoryItem';
import MessageAlert from '../../../components/MessageAlert';
import SubmittedFileItem from '../../../shared/imageUpload/SubmittedFileItem';
import { handleFileSelect, handleFileUpload, removeBeforeUpload, isUploaded } from '../utils';
import UploadFileItem from '../../../shared/imageUpload/UploadFileItem';
import TermsAndCondition from './TermsAndCondition';
import PaymentInput from './FormProperties/PaymentInput';
import { currencies } from '../../../utils/constants';
import CenteredContent from '../../../shared/CenteredContent';

// date
// text input (TextField or TextArea)
// upload
const initialData = {
  fieldType: '',
  fieldName: ' ',
  date: { value: null },
  radio: { value: { label: '', checked: null } }
};

export default function FormUpdate({ formUserId, userId, authState, categoriesData }) {
  const state = {
    isSubmitting: false,
    isUploading: false,
    currentPropId: '',
    previewable: false,
    currentFileNames: []
  };
  const [imgUploadError, setImgUploadError] = useState(false);
  const [properties, setProperties] = useState(initialData);
  const [message, setMessage] = useState({ err: false, info: '', signed: false });
  const [messageAlert, setMessageAlert] = useState('');
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [formAction, setFormAction] = useState('');
  const [filesToUpload, setFilesToUpload] = useState([]);
  const history = useHistory();
  const signRef = useRef(null);
  const { t } = useTranslation(['form', 'common']);
  const classes = useStyles();
  // create form user
  const [updateFormUser] = useMutation(FormUserUpdateMutation);
  const [updateFormUserStatus] = useMutation(FormUserStatusUpdateMutation);
  const [formState, setFormState] = useState(state);
  const matches = useMediaQuery('(max-width:900px)');
  const communityCurrency = objectAccessor(currencies, authState.user?.community?.currency) || '';

  const { data, error, loading } = useQuery(UserFormPropertiesQuery, {
    variables: { userId, formUserId },
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  });

  const formUserData = useQuery(FormUserQuery, {
    variables: { userId, formUserId },
    fetchPolicy: 'network-only',
    errorPolicy: 'all'
  });

  const { status, url, signedBlobId, contentType, startUpload, filename } = useFileUpload({
    client: useApolloClient()
  });
  const {
    onChange: uploadSignature,
    status: signatureStatus,
    signedBlobId: signatureBlobId
  } = useFileUpload({
    client: useApolloClient()
  });

  function createPropertyObj(propertyId) {
    return {
      filesToUpload,
      setFilesToUpload,
      propertyId,
      setMessageAlert,
      setIsSuccessAlert
    };
  }

  function handleSelectObject(propertyId) {
    return {
      setMessageAlert,
      setIsSuccessAlert,
      setFormState,
      formState,
      propertyId,
      startUpload
    };
  }

  function removeUploadObject() {
    return {
      uploadedImages,
      setUploadedImages,
      formState,
      setFormState,
      filesToUpload,
      setFilesToUpload
    };
  }

  useEffect(() => {
    const checkboxProperties = data?.formUserProperties?.filter(
      prop => prop.formProperty.fieldType === 'checkbox'
    );
    checkboxProperties?.forEach(checkboxProp => {
      setProperties({
        ...properties,
        [checkboxProp.formProperty.fieldName]: {
          value: JSON.parse(checkboxProp.value?.replace(/=>/g, ':') || '{}'),
          form_property_id: checkboxProp.formProperty.id
        }
      });
    });
  }, [data]);

  useEffect(() => {
    if (status === 'DONE' && formState.currentPropId) {
      setFormState({
        ...formState,
        isUploading: false,
        currentFileNames: [...formState.currentFileNames, `${filename}${formState.currentPropId}`]
      });
      setUploadedImages([
        ...uploadedImages,
        { blobId: signedBlobId, propertyId: formState.currentPropId, contentType, url, filename }
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

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
      [name]: { value, form_property_id: propId }
    });
  }

  function handleCheckboxSelect(event, propId, fieldName) {
    const { name, checked } = event.target;
    setProperties({
      ...properties,
      [fieldName]: {
        value: { ...objectAccessor(properties, fieldName)?.value, [name]: checked },
        form_property_id: propId
      }
    });
  }

  function handleDateChange(date, id, name) {
    setProperties({
      ...properties,
      [name]: { value: date, form_property_id: id }
    });
  }

  function handleRadioValueChange(event, propId, fieldName) {
    const { name, value } = event.target;
    setProperties({
      ...properties,
      [fieldName]: { value: { checked: value, label: name }, form_property_id: propId }
    });
  }

  function handleStatusUpdate(formStatus) {
    updateFormUserStatus({
      variables: {
        formUserId,
        status: formStatus
      }
    })
      .then(() =>
        setMessage({
          ...message,
          err: false,
          info: t('misc.form_action_success', { status: t(`form_status.${formStatus}`) })
        })
      )
      .catch(err => setMessage({ ...message, err: true, info: err.message }));
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
    setImgUploadError('');
  }

  function saveFormData() {
    const fileSignType = data.formUserProperties.filter(
      item => item.formProperty.fieldType === 'signature'
    )[0];

    // get values from properties state
    const formattedProperties = Object.entries(properties).map(([, value]) => value);
    const filledInProperties = formattedProperties.filter(
      item => item.value && item.value?.checked !== null && item.form_property_id !== null
    );

    // get signedBlobId as value and attach it to the form_property_id
    if (message.signed && signatureBlobId) {
      const newValue = {
        value: signatureBlobId,
        form_property_id: fileSignType.formProperty.id,
        image_blob_id: signatureBlobId
      };
      filledInProperties.push(newValue);
    }

    if (uploadedImages.length > 0) {
      uploadedImages.forEach(upload => {
        filledInProperties.push({
          value: upload.blobId,
          form_property_id: upload.propertyId,
          image_blob_id: upload.blobId
        });
      });
    }

    const cleanFormData = JSON.stringify({ user_form_properties: filledInProperties });

    updateFormUser({
      variables: {
        userId,
        formUserId,
        propValues: cleanFormData
      }
    })
      .then(() => {
        setLoading(false);
        setMessage({
          ...message,
          err: false,
          info: t('misc.form_action_success', { status: 'updated' })
        });
      })
      .catch(err => {
        setLoading(false);
        setMessage({ ...message, err: true, info: err.message });
      });
  }

  function handleActionClick(_event, action) {
    _event.preventDefault(); // especially on submission trigger
    if (filesToUpload.length !== uploadedImages.length) {
      return setImgUploadError(true);
    }
    setFormAction(action);
    setOpenModal(!openModal);
    return true
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
    return true;
  }

  function downloadFile(event, path) {
    event.preventDefault();
    secureFileDownload(path);
  }

  function renderForm(formPropertiesData) {
    const editable = !formPropertiesData.formProperty.adminUse
      ? false
      : !(formPropertiesData.formProperty.adminUse && authState.user.userType === 'admin');

    const uploadedFile = uploadedImages.find(
      im => im.propertyId === formPropertiesData.formProperty.id
    );
    const fields = {
      text: (
        <ListWrapper className={classes.space} key={formPropertiesData.formProperty.id}>
          <TextInput
            id={formPropertiesData.formProperty.id}
            properties={formPropertiesData.formProperty}
            value={formPropertiesData.value}
            handleValue={event => handleValueChange(event, formPropertiesData.formProperty.id)}
            editable={editable}
            name={formPropertiesData.formProperty.fieldName}
          />
        </ListWrapper>
      ),
      date: (
        <DatePickerDialog
          key={formPropertiesData.formProperty.id}
          textFieldStyle={{
            background: '#F5F5F4',
            padding: '10px 15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}
          inputVariant="outlined"
          selectedDate={
            objectAccessor(properties, formPropertiesData.formProperty.fieldName)?.value ||
            formPropertiesData.value
          }
          handleDateChange={date =>
            handleDateChange(
              date,
              formPropertiesData.formProperty.id,
              formPropertiesData.formProperty.fieldName
            )
          }
          label={formPropertiesData.formProperty.fieldName}
        />
      ),
      time: (
        <ThemedTimePicker
          key={formPropertiesData.formProperty.id}
          textFieldStyle={{
            background: '#F5F5F4',
            padding: '10px 15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}
          inputVariant="outlined"
          time={
            objectAccessor(properties, formPropertiesData.formProperty.fieldName)?.value ||
            formPropertiesData.value
          }
          handleTimeChange={date =>
            handleDateChange(
              date,
              formPropertiesData.formProperty.id,
              formPropertiesData.formProperty.fieldName
            )
          }
          label={formPropertiesData.formProperty.fieldName}
          style={{ width: '100%' }}
        />
      ),
      datetime: (
        <DateAndTimePickers
          key={formPropertiesData.formProperty.id}
          textFieldStyle={{
            background: '#F5F5F4',
            padding: '10px 15px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}
          inputVariant="outlined"
          selectedDateTime={
            objectAccessor(properties, formPropertiesData.formProperty.fieldName)?.value ||
            formPropertiesData.value
          }
          handleDateChange={date =>
            handleDateChange(
              date,
              formPropertiesData.formProperty.id,
              formPropertiesData.formProperty.fieldName
            )
          }
          label={formPropertiesData.formProperty.fieldName}
        />
      ),
      file_upload: (
        <div key={formPropertiesData.formProperty.id}>
          <MessageAlert
            type={!isSuccessAlert || imgUploadError ? 'error' : 'success'}
            message={
              messageAlert || (
                <div>
                  <Typography variant="body1">{t('misc.upload_error')}</Typography>
                  {' '}
                  <Typography variant="body2">{t('misc.upload_error_content_one')}</Typography>
                  <Typography variant="body2">{t('misc.upload_error_content_two')}</Typography>
                  <Typography variant="body2">
                    {t('misc.upload_error_content_three')}
                  </Typography>
                  <Typography variant="body2">
                    {t('misc.upload_error_content_four')}
                  </Typography>
                </div>
              )
            }
            open={!!messageAlert || imgUploadError}
            handleClose={handleMessageAlertClose}
          />
          <Grid
            container
            direction="row"
            spacing={1}
            alignItems="flex-start"
            className={classes.fileUploadField}
          >
            <Grid item md={12} xs={12}>
              <div>
                {formPropertiesData.attachments?.length ? (
                  formPropertiesData.attachments.map(attachment => (
                    <ListWrapper className={classes.space} key={attachment.id}>
                      <SubmittedFileItem
                        attachment={attachment}
                        translate={t}
                        downloadFile={downloadFile}
                        classes={classes}
                        legacyFile={formPropertiesData}
                      />
                    </ListWrapper>
                  ))
                ) : (
                  <ListWrapper className={classes.space}>
                    <SubmittedFileItem
                      translate={t}
                      downloadFile={downloadFile}
                      classes={classes}
                      legacyFile={formPropertiesData}
                    />
                  </ListWrapper>
                )}
              </div>
            </Grid>
            <ListWrapper className={classes.space} key={formPropertiesData.id}>
              <UploadField
                detail={{
                  type: 'file',
                  status,
                  id: formPropertiesData.formProperty.id,
                  label: formPropertiesData.formProperty.fieldName,
                  required: formPropertiesData.formProperty.required,
                  fileCount: uploadedImages.filter(
                    file => file.propertyId === formPropertiesData.formProperty.id
                  ).length,
                  currentPropId: formState.currentPropId
                }}
                upload={evt =>
                  handleFileSelect(evt, createPropertyObj(formPropertiesData.formProperty.id), t)
                }
                uploaded={!!uploadedFile}
                editable={editable}
                showDetails
                btnColor="primary"
              />
            </ListWrapper>
            {filesToUpload
              .filter(file => file.propertyId === formPropertiesData.formProperty.id)
              .map(file => (
                <UploadFileItem
                  file={file}
                  formPropertyId={formPropertiesData.formProperty.id}
                  handleUpload={() =>
                    handleFileUpload(
                      file,
                      handleSelectObject(formPropertiesData.formProperty.id),
                      t
                    )
                  }
                  handleRemoveFile={removeBeforeUpload}
                  formState={{ ...formState, uploaded: uploadedImages }}
                  isUploaded={isUploaded(uploadedImages, file, formPropertiesData.formProperty.id)}
                  key={file.fileNameId}
                  translate={t}
                  removeUploadObject={removeUploadObject}
                />
              ))}
          </Grid>
        </div>
      ),
      signature: (
        <div key={formPropertiesData.formProperty.id}>
          {formPropertiesData.imageUrl && (
            <>
              <Typography variant="caption">{t('misc.signature')}</Typography>
              <br />
              <ImageAuth imageLink={formPropertiesData.imageUrl} auth />
            </>
          )}
          <ListWrapper className={classes.space}>
            <SignaturePad
              key={formPropertiesData.id}
              detail={{ type: 'signature', status: signatureStatus }}
              signRef={signRef}
              onEnd={() => handleSignatureUpload(formPropertiesData.id)}
            />
          </ListWrapper>
        </div>
      ),
      radio: (
        <ListWrapper key={formPropertiesData.formProperty.id} className={classes.space}>
          <br />
          <RadioInput
            properties={formPropertiesData}
            value={properties.radio.value.checked}
            handleValue={event =>
              handleRadioValueChange(
                event,
                formPropertiesData.formProperty.id,
                formPropertiesData.formProperty.fieldName
              )
            }
          />
          <br />
        </ListWrapper>
      ),
      checkbox: (
        <ListWrapper key={formPropertiesData.formProperty.id} className={classes.space}>
          <br />
          <CheckboxInput
            properties={formPropertiesData}
            checkboxState={objectAccessor(properties, formPropertiesData.formProperty.fieldName)}
            handleValue={event =>
              handleCheckboxSelect(
                event,
                formPropertiesData.formProperty.id,
                formPropertiesData.formProperty.fieldName
              )
            }
          />
          <br />
        </ListWrapper>
      ),
      dropdown: (
        <ListWrapper className={classes.space} key={formPropertiesData.formProperty.id}>
          <TextInput
            id={formPropertiesData.formProperty.id}
            properties={formPropertiesData.formProperty}
            value={formPropertiesData.value}
            handleValue={event => handleValueChange(event, formPropertiesData.formProperty.id)}
            editable={editable}
            name={formPropertiesData.formProperty.fieldName}
          />
        </ListWrapper>
      ),
      payment: (
        <ListWrapper className={classes.space} key={formPropertiesData.formProperty.id}>
          <PaymentInput
            properties={formPropertiesData.formProperty}
            communityCurrency={communityCurrency}
          />
        </ListWrapper>
      ),
    };
    return objectAccessor(fields, formPropertiesData.formProperty.fieldType);
  }

  if (loading || formUserData.loading) return <Spinner />;
  if (error || formUserData.error) {
    return(
      <CenteredContent>
        {formatError(error?.message || formUserData.error?.message )}
      </CenteredContent>
    )
  }

  return (
    <>
      <>
        <MessageAlert
          type={message.error ? 'error' : 'success'}
          message={message.info}
          open={!!message.info}
          handleClose={() => setMessage({ ...message, info: '', error: false })}
        />
        <Grid style={!matches ? { padding: '0  100px 0 100px' } : {}}>
          <FormTitle
            name={formUserData.data?.formUser.form.name}
            description={formUserData.data?.formUser.form.description}
          />
        </Grid>
        <form onSubmit={event => handleActionClick(event, 'update')}>
          {Boolean(categoriesData) &&
            categoriesData.map(category => (
              <div key={category.id}>
                <CategoryItem category={category} editMode={false}>
                  <div
                    style={!matches ? { padding: ' 20px  120px 0 120px' } : { paddingTop: '20px' }}
                  >
                    {data?.formUserProperties
                      .sort(sortPropertyOrder)
                      .filter(prop => category.id === prop.formProperty.category.id)
                      .map(renderForm)}
                  </div>
                </CategoryItem>
              </div>
            ))}

          <br />
          <Grid
            container
            justifyContent="space-between"
            direction="row"
            spacing={2}
            style={!matches ? { padding: ' 20px  120px 0 120px' } : {}}
            id="form_update_actions"
          >
            {
              formUserData?.data?.formUser.form.hasTermsAndConditions && (
              <Grid item xs={12} md={12} style={{ paddingBottom: '20px' }}>
                <TermsAndCondition
                  categoriesData={categoriesData}
                  isChecked={formUserData.data?.formUser.hasAgreedToTerms}
                />
              </Grid>
            )
          }
            <Grid item xs={12} md={12} style={{ paddingBottom: '20px' }}>
              <Divider />
            </Grid>
            {authState.user.userType === 'admin' && (
              <>
                <Grid item xs={4}>
                  <Button
                    onClick={event => handleActionClick(event, 'approve')}
                    color="primary"
                    aria-label="form_approve"
                    disabled={isLoading}
                    size="small"
                    fullWidth={matches}
                    variant="outlined"
                    data-testid='approved'
                  >
                    {t('form_status_actions.approved')}
                  </Button>
                </Grid>
                <Grid item xs={4} style={{ textAlign: 'center' }}>
                  <Button
                    onClick={event => handleActionClick(event, 'reject')}
                    aria-label="form_reject"
                    style={{ backgroundColor: '#DC004E', color: '#FFFFFF' }}
                    disabled={isLoading}
                    size="small"
                    fullWidth={matches}
                    variant="outlined"
                    data-testid='rejected'
                  >
                    {t('form_status_actions.rejected')}
                  </Button>
                </Grid>
              </>
            )}
            <Grid item xs={4} className={classes.alignRight}>
              <Button
                type="submit"
                color="primary"
                aria-label="form_update"
                variant="contained"
                disabled={isLoading}
                size="small"
                fullWidth={matches}
                data-testid='submit'
              >
                {t('form_status_actions.submit_form')}
              </Button>
            </Grid>
          </Grid>
          <br />
        </form>
      </>

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

const useStyles = makeStyles(() => ({
  downloadButton: {
    display: 'flex',
    marginTop: '12px'
  },
  downloadButtonMobile: {
    marginTop: '-12px'
  },
  filePreview: {
    position: 'relative',
    marginTop: 18,
    maxWidth: '50%',
    '& iframe': {
      height: '400px',
      width: '600px'
    }
  },
  filePreviewMobile: {
    position: 'relative',
    marginTop: 18,
    maxWidth: '80%',
    '& iframe': {
      height: '300px',
      width: '300px'
    }
  },
  iconButton: {
    right: 2,
    marginRight: -25,
    marginTop: -25,
    background: 'white',
    position: 'absolute',
    '&:hover': {
      background: 'white'
    }
  },
  space: {
    marginBottom: '20px'
  },
  buttonBg: {
    background: '#FFFFFF',
    marginLeft: -10
  },
  alignRight: {
    textAlign: 'right'
  }
}));

FormUpdate.defaultProps = {
  categoriesData: []
};

FormUpdate.propTypes = {
  userId: PropTypes.string.isRequired,
  formUserId: PropTypes.string.isRequired,
  authState: PropTypes.shape({
    user: PropTypes.shape({
      userType: PropTypes.string,
      community: PropTypes.shape({
        currency: PropTypes.string
      })
    })
  }).isRequired,
  categoriesData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      fieldName: PropTypes.string,
      headerVisible: PropTypes.bool
    })
  )
};
