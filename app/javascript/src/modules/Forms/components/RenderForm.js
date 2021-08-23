import React, { Fragment, useRef, useContext } from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types'
import { DateAndTimePickers } from '../../../components/DatePickerDialog';
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


  function handleValueChange(event, property) {
    const { name, value } = event.target;
    setFormProperties({
      ...formProperties,
      [name]: { value, form_property_id: property.id, groupingId: property.groupingId }
    });
  }

  function handleDateChange(date, property) {
    setFormProperties({
      ...formProperties,
      [property.fieldName]: { value: date, form_property_id: property.id, groupingId: property.groupingId }
    });
  }

  function handleRadioValueChange(event, property) {
    const { name, value } = event.target;
    setFormProperties({
      ...formProperties,
      [property.fieldName]: { value: { checked: value, label: name }, form_property_id: property.id, groupingId: property.groupingId }
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
            handleValue={event => handleValueChange(event, formPropertiesData)}
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
          <DateAndTimePickers
            id={formPropertiesData.id}
            selectedDateTime={formProperties[String(formPropertiesData.fieldName)]?.value || null}
            handleDateChange={date => handleDateChange(date, formPropertiesData)}
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
                handleRadioValueChange(event, formPropertiesData)
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
            handleValue={event => handleValueChange(event, formPropertiesData)}
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