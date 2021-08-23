import React, { Fragment, useRef, useContext } from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types'
import DatePickerDialog, { DateAndTimePickers, ThemedTimePicker } from '../../../components/DatePickerDialog';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import ImageAuth from '../../../shared/ImageAuth';
import { Spinner } from '../../../shared/Loading';
import RadioInput from './FormProperties/RadioInput';
import TextInput from './FormProperties/TextInput';
import UploadField from './FormProperties/UploadField';
import SignaturePad from './FormProperties/SignaturePad';
import FormPropertyAction from './FormPropertyAction';
import { FormContext } from '../Context';
import { convertBase64ToFile } from '../../../utils/helpers';
import { dateToString } from '../../../components/DateContainer';

export default function RenderForm({ formPropertiesData, formId, refetch, editMode, categoryId }) {
  const signRef = useRef(null);
  const authState = useContext(Context);
  const {
    formState,
    formProperties,
    uploadedImages,
    setFormProperties,
    setFormState,
    onChange,
    signature,
  } = useContext(FormContext);


  function handleValueChange(event, propId) {
    const { name, value } = event.target;
    setFormProperties({
      ...formProperties,
      [name]: { value, form_property_id: propId }
    });
  }

  function handleDateChange(date, id, name) {
    setFormProperties({
      ...formProperties,
      [name]: { value: dateToString(date, 'YYYY-MM-DD HH:mm'), form_property_id: id }
    });
  }

  function handleRadioValueChange(event, propId, fieldName) {
    const { name, value } = event.target;
    setFormProperties({
      ...formProperties,
      [fieldName]: { value: { checked: value, label: name }, form_property_id: propId }
    });
  }

  function onImageSelect(event, currentProperty) {
    setFormState({
      ...formState,
      currentPropId: currentProperty,
      isUploading: true
    })
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
            handleValue={event => handleValueChange(event, formPropertiesData.id)}
            editable={editable}
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
            selectedDate={formProperties[String(formPropertiesData.fieldName)]?.value || null}
            handleDateChange={date => handleDateChange(date, formPropertiesData.id, formPropertiesData.fieldName)}
            label={formPropertiesData.fieldName}
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
            time={formProperties[String(formPropertiesData.fieldName)]?.value || null}
            handleTimeChange={date => handleDateChange(date, formPropertiesData.id, formPropertiesData.fieldName)}
            label={formPropertiesData.fieldName}
            style={{ width: '100%' }}
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
            selectedDateTime={formProperties[String(formPropertiesData.fieldName)]?.value || null}
            handleDateChange={date => handleDateChange(date, formPropertiesData.id, formPropertiesData.fieldName)}
            label={formPropertiesData.fieldName}
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
            detail={{ type: 'file', label: formPropertiesData.fieldName }}
            upload={evt => onImageSelect(evt, formPropertiesData.id)}
            editable={editable}
            uploaded={!!uploadedFile}
          />
        </Grid>
        {formState.isUploading && formState.currentPropId === formPropertiesData.id ? (
          <Spinner />
        ) : (
          !!uploadedFile && (
            <ImageAuth
              type={uploadedFile.contentType.split('/')[0]}
              imageLink={uploadedFile.url}
              token={authState.token}
            />
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
            detail={{ type: 'signature', status: signature.status }}
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
              handleValue={event =>
                handleRadioValueChange(event, formPropertiesData.id, formPropertiesData.fieldName)
              }
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
            handleValue={event => handleValueChange(event, formPropertiesData.id)}
            editable={editable}
          />
        </Grid>
      </Grid>
    )
  };
  return <>{fields[formPropertiesData.fieldType]}</>;
}


RenderForm.propTypes = {
  formId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  categoryId: PropTypes.string.isRequired,
  formPropertiesData: PropTypes.shape({
    id: PropTypes.string,
    fieldType: PropTypes.string,
    fieldName: PropTypes.string,
    adminUse: PropTypes.bool
  }).isRequired,
}