import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UsersImport from '../Containers/UsersImport';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

jest.mock('@rails/activestorage/src/file_checksum', async () => jest.fn());
describe('UsersImport component', () => {
  it('renders file input', async () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <MockedSnackbarProvider>
              <UsersImport />
            </MockedSnackbarProvider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => expect(container.queryByTestId('csv-input')).toBeInTheDocument(), {
      timeout: 10
    });
  });

  it('should initialize new FileReader on selecting a file', async () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <MockedSnackbarProvider>
              <UsersImport />
            </MockedSnackbarProvider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    const rows = ['NAME,ADDRESS,ZIP', 'james,1800 sunny ln,40000', 'ronda,1200 peaches ln,50000'];
    const file = new Blob([rows.join('\n')], { type: 'csv' });
    const inputEl = container.queryByTestId('csv-input');
    Object.defineProperty(inputEl, 'files', { value: [file] });
    fireEvent.drop(inputEl);
    // eslint-disable-next-line jest/valid-expect
    await waitFor(() => expect(FileReader).toHaveBeenCalled, { timeout: 10 });
  });

  it('should render upload description', async () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <MockedThemeProvider>
            <MockedSnackbarProvider>
              <UsersImport />
            </MockedSnackbarProvider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      const rows = ['NAME,ADDRESS,ZIP', 'james,1800 sunny ln,40000', 'ronda,1200 peaches ln,50000'];
      expect(container.queryByText(/You can upload a .csv file with users./)).toBeInTheDocument();
      const file = new Blob([rows.join('\n')], { type: 'csv' });
      fireEvent.change(container.queryByTestId('csv-input'), { target: { files: [file] } });
      expect(container.getByTestId('csv-input')).toBeInTheDocument();
    });
  });
});
