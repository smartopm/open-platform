import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const FormContext = createContext({});

export default function FormContextProvider({ children }) {
    const state = {
        isSubmitting: false,
        isUploading: false,
        alertOpen: false,
        currentPropId: '',
        uploadedImages: [],
        properties: {}
    }
  const [formProperties, setFormProperties] = useState({});
//   const [message, setMessage] = useState({ err: false, info: '', signed: false });

  const [formState, setFormState] = useState(state)

  console.log(formProperties)
  function onSubmit() {}
  return (
    <FormContext.Provider value={{ formState,  setFormState, formProperties, setFormProperties}}>
      <form onSubmit={onSubmit}>{children}</form>
    </FormContext.Provider>
  );
}

FormContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};
