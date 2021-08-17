import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from 'react-apollo';
import { useFileUpload } from '../../../graphql/useFileUpload';

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

//   signatureBlobId
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

  function saveFormData() {
    console.log(formProperties);
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
