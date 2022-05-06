import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import useFileUpload from '../../../graphql/useFileUpload';
import { FormUserCreateMutation } from '../graphql/forms_mutation';
import { addPropWithValue, extractValidFormPropertyValue, requiredFieldIsEmpty } from '../utils';

export const FormContext = createContext({});

export default function FormContextProvider({ children }) {
  const state = {
    isSubmitting: false,
    isUploading: false,
    alertOpen: false,
    currentPropId: '',
    error: false,
    info: '',
    signed: false,
    previewable: false,
    currentFileNames: [],
    filename: null
  };
  const initialData = {
    fieldType: '',
    fieldName: '',
    date: { value: null },
    radio: { value: { label: '', checked: null } }
  };
  const [formProperties, setFormProperties] = useState(initialData);
  const [formState, setFormState] = useState(state);
  const [imgUploadError, setImgUploadError] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const { onChange, status, signedBlobId, contentType, url, startUpload, filename } = useFileUpload(
    {
      client: useApolloClient()
    }
  );
  const [createFormUser] = useMutation(FormUserCreateMutation);
  const { t } = useTranslation('form');
  const signature = useFileUpload({ client: useApolloClient() });

  useEffect(() => {
    if (
      status === 'DONE' &&
      formState.currentPropId
    ) {
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

  /**
   *
   * @param {object} formData all form properties for this form being submitted
   * @param {String} formId form being submitted
   * @param {String} userId  the currently logged in user
   */
  function saveFormData(formData, formId, userId, categories, formStatus = null) {
    if (filesToUpload.length !== uploadedImages.length) {
      return setImgUploadError(true);
    }
    setFormState({
      ...formState,
      isSubmitting: true
    });

    // eslint-disable-next-line no-unreachable
    const fileSignType = formData.filter(item => item.fieldType === 'signature')[0];
    const filledInProperties = extractValidFormPropertyValue(formProperties, 'submit');

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
        image_blob_id: item.blobId,
      };
      filledInProperties.push(newValue);
    });

    // update all form values
    formData.map(prop => addPropWithValue(filledInProperties, prop.id));
    const cleanFormData = JSON.stringify({ user_form_properties: filledInProperties });

    if (requiredFieldIsEmpty(filledInProperties, categories) && formStatus !== 'draft') {
      setFormState({
        ...formState,
        error: true,
        info: t('misc.required_fields_empty'),
        alertOpen: false,
        isSubmitting: false,
        filledInProperties,
        categories
      });
      return false;
    }

    createFormUser({
      variables: {
        formId,
        userId,
        status: formStatus,
        propValues: cleanFormData
      }
    })
      // eslint-disable-next-line no-shadow
      .then(({ data }) => {
        if (data.formUserCreate.formUser === null) {
          setFormState({
            ...formState,
            error: true,
            info: data.formUserCreate.error,
            alertOpen: true,
            isSubmitting: false
          });
          return;
        }

        setFormState({
          ...formState,
          error: false,
          info: formStatus === 'draft' ? t('misc.saved_as_draft') : t('misc.form_submitted'),
          alertOpen: true,
          isSubmitting: false,
          previewable: false,
          successfulSubmit: true,
          isDraft: formStatus === 'draft'
        });
      })
      .catch(err => {
        setFormState({
          ...formState,
          error: true,
          info: err.message.replace(/GraphQL error:/, ''),
          alertOpen: true,
          isSubmitting: false
        });
      });
    return false
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
        uploadedImages,
        startUpload,
        setUploadedImages,
        filesToUpload,
        setFilesToUpload,
        imgUploadError,
        setImgUploadError
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

FormContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
