import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import TaskDocuments from '../Components/TaskDocuments';
import authState from '../../../__mocks__/authstate';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../__mocks__/mock_theme'
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Task Documents', () => {
  const data = {
    task: {
      attachments: [
        {
          id: '92348129',
          filename: 'picture.png',
          url: 'https://picture.png',
          created_at: '2020-10-01',
          uploaded_by: 'John Doe'
        }
      ]
    }
  };

  it('renders properly when there are documents', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedThemeProvider>
          <MockedProvider>
            <BrowserRouter>
              <MockedSnackbarProvider>
                <TaskDocuments loading={false} refetch={jest.fn()} status="FILE_RESIZE" data={data} />
              </MockedSnackbarProvider>
            </BrowserRouter>
          </MockedProvider>
        </MockedThemeProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('progress-bar')).toBeInTheDocument();
      expect(screen.queryByTestId('filename')).toBeInTheDocument();
      expect(screen.queryByTestId('filename').textContent).toContain('picture.png');
      expect(screen.queryByTestId('uploaded_at')).toBeInTheDocument();
      expect(screen.queryByTestId('uploaded_at').textContent).toContain('2020-10-01');
      expect(screen.queryByTestId('uploaded_by')).toBeInTheDocument();
      expect(screen.queryByTestId('uploaded_by').textContent).toContain('John Doe');
      expect(screen.queryByTestId('more_details')).toBeInTheDocument();

      fireEvent.click(screen.queryByTestId('more_details'));
      expect(screen.queryByText('document.download')).toBeInTheDocument();
      expect(screen.queryByText('document.delete')).toBeInTheDocument();

      fireEvent.click(screen.queryByTestId('delete_button'));
      expect(screen.queryByText('document.delete_confirmation_message')).toBeInTheDocument();
      expect(screen.queryByTestId('proceed_button')).toBeInTheDocument();

      fireEvent.click(screen.queryByTestId('proceed_button'));
    });
  });
});
