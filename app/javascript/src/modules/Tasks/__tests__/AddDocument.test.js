import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import AddDocument from '../Components/AddDocument';
import authState from '../../../__mocks__/authstate';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import MockedSnackbarProvider, { mockedSnackbarProviderProps } from '../../__mocks__/mock_snackbar';
import { SnackbarContext } from '../../../shared/snackbar/Context';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Add Document', () => {
  it('renders properly Add document', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedSnackbarProvider>
              <AddDocument
                onChange={jest.fn()}
                status="DONE"
                signedBlobId="302df8c3-27bb-4175-adc1-43857e9"
                taskId="302df8c3-27bb-4175-adc1-43857e972eb4"
                refetch={jest.fn()}
              />
            </MockedSnackbarProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('add_document')).toBeInTheDocument();
      fireEvent.click(screen.queryByTestId('add_document'));
    });
  });

  it('renders with error', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
              <AddDocument
                onChange={jest.fn()}
                status="ERROR"
                signedBlobId="302df8c3-27bb-4175-adc1-43857e9"
                taskId="302df8c3-27bb-4175-adc1-43857e972eb4"
                refetch={jest.fn()}
              />
            </SnackbarContext.Provider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
        type: mockedSnackbarProviderProps.messageType.error,
        message: 'document.upload_error'
      });
    });
  });
});
