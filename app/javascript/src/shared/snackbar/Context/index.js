import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import MessageAlert from '../../../components/MessageAlert';

const SNACKBAR_TYPES = Object.freeze({ success: 'success', error: 'error', warn: 'warning', info: 'info' });

// Initial state for Context - useful also in Jest tests
export const SnackbarContext = createContext({ showSnackbar: () => {}, messageType: SNACKBAR_TYPES });


/**
 *
 * @param {Object} children
 * @returns returns a snack bar
 * @description a HOC wrapper that renders a snack bar at the top of the page
 */
export default function SnackbarProvider({ children }) {
  const [info, setInfo] = useState({ type: 'success', message: '', style: {} }) 

  /**
 *
 * @param {{type: String, message: String, style: object }} [{ type: 'success', message: '', style: {} }] params
 * @returns <MessageAlert> message with severity level: success / error
 * @description triggers the snack bar
 */
  function showSnackbar({ type, message, style }){
    setInfo({
      type,
      message,
      style,
    })
  }

  /**
   *
   * @param {Object} event
   * @param {String} reason
   * @description closes the snackbar manually
   */
  function handleClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setInfo({
      ...info,
      message: '',
    })
  }

  return (
    <SnackbarContext.Provider
      value={{
        showSnackbar,
        messageType: SNACKBAR_TYPES,
      }}
    >
      {children}
      <MessageAlert
        open={!!info.message}
        type={info.type}
        message={info.message}
        handleClose={handleClose}
        style={info.style}
      />
    </SnackbarContext.Provider>
  );
}

SnackbarProvider.propTypes = {
  children: PropTypes.node.isRequired
};
