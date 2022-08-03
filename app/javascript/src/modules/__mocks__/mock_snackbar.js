import React from 'react';
import PropTypes from 'prop-types';
import { SnackbarContext } from '../../shared/snackbar/Context';

export const mockedSnackbarProviderProps = {
  messageType: { error: 'error', success: 'success' },
  showSnackbar: jest.fn()
}
export default function MockedSnackbarProvider({ children }) {
  return (
    <SnackbarContext.Provider
      value={{
        showSnackbar: jest.fn,
        messageType: { error: 'error', success: 'success' },
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
}

MockedSnackbarProvider.propTypes = {
  children: PropTypes.node.isRequired
};
