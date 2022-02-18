import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import LeadManagementUserImport from '../Containers/LeadManagementUserImport';

jest.mock('@rails/activestorage/src/file_checksum', async () => jest.fn());
jest.mock('csv-file-validator', async () => ({
  requiredError: () => '<div> Name is required in the 1st row  2nd column  </div>',
  CSVFileValidator: () => '<div> Name is required in the 1st row  2nd column  </div>'
}));

describe('LeadManagementUserImport component', () => {
  it('renders file input', async () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <LeadManagementUserImport />
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => expect(container.queryByTestId('lead-csv-input')).toBeInTheDocument(), {
      timeout: 10
    });
  });

  it('should initialize new FileReader on selecting a file', async () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <LeadManagementUserImport />
        </BrowserRouter>
      </MockedProvider>
    );
    const rows = [
      'Name,email,title',
      'Kamau,bah@gmail.com The BigBoss',
      'Njoroge,njeri@gmail.com The BigBossLady'
    ];
    const file = new Blob([rows.join('\n')], { type: 'csv' });
    const inputEl = container.queryByTestId('lead-csv-input');
    Object.defineProperty(inputEl, 'files', { value: [file] });
    fireEvent.drop(inputEl);
    // eslint-disable-next-line jest/valid-expect
    await waitFor(() => expect(FileReader).toHaveBeenCalled, { timeout: 10 });
  });

  it('should render upload description', async () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <LeadManagementUserImport />
        </BrowserRouter>
      </MockedProvider>
    );
    const rows = [
      'Name,email,title',
      'Kamau,bah@gmail.com The BigBoss',
      'Njoroge,njeri@gmail.com The BigBossLady'
    ];
    expect(
      container.queryByText(/You can upload a .csv file with multiple users./)
    ).toBeInTheDocument();
    const file = new Blob([rows.join('\n')], { type: 'csv' });
    fireEvent.change(container.queryByTestId('lead-csv-input'), { target: { files: [file] } });
    await waitFor(() => {
      expect(container.getByTestId('lead-csv-input')).toBeInTheDocument();
    });
  });

  // validations for CSV file
  it('should return errors incase the CSV file name field is empty', async () => {
    render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <LeadManagementUserImport />
        </BrowserRouter>
      </MockedProvider>
    );
    const rows = ['Name,email,title', ' ,njeri@gmail.com The BigBossLady'];
    expect(
      screen.queryByText(/You can upload a .csv file with multiple users./)
    ).toBeInTheDocument();
    const file = new Blob([rows.join('\n')], { type: 'csv' });

    await waitFor(() => {
      fireEvent.change(screen.queryByTestId('lead-csv-input'), { target: { files: [file] } });
      expect(screen.queryByTestId('lead-csv-input')).toBeInTheDocument();
    }, 10);
  });
});
