import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import LeadManagementUserImport from '../Containers/LeadManagementUserImport';
import * as utils from '../../utils';
import { ImportCreate } from '../../../../graphql/mutations';

jest.mock('@rails/activestorage/src/file_checksum', async () => jest.fn());
jest.useFakeTimers();
describe('LeadManagementUserImport component', () => {
  it('should render upload errors when csv file has errors', async () => {
    const container = render(
      <MockedProvider mocks={[]}>
        <BrowserRouter>
          <LeadManagementUserImport />
        </BrowserRouter>
      </MockedProvider>
    );
    expect(
      container.queryByText(/You can upload a .csv file with multiple users./)
    ).toBeInTheDocument();

    const rows = [
      'Name,email,title',
      ',bah@gmail.com The BigBoss',
      'Njoroge,njeri@gmail.com The BigBossLady'
    ];
    const file = new Blob([rows.join('\n')], {
      type: 'csv',
      name: 'sample.csv'
    });

    jest
      .spyOn(utils, 'csvValidate')
      .mockImplementation(() => ['<div> Name is required in the 1st row 2nd column</div>']);

    const uploadButton = container.queryByTestId('lead-csv-input-button');
    fireEvent.click(uploadButton);
    const inputElement = container.queryByTestId('lead-csv-input');

    fireEvent.change(inputElement, { target: { files: [file] } });

    await waitFor(() => {});
    // assert errors are on the ui
    expect(container.queryByTestId('lead-csv-errors')).toBeInTheDocument();
    expect(
      container.queryByText(/Name is required in the 1st row 2nd column/i)
    ).toBeInTheDocument();
  });

  it('should upload  when csv file has no errors', async () => {
    const rows = [
      'Name,email,title',
      'Waweru,bah@gmail.com The BigBoss',
      'Njoroge,njeri@gmail.com The BigBossLady'
    ];
    const file = new Blob([rows.join('\n')], {
      type: 'csv'
    });
    file.name = 'sample_csv.csv';
    jest.spyOn(utils, 'csvValidate').mockImplementation(() => []);
    jest.spyOn(utils, 'readFileAsText').mockResolvedValue('image content123123');
    const importCreateMutationMock = [
      {
        request: {
          query: ImportCreate,
          variables: {
            csvString: 'image content123123',
            csvFileName: 'sample_csv.csv',
            importType: 'lead'
          }
        },
        result: {
          data: {
            usersImport: {
              success: true
            }
          }
        }
      }
    ];

    const container = render(
      <MockedProvider mocks={importCreateMutationMock} addTypename={false}>
        <BrowserRouter>
          <LeadManagementUserImport />
        </BrowserRouter>
      </MockedProvider>
    );
    const uploadButton = container.queryByTestId('lead-csv-input-button');
    fireEvent.click(uploadButton);
    const inputElement = container.queryByTestId('lead-csv-input');

    fireEvent.change(inputElement, { target: { files: [file] } });

    await waitFor(() => {
      // assert ui state
      const importButton = container.queryByTestId('import-btn');
      expect(importButton).toBeInTheDocument();
      expect(container.queryByTestId('cancel-btn')).toBeInTheDocument();
      fireEvent.click(importButton); // this is the culprit
      expect(container.queryByTestId('loader')).toBeInTheDocument();
    });
  });
});
