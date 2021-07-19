import React, { Fragment, useContext, useRef, useState, useEffect } from 'react'
import { Button, Container, Grid } from '@material-ui/core'
import { useApolloClient, useMutation, useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import DatePickerDialog from '../../../components/DatePickerDialog';
import CenteredContent from '../../../components/CenteredContent';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import { FormUserCreateMutation } from '../graphql/forms_mutation';
import { FormQuery } from '../graphql/forms_queries';
import { useFileUpload } from '../../../graphql/useFileUpload';
import TextInput from './TextInput';
import UploadField from './UploadField';
import SignaturePad from './SignaturePad';
import { convertBase64ToFile, sortPropertyOrder } from '../../../utils/helpers';
import RadioInput from './RadioInput';
import { Spinner } from '../../../shared/Loading';
import FormTitle from './FormTitle'
import FormPropertyAction from './FormPropertyAction';
import ImageAuth from '../../../shared/ImageAuth'
import MessageAlert from '../../../components/MessageAlert';

// date
// text input (TextField or TextArea)
// upload
const initialData = {
  fieldType: '',
  fieldName: ' ',
  date: { value: null },
  radio: { value: { label: '', checked: null } },
};

export default function GenericForm({ formId, pathname, formData, refetch, editMode }) {
  const [properties, setProperties] = useState(initialData);
  const [message, setMessage] = useState({ err: false, info: '', signed: false });
  const [isSubmitting, setSubmitting] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [currentPropId, setCurrentPropertyId] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const signRef = useRef(null);
  const { t } = useTranslation(['form', 'common']);
  const authState = useContext(AuthStateContext);
  const { data, loading } = useQuery(FormQuery, { variables: { id: formId } });
  // create form user
  const [createFormUser] = useMutation(FormUserCreateMutation);
  // separate function for file upload
  const { onChange, status, signedBlobId, contentType, url } = useFileUpload({
    client: useApolloClient(),
  });
  const {
    onChange: uploadSignature,
    status: signatureStatus,
    signedBlobId: signatureBlobId,
  } = useFileUpload({
    client: useApolloClient(),
  });


  useEffect(() => {
    if (
      status === 'DONE' &&
      currentPropId &&
      !uploadedImages.find((im) => im.propertyId === currentPropId)
    ) {
      setUploadedImages([...uploadedImages, { blobId: signedBlobId, propertyId: currentPropId, contentType, url }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);


  function handleAlertClose() {
    setAlertOpen(false);
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

  function onImageSelect(event, currentProperty) {
    setCurrentPropertyId(currentProperty);
    onChange(event.target.files[0]);
  }

  async function handleSignatureUpload() {
    setMessage({ ...message, signed: true });
    const url64 = signRef.current.toDataURL('image/png');
    // convert the file
    const signature = await convertBase64ToFile(url64);
    await uploadSignature(signature);
  }

  function saveFormData() {
    setSubmitting(true);
    const fileSignType = formData.formProperties.filter(
      (item) => item.fieldType === 'signature'
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
        form_property_id: fileSignType.id,
        image_blob_id: signatureBlobId,
      };
      filledInProperties.push(newValue);
    }
    // check if we uploaded then attach the blob id to the newValue
    uploadedImages.forEach((item) => {
      const newValue = {
        value: item.blobId,
        form_property_id: item.propertyId,
        image_blob_id: item.blobId,
      };
      filledInProperties.push(newValue);
    });

    // update all form values
    formData.formProperties.map((prop) => addPropWithValue(filledInProperties, prop.id));
    const cleanFormData = JSON.stringify({ user_form_properties: filledInProperties });
    // formUserId
    // fields and their values
    // create form user ==> form_id, user_id, status
    createFormUser({
      variables: {
        formId,
        userId: authState.user.id,
        propValues: cleanFormData,
      },
    })
      // eslint-disable-next-line no-shadow
      .then(({ data }) => {
        if (data.formUserCreate.formUser === null) {
          setMessage({ ...message, err: true, info: data.formUserCreate.error });
          setAlertOpen(true);
          setSubmitting(false);
          return;
        }
        setSubmitting(false);
        setMessage({
          ...message,
          err: false,
          info: t('misc.form_submitted'),
        });
        setAlertOpen(true);
      })
      .catch((err) => {
        setMessage({ ...message, err: true, info: err.message.replace(/GraphQL error:/, '') });
        setSubmitting(false);
        setAlertOpen(true);
      });
  }
  function renderForm(formPropertiesData) {
    const editable = !formPropertiesData.adminUse
      ? false
      : !(formPropertiesData.adminUse && authState.user.userType === 'admin');
    const uploadedFile = uploadedImages.find((im) => im.propertyId === formPropertiesData.id)
    const fields = {
      text: (
        <Grid container spacing={3} key={formPropertiesData.id}>
          <FormPropertyAction
            formId={formId}
            editMode={editMode}
            propertyId={formPropertiesData.id}
            refetch={refetch}
          />
          <Grid item xs={editMode ? 10 : 12}>
            <TextInput
              id={formPropertiesData.id}
              properties={formPropertiesData}
              defaultValue={properties.fieldName}
              handleValue={(event) => handleValueChange(event, formPropertiesData.id)}
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
          />
          <Grid item xs={editMode ? 10 : 12}>
            <DatePickerDialog
              id={formPropertiesData.id}
              selectedDate={properties.date.value}
              handleDateChange={(date) => handleDateChange(date, formPropertiesData.id)}
              label={formPropertiesData.fieldName}
            />
          </Grid>
        </Grid>
      ),
      image: (
        <Grid container spacing={3} key={formPropertiesData.id}>
          <FormPropertyAction
            formId={formId}
            editMode={editMode}
            propertyId={formPropertiesData.id}
            refetch={refetch}
          />
          <Grid item xs={editMode ? 10 : 12}>
            <UploadField
              detail={{ type: 'file', label: formPropertiesData.fieldName }}
              upload={(evt) => onImageSelect(evt, formPropertiesData.id)}
              editable={editable}
              uploaded={!!uploadedFile}
            />
          </Grid>
          {
            !!uploadedFile && (
              <ImageAuth type={uploadedFile.contentType.split('/')[0]} imageLink={uploadedFile.url} token={authState.token} />
            )
          }
        </Grid>
      ),
      signature: (
        <Grid container spacing={3} key={formPropertiesData.id}>
          <FormPropertyAction
            formId={formId}
            editMode={editMode}
            propertyId={formPropertiesData.id}
            refetch={refetch}
          />
          <Grid item xs={editMode ? 10 : 12}>
            <SignaturePad
              key={formPropertiesData.id}
              detail={{ type: 'signature', status: signatureStatus }}
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
          />
          <Grid item xs={editMode ? 10 : 12}>
            <Fragment key={formPropertiesData.id}>
              <br />
              <RadioInput
                properties={formPropertiesData}
                value={null}
                handleValue={(event) =>
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
          />
          <Grid item xs={editMode ? 10 : 12}>
            <TextInput
              id={formPropertiesData.id}
              properties={formPropertiesData}
              value=""
              handleValue={(event) => handleValueChange(event, formPropertiesData.id)}
              editable={editable}
            />
          </Grid>
        </Grid>
      ),
    };
    return fields[formPropertiesData.fieldType];
  }

  return (
    <>
      <MessageAlert
        type={message.err ? 'error' : 'success'}
        message={message.info}
        open={alertOpen}
        handleClose={handleAlertClose}
      />
      <Container>
        {loading && <Spinner />}

        {
        !loading && data && <FormTitle name={data.form?.name} description={data.form?.description} />
        }

        <br />
        <form>
          {formData.formProperties.sort(sortPropertyOrder).map(renderForm)}
          {!pathname.includes('edit_form') && (
            <CenteredContent>
              <Button
                variant="outlined"
                type="submit"
                color="primary"
                aria-label="form_submit"
                disabled={isSubmitting}
                style={{marginTop: '25px' }}
                onClick={saveFormData}
              >
                {isSubmitting ? t('common:form_actions.submitting') : t('common:form_actions.submit')}
              </Button>
            </CenteredContent>
          )}
        </form>
      </Container>
    </>
  );
}

GenericForm.propTypes = {
  formId: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  // eslint-disable-next-line react/forbid-prop-types
  formData: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
};

/**
 *
 * @param {{}} values
 * @param {String} propId
 * @returns {Boolean}
 * @description checks if a form property exist
 */
export function propExists(values, propId) {
  return values.some((value) => value.form_property_id === propId);
}

/**
 *
 * @param {{}} properties
 * @param {String} propId
 * @description check form values that weren't filled in and add default values
 */
export function addPropWithValue(properties, propId) {
  if (propExists(properties, propId)) {
    return;
  }
  properties.push({ value: null, form_property_id: propId });
}
