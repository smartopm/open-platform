import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import AddDocument from '../Components/AddDocument';
import authState from '../../../__mocks__/authstate';
import { Context } from '../../../containers/Provider/AuthStateProvider';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Add Document', () => {
  it('renders properly Add document', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <AddDocument
              onChange={jest.fn()}
              status="DONE"
              signedBlobId="302df8c3-27bb-4175-adc1-43857e9"
              taskId="302df8c3-27bb-4175-adc1-43857e972eb4"
              refetch={jest.fn()}
            />
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
            <AddDocument
              onChange={jest.fn()}
              status="ERROR"
              signedBlobId="302df8c3-27bb-4175-adc1-43857e9"
              taskId="302df8c3-27bb-4175-adc1-43857e972eb4"
              refetch={jest.fn()}
            />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText('document.upload_error')).toBeInTheDocument();
    });
  });
});
