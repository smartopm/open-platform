/* eslint-disable max-lines */
/* eslint-disable complexity */
import React, { Fragment, useRef, useContext } from 'react';
import { Grid } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
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

export default function RenderForm({ formPropertiesData, formId, refetch, editMode, categoryId }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  const signRef = useRef(null);
  const authState = useContext(Context);
  const {
    formState,
    formProperties,
    uploadedImages,
    setFormProperties,
    setFormState,
    onChange,
    signature
  } = useContext(FormContext);

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

  function onImageSelect(event, currentProperty) {
    setFormState({
      ...formState,
      currentPropId: currentProperty,
      isUploading: true
    });
    onChange(event.target.files[0]);
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
      <Grid container spacing={3} key={formPropertiesData.id}>
        <FormPropertyAction
          formId={formId}
          editMode={editMode}
          propertyId={formPropertiesData.id}
          refetch={refetch}
          categoryId={categoryId}
        />
        <Grid item xs={editMode ? 10 : 12}>
          <TextInput
            id={formPropertiesData.id}
            properties={formPropertiesData}
            value={formProperties.fieldName}
            handleValue={event => handleValueChange(event, formPropertiesData)}
            editable={editable}
            inputValidation={{
              error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
            }}
          />
        </Grid>
      </Grid>
    ),
    date: (
      <Grid container spacing={3} key={formPropertiesData.id}>
        <FormPropertyAction
          formId={formId}
          editMode={editMode}
          propertyId={formPropertiesData.id}
          refetch={refetch}
          categoryId={categoryId}
        />
        <Grid item xs={editMode ? 10 : 12}>
          <DatePickerDialog
            id={formPropertiesData.id}
            selectedDate={objectAccessor(formProperties, formPropertiesData.fieldName)?.value || null}
            handleDateChange={date => handleDateChange(date, formPropertiesData)}
            label={`${formPropertiesData.fieldName} ${formPropertiesData.required ? '*' : ''}`}
            inputValidation={{
              error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
              fieldName: formPropertiesData.fieldName,
            }}
          />
        </Grid>
      </Grid>
    ),
    time: (
      <Grid container spacing={3} key={formPropertiesData.id}>
        <FormPropertyAction
          formId={formId}
          editMode={editMode}
          propertyId={formPropertiesData.id}
          refetch={refetch}
          categoryId={categoryId}
        />
        <Grid item xs={editMode ? 10 : 12}>
          <ThemedTimePicker
            id={formPropertiesData.id}
            time={objectAccessor(formProperties, formPropertiesData.fieldName)?.value || null}
            handleTimeChange={date => handleDateChange(date, formPropertiesData)}
            label={`${formPropertiesData.fieldName} ${formPropertiesData.required ? '*' : ''}`}
            style={{ width: '100%' }}
            inputValidation={{
              error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
              fieldName: formPropertiesData.fieldName,
            }}
          />
        </Grid>
      </Grid>
    ),
    datetime: (
      <Grid container spacing={3} key={formPropertiesData.id}>
        <FormPropertyAction
          formId={formId}
          editMode={editMode}
          propertyId={formPropertiesData.id}
          refetch={refetch}
          categoryId={categoryId}
        />
        <Grid item xs={editMode ? 10 : 12}>
          <DateAndTimePickers
            id={formPropertiesData.id}
            selectedDateTime={objectAccessor(formProperties, formPropertiesData.fieldName)?.value || null}
            handleDateChange={date => handleDateChange(date, formPropertiesData)}
            label={`${formPropertiesData.fieldName} ${formPropertiesData.required ? '*' : ''}`}
            inputValidation={{
              error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
              fieldName: formPropertiesData.fieldName,
            }}
          />
        </Grid>
      </Grid>
    ),
    file_upload: (
      <Grid container spacing={3} key={formPropertiesData.id}>
        <FormPropertyAction
          formId={formId}
          editMode={editMode}
          propertyId={formPropertiesData.id}
          refetch={refetch}
          categoryId={categoryId}
        />
        <Grid item xs={editMode ? 10 : 12}>
          <UploadField
            detail={{
              type: 'file',
              label: formPropertiesData.fieldName,
              required: formPropertiesData.required
            }}
            upload={evt => onImageSelect(evt, formPropertiesData.id)}
            editable={editable}
            uploaded={!!uploadedFile}
            inputValidation={{
              error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
              fieldName: formPropertiesData.fieldName,
            }}
          />
        </Grid>
        {formState.isUploading && formState.currentPropId === formPropertiesData.id ? (
          <Spinner />
        ) : (
          !!uploadedFile && (
            <div className={matches ? classes.filePreviewMobile : classes.filePreview}>
              <ImageAuth
                type={uploadedFile.contentType.split('/')[0]}
                imageLink={uploadedFile.url}
              />
            </div>
          )
        )}
      </Grid>
    ),
    signature: (
      <Grid container spacing={3} key={formPropertiesData.id}>
        <FormPropertyAction
          formId={formId}
          editMode={editMode}
          propertyId={formPropertiesData.id}
          refetch={refetch}
          categoryId={categoryId}
        />
        <Grid item xs={editMode ? 10 : 12}>
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
        </Grid>
      </Grid>
    ),
    radio: (
      <Grid container spacing={3} key={formPropertiesData.id}>
        <FormPropertyAction
          formId={formId}
          editMode={editMode}
          propertyId={formPropertiesData.id}
          refetch={refetch}
          categoryId={categoryId}
        />
        <Grid item xs={editMode ? 10 : 12}>
          <Fragment key={formPropertiesData.id}>
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
          </Fragment>
        </Grid>
      </Grid>
    ),
    checkbox: (
      <Grid container spacing={3} key={formPropertiesData.id}>
        <FormPropertyAction
          formId={formId}
          editMode={editMode}
          propertyId={formPropertiesData.id}
          refetch={refetch}
          categoryId={categoryId}
        />
        <Grid item xs={editMode ? 10 : 12}>
          <Fragment key={formPropertiesData.id}>
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
          </Fragment>
        </Grid>
      </Grid>
    ),
    dropdown: (
      <Grid container spacing={3} key={formPropertiesData.id}>
        <FormPropertyAction
          formId={formId}
          editMode={editMode}
          propertyId={formPropertiesData.id}
          refetch={refetch}
          categoryId={categoryId}
        />
        <Grid item xs={editMode ? 10 : 12}>
          <TextInput
            id={formPropertiesData.id}
            properties={formPropertiesData}
            value=""
            handleValue={event => handleValueChange(event, formPropertiesData)}
            editable={editable}
            inputValidation={{
              error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
            }}
          />
        </Grid>
      </Grid>
    )
  };
  return <>{objectAccessor(fields, formPropertiesData.fieldType)}</>;
}

const useStyles = makeStyles(() => ({
  filePreview: {
    maxWidth: '50%',
    '& iframe': {
      height: '400px',
      width: '600px'
    }
  },
  filePreviewMobile: {
    maxWidth: '80%',
    '& iframe': {
      height: '300px',
      width: '300px'
    }
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
  }).isRequired
};
