/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Grid } from '@material-ui/core';
import React, { Fragment , useRef , useContext , useState } from 'react'
import { useTranslation } from 'react-i18next';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import ImageAuth from '../../../shared/ImageAuth';
import { Spinner } from '../../../shared/Loading';
import RadioInput from './FormProperties/RadioInput';
import TextInput from './FormProperties/TextInput';
import UploadField from './FormProperties/UploadField';
import SignaturePad from './FormProperties/SignaturePad';
import FormPropertyAction from './FormPropertyAction';

const initialData = {
    fieldType: '',
    fieldName: ' ',
    date: { value: null },
    radio: { value: { label: '', checked: null } }
  };

export default  function RenderForm({formPropertiesData, formId, refetch, editMode, categoryId}) {
    const [properties, setProperties] = useState(initialData);
    const [message, setMessage] = useState({ err: false, info: '', signed: false });
    const [isSubmitting, setSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [currentPropId, setCurrentPropertyId] = useState('');
    const [uploadedImages, setUploadedImages] = useState([]);
    const signRef = useRef(null);
    const { t } = useTranslation(['form', 'common']);
    const authState = useContext(Context);

    function handleValueChange(event, propId) {
        const { name, value } = event.target;
        setProperties({
          ...properties,
          [name]: { value, form_property_id: propId }
        });
      }
      function handleDateChange(date, id) {
        setProperties({
          ...properties,
          date: { value: date, form_property_id: id }
        });
      }

      function handleRadioValueChange(event, propId, fieldName) {
        const { name, value } = event.target;
        setProperties({
          ...properties,
          [fieldName]: { value: { checked: value, label: name }, form_property_id: propId }
        });
      }

      function onImageSelect(event, currentProperty) {
        setCurrentPropertyId(currentProperty);
        // onChange(event.target.files[0]);
        setIsUploading(true);
      }

      async function handleSignatureUpload() {
        setMessage({ ...message, signed: true });
        const url64 = signRef.current.toDataURL('image/png');
        // convert the file
        // const signature = await convertBase64ToFile(url64);
        // await uploadSignature(signature);
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
              defaultValue={properties.fieldName}
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
              selectedDate={properties.date.value}
              handleDateChange={date => handleDateChange(date, formPropertiesData.id)}
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
          {isUploading && currentPropId === formPropertiesData.id ? (
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
            //   detail={{ type: 'signature', status: signatureStatus }}
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