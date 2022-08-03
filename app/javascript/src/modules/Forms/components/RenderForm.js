/* eslint-disable max-lines */
import React, { useRef, useContext, useState } from 'react';
import { Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import DatePickerDialog, {
  DateAndTimePickers,
  ThemedTimePicker,
} from '../../../components/DatePickerDialog';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import RadioInput from './FormProperties/RadioInput';
import CheckboxInput from './FormProperties/CheckboxInput';
import TextInput from './FormProperties/TextInput';
import UploadField from './FormProperties/UploadField';
import SignaturePad from './FormProperties/SignaturePad';
import { FormContext } from '../Context';
import { convertBase64ToFile, objectAccessor } from '../../../utils/helpers';
import {
  checkRequiredFormPropertyIsFilled,
  isUploaded,
  handleFileSelect,
  handleFileUpload,
  removeBeforeUpload,
} from '../utils';
import MessageAlert from '../../../components/MessageAlert';
import UploadFileItem from '../../../shared/imageUpload/UploadFileItem';
import PaymentInput from './FormProperties/PaymentInput';
import { currencies } from '../../../utils/constants';
import AppointmentInput from './FormProperties/AppointmentInput';
import FormPropertyWrapper from './FormProperties/FormPropertyWrapper';

export default function RenderForm({
  formPropertiesData,
  formId,
  refetch,
  editMode,
  categoryId,
  number,
  formDetailRefetch,
}) {
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
    startUpload,
    signature,
    filesToUpload,
    setFilesToUpload,
  } = useContext(FormContext);

  const { t } = useTranslation(['form', 'common']);
  const [messageAlert, setMessageAlert] = useState('');
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const communityCurrency = objectAccessor(currencies, authState.user?.community?.currency) || '';

  function handleCheckboxSelect(event, property) {
    const { name, checked } = event.target;
    setFormProperties({
      ...formProperties,
      [property.fieldName]: {
        value: { ...objectAccessor(formProperties, property.fieldName)?.value, [name]: checked },
        form_property_id: property.id,
        type: 'checkbox',
      },
    });
  }

  /**
   * @deprecated
   */
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
      [name]: { value, form_property_id: property.id },
    });
  }

  function handleDateChange(date, property) {
    setFormProperties({
      ...formProperties,
      [property.fieldName]: {
        value: date,
        form_property_id: property.id,
      },
    });
  }

  function handleRadioValueChange(event, property) {
    const { name, value } = event.target;
    setFormProperties({
      ...formProperties,
      [property.fieldName]: {
        value: { checked: value, label: name },
        form_property_id: property.id,
      },
    });
  }

  function createPropertyObj(propertyId) {
    return {
      filesToUpload,
      setFilesToUpload,
      propertyId,
      setMessageAlert,
      setIsSuccessAlert,
    };
  }

  function handleSelectObject(propertyId) {
    return {
      setMessageAlert,
      setIsSuccessAlert,
      setFormState,
      formState,
      propertyId,
      startUpload,
    };
  }

  function removeUploadObject() {
    return {
      uploadedImages,
      setUploadedImages,
      formState,
      setFormState,
      filesToUpload,
      setFilesToUpload,
    };
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
    ),
    date: (
      <DatePickerDialog
        id={formPropertiesData.id}
        selectedDate={objectAccessor(formProperties, formPropertiesData.fieldName)?.value || null}
        handleDateChange={date => handleDateChange(date, formPropertiesData)}
        label={`${formPropertiesData.fieldName} ${formPropertiesData.required ? '*' : ''}`}
        textFieldStyle={{ background: '#F5F5F4', padding: '10px 15px', borderRadius: '10px' }}
        inputVariant="outlined"
        inputValidation={{
          error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
          fieldName: formPropertiesData.fieldName,
        }}
        t={t}
      />
    ),
    time: (
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
          fieldName: formPropertiesData.fieldName,
        }}
        t={t}
      />
    ),
    datetime: (
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
          fieldName: formPropertiesData.fieldName,
        }}
        t={t}
      />
    ),
    file_upload: (
      <>
        <MessageAlert
          type={isSuccessAlert ? 'success' : 'error'}
          message={messageAlert}
          open={!!messageAlert}
          handleClose={handleMessageAlertClose}
        />
        <UploadField
          detail={{
            type: 'file',
            label: formPropertiesData.fieldName,
            id: formPropertiesData.id,
            required: formPropertiesData.required,
            fileCount: uploadedImages.filter(file => file.propertyId === formPropertiesData.id)
              .length,
            currentPropId: formState.currentPropId,
          }}
          upload={event => handleFileSelect(event, createPropertyObj(formPropertiesData.id), t)}
          editable={editable}
          uploaded={!!uploadedFile}
          showDetails
          btnColor="primary"
          inputValidation={{
            error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
            fieldName: formPropertiesData.fieldName,
          }}
        />
        <br />
        <br />
        {filesToUpload
          .filter(file => file.propertyId === formPropertiesData.id)
          .map(file => (
            <UploadFileItem
              file={file}
              formPropertyId={formPropertiesData.id}
              handleUpload={() =>
                handleFileUpload(file, handleSelectObject(formPropertiesData.id), t)
              }
              handleRemoveFile={removeBeforeUpload}
              formState={{ ...formState, uploaded: uploadedImages }}
              isUploaded={isUploaded(uploadedImages, file, formPropertiesData.id)}
              key={file.fileNameId}
              translate={t}
              removeUploadObject={removeUploadObject}
            />
          ))}
      </>
    ),
    signature: (
      <SignaturePad
        key={formPropertiesData.id}
        detail={{
          type: 'signature',
          status: signature.status,
          required: formPropertiesData.required,
        }}
        signRef={signRef}
        onEnd={() => handleSignatureUpload(formPropertiesData.id)}
      />
    ),
    radio: (
      <>
        <br />
        <RadioInput
          properties={formPropertiesData}
          value={null}
          handleValue={event => handleRadioValueChange(event, formPropertiesData)}
          inputValidation={{
          error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
        }}
        />
        <br />
      </>
    ),
    checkbox: (
      <>
        <br />
        <CheckboxInput
          properties={formPropertiesData}
          checkboxState={objectAccessor(formProperties, formPropertiesData.fieldName)}
          handleValue={event => handleCheckboxSelect(event, formPropertiesData)}
          inputValidation={{
          error: checkRequiredFormPropertyIsFilled(formPropertiesData, formState),
        }}
        />
        <br />
      </>
    ),
    dropdown: (
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
    ),
    payment: <PaymentInput properties={formPropertiesData} communityCurrency={communityCurrency} />,
    appointment: <AppointmentInput properties={formPropertiesData} />,
  };
  return (
    <Grid style={!editMode && !matches ? { padding: '0 120px' } : {}}>
      <FormPropertyWrapper
        formPropertiesData={formPropertiesData}
        propertyActionData={{ formId, refetch, categoryId, formDetailRefetch }}
        editMode={editMode}
        number={number}
      >
        {objectAccessor(fields, formPropertiesData.fieldType)}
      </FormPropertyWrapper>
    </Grid>
  );
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
    adminUse: PropTypes.bool,
    required: PropTypes.bool,
  }).isRequired,
  number: PropTypes.number.isRequired,
  formDetailRefetch: PropTypes.func.isRequired,
};
