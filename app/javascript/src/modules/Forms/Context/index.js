import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { useFileUpload } from '../../../graphql/useFileUpload';
import { FormUserCreateMutation } from '../graphql/forms_mutation';
import { addPropWithValue } from '../utils';

export const FormContext = createContext({});

export default function FormContextProvider({ children }) {
  const state = {
    isSubmitting: false,
    isUploading: false,
    alertOpen: false,
    currentPropId: '',
    error: false,
    info: '',
    signed: false
  };
  const initialData = {
    fieldType: '',
    fieldName: ' ',
    date: { value: null },
    radio: { value: { label: '', checked: null } }
  };
  const [formProperties, setFormProperties] = useState(initialData);
  const [formState, setFormState] = useState(state);
  const [uploadedImages, setUploadedImages] = useState([]);
  const { onChange, status, signedBlobId, contentType, url } = useFileUpload({
    client: useApolloClient()
  });
  const [createFormUser] = useMutation(FormUserCreateMutation);
  const { t } = useTranslation('form');
  const signature = useFileUpload({ client: useApolloClient() });

  useEffect(() => {
    if (
      status === 'DONE' &&
      formState.currentPropId &&
      !uploadedImages.find(im => im.propertyId === formState.currentPropId)
    ) {

        setFormState({
        ...formState,
        isUploading: false
      });
      setUploadedImages([
        ...uploadedImages,
        { blobId: signedBlobId, propertyId: formState.currentPropId, contentType, url }
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  /**
   *
   * @param {object} formData all form properties for this form being submitted
   * @param {String} formId form being submitted
   * @param {String} userId  the currently logged in user
   */
  function saveFormData(formData, formId, userId) {
    // console.log(formProperties);
    // setSubmitting(true);
    setFormState({
        ...formState,
        isSubmitting: true
    })
    const fileSignType = formData.formProperties.filter(item => item.fieldType === 'signature')[0];

    // get values from properties state
    const formattedProperties = Object.entries(formProperties).map(([, value]) => value);
    const filledInProperties = formattedProperties.filter(
      item => item.value && item.value?.checked !== null && item.form_property_id !== null
    );

    // get signedBlobId as value and attach it to the form_property_id
    if (formState.signed && signature.signedBlobId) {
      const newValue = {
        value: signature.signedBlobId,
        form_property_id: fileSignType.id,
        image_blob_id: signature.signedBlobId
      };
      filledInProperties.push(newValue);
    }
    // check if we uploaded then attach the blob id to the newValue
    uploadedImages.forEach(item => {
      const newValue = {
        value: item.blobId,
        form_property_id: item.propertyId,
        image_blob_id: item.blobId
      };
      filledInProperties.push(newValue);
    });

    // update all form values
    formData.formProperties.map(prop => addPropWithValue(filledInProperties, prop.id));
    const cleanFormData = JSON.stringify({ user_form_properties: filledInProperties });
    // formUserId
    // fields and their values
    // create form user ==> form_id, user_id, status
    createFormUser({
      variables: {
        formId,
        userId,
        propValues: cleanFormData
      }
    })
      // eslint-disable-next-line no-shadow
      .then(({ data }) => {
        if (data.formUserCreate.formUser === null) {
        //   setMessage({ ...message, err: true, info: data.formUserCreate.error });
        //   setAlertOpen(true);
        //   setSubmitting(false);
          setFormState({
            ...formState,
            error: true,
            info: data.formUserCreate.error,
            alertOpen: true,
            isSubmitting: false
          })
          return;
        }

        setFormState({
            ...formState,
            error: false,
            info: t('misc.form_submitted'),
            alertOpen: true,
            isSubmitting: false
          })
        // setSubmitting(false);
        // setMessage({
        //   ...message,
        //   err: false,
        //   info: t('misc.form_submitted')
        // });
        // setAlertOpen(true);
      })
      .catch(err => {
        // setMessage({ ...message, err: true, info: err.message.replace(/GraphQL error:/, '') });
        // setSubmitting(false);
        // setAlertOpen(true);
        setFormState({
            ...formState,
            error: true,
            info: err.message.replace(/GraphQL error:/, ''),
            alertOpen: true,
            isSubmitting: false
          })
      });
  }
  return (
    <FormContext.Provider
      value={{
        formState,
        setFormState,
        formProperties,
        setFormProperties,
        saveFormData,
        onChange,
        signature,
        uploadedImages
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

FormContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
