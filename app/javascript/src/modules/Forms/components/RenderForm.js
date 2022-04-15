/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { useRef, useContext, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DatePickerDialog, {
  DateAndTimePickers,
  ThemedTimePicker
} from '../../../components/DatePickerDialog';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import ImageAuth from '../../../shared/ImageAuth';
import { Spinner } from '../../../shared/Loading';
import RadioInput from './FormProperties/RadioInput';
import CheckboxInput from './FormProperties/CheckboxInput';
import TextInput from './FormProperties/TextInput';
import UploadField from './FormProperties/UploadField';
import SignaturePad from './FormProperties/SignaturePad';
import FormPropertyAction from './FormPropertyAction';
import { FormContext } from '../Context';
import { convertBase64ToFile, objectAccessor } from '../../../utils/helpers';
import { checkRequiredFormPropertyIsFilled } from '../utils';
import MessageAlert from '../../../components/MessageAlert';
import ListWrapper from '../../../shared/ListWrapper';
import UploadFileItem from '../../../shared/imageUpload/UploadFileItem';

export default function RenderForm({
  formPropertiesData,
  formId,
  refetch,
  editMode,
  categoryId,
  number,
  formDetailRefetch
}) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:900px)');
  const signRef = useRef(null);
  const authState = useContext(Context);
  const {
    formState,
    formProperties,
    uploadedImages,
    setUploadedImages,
    setFormProperties,
    setFormState,
    onChange,
    startUpload,
    signature
  } = useContext(FormContext);

  const fileTypes = ['pdf', 'zip', 'x-zip-compressed'];
  const { t } = useTranslation('form');
  const [messageAlert, setMessageAlert] = useState('');
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]);
  function handleCheckboxSelect(event, property) {
    const { name, checked } = event.target;
    setFormProperties({
      ...formProperties,
      [property.fieldName]: {
        value: { ...objectAccessor(formProperties, property.fieldName)?.value, [name]: checked },
        form_property_id: property.id,
        type: 'checkbox'
      }
    });
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
  }

  function handleValueChange(event, property) {
    const { name, value } = event.target;
    setFormProperties({
      ...formProperties,
      [name]: { value, form_property_id: property.id }
    });
  }

  function handleDateChange(date, property) {
    setFormProperties({
      ...formProperties,
      [property.fieldName]: {
        value: date,
        form_property_id: property.id
      }
    });
  }

  function handleRadioValueChange(event, property) {
    const { name, value } = event.target;
    setFormProperties({
      ...formProperties,
      [property.fieldName]: {
        value: { checked: value, label: name },
        form_property_id: property.id
      }
    });
  }

