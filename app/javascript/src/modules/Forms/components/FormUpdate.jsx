/* eslint-disable complexity */
/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable no-use-before-define */
/* eslint-disable security/detect-object-injection */
/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useRef, useState, useEffect } from 'react';
import {
  Button,
  Container,
  Grid,
  Divider,
  Typography,
  ListItem,
  ListItemText
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useApolloClient, useMutation, useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import DatePickerDialog, {
  DateAndTimePickers,
  ThemedTimePicker
} from '../../../components/DatePickerDialog';
import { FormUserQuery, UserFormPropertiesQuery } from '../graphql/forms_queries';
import ErrorPage from '../../../components/Error';
import CenteredContent from '../../../shared/CenteredContent';
import { FormUserStatusUpdateMutation, FormUserUpdateMutation } from '../graphql/forms_mutation';
import TextInput from './FormProperties/TextInput';
import {
  convertBase64ToFile,
  sortPropertyOrder,
  objectAccessor,
  secureFileDownload
} from '../../../utils/helpers';
import DialogueBox from '../../../shared/dialogs/DeleteDialogue';
import UploadField from './FormProperties/UploadField';
import SignaturePad from './FormProperties/SignaturePad';
import useFileUpload from '../../../graphql/useFileUpload';
import RadioInput from './FormProperties/RadioInput';
import ImageAuth from '../../../shared/ImageAuth';
import Loading, { Spinner } from '../../../shared/Loading';
import FormTitle from './FormTitle';
import CheckboxInput from './FormProperties/CheckboxInput';
import ListWrapper from '../../../shared/ListWrapper';
import CategoryItem from './Category/CategoryItem';

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
  const [properties, setProperties] = useState(initialData);
  const [message, setMessage] = useState({ err: false, info: '', signed: false });
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [formAction, setFormAction] = useState('');
  const history = useHistory();
  const signRef = useRef(null);
  const { t } = useTranslation(['form', 'common']);
  const classes = useStyles();
  // create form user
  const [updateFormUser] = useMutation(FormUserUpdateMutation);
  const [updateFormUserStatus] = useMutation(FormUserStatusUpdateMutation);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formState, setFormState] = useState({});
  const matches = useMediaQuery('(max-width:900px)');

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

  const { onChange, status, url, signedBlobId, contentType } = useFileUpload({
    client: useApolloClient()
  });
  const {
    onChange: uploadSignature,
    status: signatureStatus,
    signedBlobId: signatureBlobId
  } = useFileUpload({
    client: useApolloClient()
  });

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
    if (
      status === 'DONE' &&
      formState.currentPropId &&
      !uploadedFiles.find(im => im.propertyId === formState.currentPropId)
    ) {
      setFormState({
        ...formState,
        isUploading: false
      });
      setUploadedFiles([
        ...uploadedFiles,
        { blobId: signedBlobId, propertyId: formState.currentPropId, contentType, url }
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function onFileSelect(event, currentProperty) {
    setFormState({
      ...formState,
      currentPropId: currentProperty,
      isUploading: true
    });
    onChange(event.target.files[0]);
  }

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

    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach(upload => {
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

  function downloadFile(event, path) {
    event.preventDefault();
    secureFileDownload(path);
  }

  function onImageRemove(filePropertyId) {
    const filteredFiles = uploadedFiles.filter(im => im.propertyId !== filePropertyId);
    setUploadedFiles(filteredFiles);
  }

  function renderForm(formPropertiesData) {
    const editable = !formPropertiesData.formProperty.adminUse
      ? false
      : !(formPropertiesData.formProperty.adminUse && authState.user.userType === 'admin');

    const uploadedFile = uploadedFiles.find(
      im => im.propertyId === formPropertiesData.formProperty.id
    );
    const fields = {
      text: (
        <ListWrapper className={classes.space}>
          <TextInput
            id={formPropertiesData.formProperty.id}
            key={formPropertiesData.formProperty.id}
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
          <Grid
            container
            direction="row"
            spacing={1}
            alignItems="flex-start"
            className={classes.fileUploadField}
          >
            {formState.isUploading &&
            formState.currentPropId === formPropertiesData.formProperty.id ? (
              <Spinner />
            ) : (
              (!!uploadedFile && (
                <div className={matches ? classes.filePreviewMobile : classes.filePreview}>
                  <IconButton
                    className={classes.iconButton}
                    onClick={() => onImageRemove(formPropertiesData.formProperty.id)}
                    data-testid="image_close"
                    size="large"
                  >
                    <CloseIcon className={classes.closeButton} />
                  </IconButton>
                  <ImageAuth
                    type={uploadedFile.contentType.split('/')[0]}
                    imageLink={uploadedFile.url}
                  />
                </div>
              )) || (
                <Grid item md={12} xs={12}>
                  <div>
                    {formPropertiesData.imageUrl && (
                      <>
                        <ListWrapper className={classes.space}>
                          <ListItem style={{ paddingLeft: 0 }}>
                            <Grid container alignItems="center" justifyContent="center">
                              <Grid item md={11} xs={8}>
                                <ListItemText
                                  disableTypography
                                  primary={(
                                    <Typography
                                      variant="body1"
                                      color="primary"
                                      style={{ fontWeight: 700 }}
                                      data-testid="filename"
                                    >
                                      {formPropertiesData.formProperty.fieldName}
                                    </Typography>
                                  )}
                                  secondary={(
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      data-testid="uploaded_at"
                                    >
                                      {formPropertiesData.fileName}
                                    </Typography>
                                  )}
                                />
                              </Grid>
                              <Grid item md={1} xs={4} className={classes.alignRight}>
                                <Button
                                  aria-label="download-icon"
                                  data-testid="download-icon"
                                  variant="outlined"
                                  className={classes.buttonBg}
                                  onClick={event =>
                                    downloadFile(event, formPropertiesData.imageUrl)
                                  }
                                >
                                  {t('common:misc.open')}
                                </Button>
                              </Grid>
                            </Grid>
                          </ListItem>
                        </ListWrapper>
                      </>
                    )}
                  </div>
                </Grid>
              )
            )}
          </Grid>
          <ListWrapper className={classes.space}>
            <UploadField
              detail={{
                type: 'file',
                status,
                id: formPropertiesData.formProperty.id,
                label: formPropertiesData.formProperty.fieldName
              }}
              key={formPropertiesData.id}
              upload={evt => onFileSelect(evt, formPropertiesData.formProperty.id)}
              editable={editable}
              style={{ flex: 1 }}
              btnColor="primary"
            />
          </ListWrapper>
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
        <ListWrapper className={classes.space}>
          <TextInput
            id={formPropertiesData.formProperty.id}
            key={formPropertiesData.formProperty.id}
            properties={formPropertiesData.formProperty}
            value={formPropertiesData.value}
            handleValue={event => handleValueChange(event, formPropertiesData.formProperty.id)}
            editable={editable}
            name={formPropertiesData.formProperty.fieldName}
          />
        </ListWrapper>
      )
    };
    return objectAccessor(fields, formPropertiesData.formProperty.fieldType);
  }

  if (loading || formUserData.loading) return <Loading />;
  if (error || formUserData.error)
    return <ErrorPage title={error?.message || formUserData.error?.message} />;

  return (
    <>
      <Container>
        <Grid style={!matches ? { padding: '0  100px 0 100px' } : {}}>
          <FormTitle
            name={formUserData.data?.formUser.form.name}
            description={formUserData.data?.formUser.form.description}
          />
        </Grid>
        <form onSubmit={event => handleActionClick(event, 'update')}>
          {Boolean(categoriesData) &&
            categoriesData.map(category => (
              <CategoryItem category={category} key={category.id} editMode={false}>
                <Grid style={!matches ? { padding: ' 20px  120px 0 120px' } : { paddingTop: '20px' }}>
                  {data?.formUserProperties
                    .sort(sortPropertyOrder)
                    .filter(prop => category.id === prop.formProperty.category.id)
                    .map(renderForm)}
                </Grid>
              </CategoryItem>
            ))}
          <br />
          <Grid
            container
            justifyContent="space-between"
            direction="row"
            spacing={2}
            style={!matches ? { padding: ' 20px  120px 0 120px' } : {}}
          >
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
                    variant='outlined'
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
                    variant='outlined'
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
              >
                {t('form_status_actions.submit_form')}
              </Button>
            </Grid>
          </Grid>
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
    background: '#FFFFFF'
  },
  alignRight: {
    textAlign: 'right'
  }
}));

FormUpdate.defaultProps = {
  categoriesData: []
}

FormUpdate.propTypes = {
  userId: PropTypes.string.isRequired,
  formUserId: PropTypes.string.isRequired,
  authState: PropTypes.shape({
    user: PropTypes.shape({ userType: PropTypes.string })
  }).isRequired,
  categoriesData: PropTypes.arrayOf({})
};