console.log(uploadedImages)
  async function handleFileUpload(file, propertyId){
    await startUpload(file)
    await setFormState({
      ...formState,
      currentPropId: propertyId,
      isUploading: true,
    });
    // removeBeforeUpload(file)
  }

  function onImageSelect(event, currentProperty) {
    // const file = event.target.files[0];
    // const validType =
    //   fileTypes.includes(file.type.split('/')[1]) || file.type.split('/')[0] === 'image';
    // if (!validType) {
    //   setMessageAlert(t('form:errors.wrong_file_type'));
    //   setIsSuccessAlert(false);
    //   return;
    // }
    // setFormState({
    //   ...formState,
    //   currentPropId: currentProperty,
    //   isUploading: true
    // });
    setFilesToUpload([...event.target.files])
    // onChange(event.target.files[0]);

  }

  function removeBeforeUpload(file) {
    const filteredImages = filesToUpload.filter(item => item.name !== file.name);
    setFilesToUpload(filteredImages);
  }

  function isUploaded(file) {
    console.log(uploadedImages)
    const isIt = uploadedImages.some(uploaded => uploaded.filename === file.name )
    console.log(isIt)
    return isIt
  }

  function onImageRemove(imagePropertyId) {
    const filteredImages = uploadedImages.filter(im => im.propertyId !== imagePropertyId);
    setUploadedImages(filteredImages);
  }



  async function handleSignatureUpload() {
    setFormState({ ...formState, signed: true });
    const url64 = signRef.current.toDataURL('image/png');
    // convert the file
    const convertedSignature = await convertBase64ToFile(url64);
    await signature.onChange(convertedSignature);
  }

  const editable = !formPropertiesData.adminUse
    ? false
    : !(formPropertiesData.adminUse && authState.user.userType === 'admin');
  const uploadedFile = uploadedImages.find(im => im.propertyId === formPropertiesData.id);
  const fields = {
    text: (
      <Grid container key={formPropertiesData.id} alignItems="center" justifyContent="center">
        {editMode && (
          <Grid item xs={1}>
            <Typography color="textSecondary">{number}</Typography>
          </Grid>
        )}
        <Grid item xs={editMode ? 10 : 12} className={classes.spaceBottom}>
          <ListWrapper>
            <TextInput
              id={formPropertiesData.id}
              properties={formPropertiesData}
              value={formProperties.fieldName}
              handleValue={event => handleValueChange(event, formPropertiesData)}
              editable={editable}
              inputValidation={{
                error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState)
              }}
            />
          </ListWrapper>
        </Grid>
        {editMode && (
          <Grid item xs={1}>
            <FormPropertyAction
              formId={formId}
              editMode={editMode}
              propertyId={formPropertiesData.id}
              refetch={refetch}
              categoryId={categoryId}
              formDetailRefetch={formDetailRefetch}
            />
          </Grid>
        )}
      </Grid>
    ),
    date: (
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="center"
        key={formPropertiesData.id}
      >
        {editMode && (
          <Grid item xs={1}>
            <Typography color="textSecondary">{number}</Typography>
          </Grid>
        )}
        <Grid item xs={editMode ? 10 : 12} className={classes.spaceBottom}>
          <DatePickerDialog
            id={formPropertiesData.id}
            selectedDate={
              objectAccessor(formProperties, formPropertiesData.fieldName)?.value || null
            }
            handleDateChange={date => handleDateChange(date, formPropertiesData)}
            label={`${formPropertiesData.fieldName} ${formPropertiesData.required ? '*' : ''}`}
            textFieldStyle={{ background: '#F5F5F4', padding: '10px 15px', borderRadius: '10px' }}
            inputVariant="outlined"
            inputValidation={{
              error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
              fieldName: formPropertiesData.fieldName
            }}
          />
        </Grid>
        {editMode && (
          <Grid item xs={1}>
            <FormPropertyAction
              formId={formId}
              editMode={editMode}
              propertyId={formPropertiesData.id}
              refetch={refetch}
              categoryId={categoryId}
            />
          </Grid>
        )}
      </Grid>
    ),
    time: (
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="center"
        key={formPropertiesData.id}
      >
        {editMode && (
          <Grid item xs={1}>
            <Typography color="textSecondary">{number}</Typography>
          </Grid>
        )}
        <Grid item xs={editMode ? 10 : 12} className={classes.spaceBottom}>
          <ThemedTimePicker
            id={formPropertiesData.id}
            time={objectAccessor(formProperties, formPropertiesData.fieldName)?.value || null}
            handleTimeChange={date => handleDateChange(date, formPropertiesData)}
            label={`${formPropertiesData.fieldName} ${formPropertiesData.required ? '*' : ''}`}
            style={{ width: '100%' }}
            inputVariant="outlined"
            textFieldStyle={{ background: '#F5F5F4', padding: '10px 15px', borderRadius: '10px' }}
            inputValidation={{
              error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
              fieldName: formPropertiesData.fieldName
            }}
          />
        </Grid>
        {editMode && (
          <Grid item xs={1}>
            <FormPropertyAction
              formId={formId}
              editMode={editMode}
              propertyId={formPropertiesData.id}
              refetch={refetch}
              categoryId={categoryId}
            />
          </Grid>
        )}
      </Grid>
    ),
    datetime: (
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="center"
        key={formPropertiesData.id}
      >
        {editMode && (
          <Grid item xs={1}>
            <Typography color="textSecondary">{number}</Typography>
          </Grid>
        )}
        <Grid item xs={editMode ? 10 : 12} className={classes.spaceBottom}>
          <DateAndTimePickers
            id={formPropertiesData.id}
            selectedDateTime={
              objectAccessor(formProperties, formPropertiesData.fieldName)?.value || null
            }
            handleDateChange={date => handleDateChange(date, formPropertiesData)}
            label={`${formPropertiesData.fieldName} ${formPropertiesData.required ? '*' : ''}`}
            inputVariant="outlined"
            textFieldStyle={{ background: '#F5F5F4', padding: '10px 15px', borderRadius: '10px' }}
            inputValidation={{
              error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
              fieldName: formPropertiesData.fieldName
            }}
          />
        </Grid>
        {editMode && (
          <Grid item xs={1}>
            <FormPropertyAction
              formId={formId}
              editMode={editMode}
              propertyId={formPropertiesData.id}
              refetch={refetch}
              categoryId={categoryId}
            />
          </Grid>
        )}
      </Grid>
    ),
    file_upload: (
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="center"
        key={formPropertiesData.id}
      >
        <MessageAlert
          type={isSuccessAlert ? 'success' : 'error'}
          message={messageAlert}
          open={!!messageAlert}
          handleClose={handleMessageAlertClose}
        />
        {editMode && (
          <Grid item xs={1}>
            <Typography color="textSecondary">{number}</Typography>
          </Grid>
        )}
        <Grid
          item
          xs={editMode ? 10 : 12}
          className={classes.spaceBottom}
          style={formState.isUploading ? { opacity: 0.3, pointerEvents: 'none' } : {}}
        >
          <ListWrapper>
            <UploadField
              detail={{
                type: 'file',
                label: formPropertiesData.fieldName,
                id: formPropertiesData.id,
                required: formPropertiesData.required
              }}
              upload={evt => onImageSelect(evt, formPropertiesData.id)}
              editable={editable}
              uploaded={!!uploadedFile}
              btnColor="primary"
              inputValidation={{
                error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
                fieldName: formPropertiesData.fieldName
              }}
            />
          </ListWrapper>
        </Grid>
        {editMode && (
          <Grid item xs={1}>
            <FormPropertyAction
              formId={formId}
              editMode={editMode}
              propertyId={formPropertiesData.id}
              refetch={refetch}
              categoryId={categoryId}
            />
          </Grid>
        )}
        
        {
          filesToUpload.map(file => (
            <UploadFileItem
              file={file}
              handleUpload={() => handleFileUpload(file, formPropertiesData.id)}
              handleRemoveFile={() => removeBeforeUpload(file)}
              formState={{...formState, uploaded: uploadedImages}}
              isUploaded={isUploaded(file)}
              key={`${file.size}-${file.name}`}
            />
          ))
        }

        {/* {formState.isUploading && formState.currentPropId === formPropertiesData.id ? (
          <Grid item md={12} xs={12}>
            <Spinner />
          </Grid>
        ) : (
          !!uploadedFile && (
            <Grid
              item
              md={12}
              xs={12}
              className={matches ? classes.filePreviewMobile : classes.filePreview}
            >
              <IconButton
                className={classes.iconButton}
                onClick={() => onImageRemove(formPropertiesData.id)}
                data-testid="image_close"
                size="large"
              >
                <CloseIcon className={classes.closeButton} />
              </IconButton>
              <ImageAuth
                type={uploadedFile.contentType.split('/')[0]}
                imageLink={uploadedFile.url}
              />
            </Grid>
          )
        )} */}
      </Grid>
    ),
    signature: (
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={3}
        key={formPropertiesData.id}
      >
        {editMode && (
          <Grid item xs={1}>
            <Typography color="textSecondary">{number}</Typography>
          </Grid>
        )}
        <Grid item xs={editMode ? 10 : 12} className={classes.spaceBottom}>
          <ListWrapper>
            <SignaturePad
              key={formPropertiesData.id}
              detail={{
                type: 'signature',
                status: signature.status,
                required: formPropertiesData.required
              }}
              signRef={signRef}
              onEnd={() => handleSignatureUpload(formPropertiesData.id)}
            />
          </ListWrapper>
        </Grid>
        {editMode && (
          <Grid item xs={1}>
            <FormPropertyAction
              formId={formId}
              editMode={editMode}
              propertyId={formPropertiesData.id}
              refetch={refetch}
              categoryId={categoryId}
            />
          </Grid>
        )}
      </Grid>
    ),
    radio: (
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="center"
        key={formPropertiesData.id}
      >
        {editMode && (
          <Grid item xs={1}>
            <Typography color="textSecondary">{number}</Typography>
          </Grid>
        )}
        <Grid item xs={editMode ? 10 : 12} className={classes.spaceBottom}>
          <ListWrapper key={formPropertiesData.id}>
            <br />
            <RadioInput
              properties={formPropertiesData}
              value={null}
              handleValue={event => handleRadioValueChange(event, formPropertiesData)}
              inputValidation={{
                error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState)
              }}
            />
            <br />
          </ListWrapper>
        </Grid>
        {editMode && (
          <Grid item xs={1}>
            <FormPropertyAction
              formId={formId}
              editMode={editMode}
              propertyId={formPropertiesData.id}
              refetch={refetch}
              categoryId={categoryId}
            />
          </Grid>
        )}
      </Grid>
    ),
    checkbox: (
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="center"
        key={formPropertiesData.id}
      >
        {editMode && (
          <Grid item xs={1}>
            <Typography color="textSecondary">{number}</Typography>
          </Grid>
        )}
        <Grid item xs={editMode ? 10 : 12} className={classes.spaceBottom}>
          <ListWrapper key={formPropertiesData.id}>
            <br />
            <CheckboxInput
              properties={formPropertiesData}
              checkboxState={objectAccessor(formProperties, formPropertiesData.fieldName)}
              handleValue={event => handleCheckboxSelect(event, formPropertiesData)}
              inputValidation={{
                error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState)
              }}
            />
            <br />
          </ListWrapper>
        </Grid>
        {editMode && (
          <Grid item xs={1}>
            <FormPropertyAction
              formId={formId}
              editMode={editMode}
              propertyId={formPropertiesData.id}
              refetch={refetch}
              categoryId={categoryId}
            />
          </Grid>
        )}
      </Grid>
    ),
    dropdown: (
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="center"
        key={formPropertiesData.id}
      >
        {editMode && (
          <Grid item xs={1}>
            <Typography color="textSecondary">{number}</Typography>
          </Grid>
        )}
        <Grid item xs={editMode ? 10 : 12} className={classes.spaceBottom}>
          <ListWrapper>
            <TextInput
              id={formPropertiesData.id}
              properties={formPropertiesData}
              value=""
              handleValue={event => handleValueChange(event, formPropertiesData)}
              editable={editable}
              inputValidation={{
                error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState)
              }}
            />
          </ListWrapper>
        </Grid>
        {editMode && (
          <Grid item xs={1}>
            <FormPropertyAction
              formId={formId}
              editMode={editMode}
              propertyId={formPropertiesData.id}
              refetch={refetch}
              categoryId={categoryId}
            />
          </Grid>
        )}
      </Grid>
    )
  };
  return (
    <Grid style={!editMode && !matches ? { padding: '0 120px' } : {}}>
      {objectAccessor(fields, formPropertiesData.fieldType)}
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  filePreview: {
    position: 'relative',
    '& iframe': {
      height: '400px',
      width: '600px'
    }
  },
  filePreviewMobile: {
    position: 'relative',
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
  closeButton: {
    height: '40px',
    width: '40px'
  },
  spaceBottom: {
    margin: '10px 0'
  }
}));

RenderForm.propTypes = {
  formId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  categoryId: PropTypes.string.isRequired,
  formPropertiesData: PropTypes.shape({
    id: PropTypes.string,
    fieldType: PropTypes.string,
    fieldName: PropTypes.string,
    adminUse: PropTypes.bool,
    required: PropTypes.bool
  }).isRequired,
  number: PropTypes.number.isRequired,
  formDetailRefetch: PropTypes.func.isRequired
};
