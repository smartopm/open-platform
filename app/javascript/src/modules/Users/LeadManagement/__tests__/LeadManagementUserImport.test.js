import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';

import LeadManagementUserImport from '../Containers/LeadManagementUserImport';
import * as utils from '../../utils';
import { ImportCreate } from '../../../../graphql/mutations';

jest.mock('@rails/activestorage/src/file_checksum', async () => jest.fn());
describe('LeadManagementUserImport component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
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
      expect(container.queryByTestId('cancel-btn')).toBeInTheDocument();
    }, 10);
    expect(await screen.findByTestId('import-btn')).toBeInTheDocument();
    fireEvent.click(await screen.findByTestId('import-btn'));
    expect(
      await screen.findByText(
        "Your import is currently being processed. You'll receive a mail when it's done."
      )
    ).toBeInTheDocument();
  });

  it('should not upload  when csv file has name field errors', async () => {
    const rows = [
      '',
      'CEO',
      'MJC@acmefabrics.com',
      'MJC@gmail.com',
      '5320000000',
      '5320002121',
      'Linkedin.com/mjc',
      'Porter Smith',
      'Overseas Developement',
      'PS@acmefabrics.com',
      'PS@gmail.com',
      '53211111111',
      '532121121212',
      'LinkedIn.com/ps',
      'Jeff Knobel',
      'Bank Coordinator',
      'JK@acmefabrics.com',
      'Jk@gmail.com',
      '532222222',
      '5324444444',
      'LinkedIn.com/jk',
      'Acme Fabrics',
      'Fabric manufaturing',
      'LinkedIn.com/Acme-Fabrics',
      'AcmeFabrics.com',
      'google.com',
      'Nigeria',
      'Sub-Saharan Africa',
      'Textiles',
      'Clothing & clothing accessories',
      'Manufacturing',
      'Exporting to Africa',
      '128',
      '220000',
      'yes',
      'Neutral',
      'Evaluation',
      'Company',
      'Network',
      'Multilateral Organization',
      'Yes',
      '2021-09-02',
      '1,000',
      'in 3 years',
      '1 year',
      '30 days',
      'Presentation',
      'Jo Jo Miller',
      '2022-03-01',
      'Jo Jo Miller',
      'Jo Jo Miller',
      'James Farley',
      '2022-02-08',
      '2022-03-01'
    ];
    let csv =
      'Name,Title,Email,Secondary Email,Primary Phone,Secondary Phone,LinkedIn,Contact 1 Name,Contact 1 Title,Contact 1 Primary Email,Contact 1 Secondary Email,Contact 1 Primary Phone,Contact 1 Secondary Phone,Contact 1 LinkedIn,Contact 2 Name,Contact 2 Title,Contact 2 Primary Email,Contact 2 Secondary Email,Contact 2 Primary Phone,Contact 2 Secondary Phone,Contact 2 LinkedIn,Company Name,Company Description,Company LinkedIn,Company Website,Relevant Links,Country,Region,Industry Sector,Industry Sub Sector,Industry Business Activity,Level of Internationalization,Number of Employees,Annual Revenue,African Presences,Lead Temperature,Lead Status,Lead Type,Lead Source,Client Category,Company Contacted,Next Steps,Lead Owner,Created By,Modified By,First Contact Date,Last Contact Date,Date Follow Up,Kick Off Date,Capex Amount,Jobs,Jobs Timeline,Investment Size,Investment Timeline that is wrong,Decision Timeline\n';
    csv += rows.join(',');
    jest.spyOn(utils, 'readFileAsText').mockResolvedValue('image content123123');
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <LeadManagementUserImport />
        </BrowserRouter>
      </MockedProvider>
    );

    const uploadButton = container.queryByTestId('lead-csv-input-button');
    fireEvent.click(uploadButton);
    const inputElement = container.queryByTestId('lead-csv-input');
    fireEvent.change(inputElement, { target: { files: [csv] } });
    await waitFor(() => {
      // assert ui state
      expect(container.queryByTestId('lead-csv-errors')).toBeInTheDocument();
      expect(screen.getByText('Name is required in the 2nd row 1st column.')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Header name Investment Timeline that is wrong is not correct or missing in the 1 row / 54 column. The Header name should be Investment Timeline'
        )
      ).toBeInTheDocument();
    });
  });

  it('should not upload  when csv file has wrong selector fields', async () => {
    const rows = [
      'Chechin',
      'CEO',
      'MJC@acmefabrics.com',
      'MJC@gmail.com',
      '5320000000',
      '5320002121',
      'Linkedin.com/mjc',
      'Porter Smith',
      'Overseas Developement',
      'PS@acmefabrics.com',
      'PS@gmail.com',
      '53211111111',
      '532121121212',
      'LinkedIn.com/ps',
      'Jeff Knobel',
      'Bank Coordinator',
      'JK@acmefabrics.com',
      'Jk@gmail.com',
      '532222222',
      '5324444444',
      'LinkedIn.com/jk',
      'Acme Fabrics',
      'Fabric manufaturing',
      'LinkedIn.com/Acme-Fabrics',
      'AcmeFabrics.com',
      'google.com',
      'Nigeria is wrong',
      'Sub-Saharan Africa is wrong',
      'Textiles is wrong',
      'Clothing & clothing accessories is wrong',
      'Manufacturing is wrong',
      'Exporting to Africa is wrong',
      '128',
      '220000',
      'yes',
      'Neutral is wrong',
      'Evaluation is wrong',
      'Company is wrong ',
      'Network is wrong',
      'Multilateral Organization is wrong',
      'Yes',
      '2021-09-02',
      '1,000',
      'in 3 years',
      '1 year',
      '30 days',
      'Presentation',
      'Jo Jo Miller',
      '2022-03-01',
      'Jo Jo Miller',
      'Jo Jo Miller',
      'James Farley',
      '2022-02-08',
      '2022-03-01'
    ];
    let csv =
      'Name,Title,Email,Secondary Email,Primary Phone,Secondary Phone,LinkedIn,Contact 1 Name,Contact 1 Title,Contact 1 Primary Email,Contact 1 Secondary Email,Contact 1 Primary Phone,Contact 1 Secondary Phone,Contact 1 LinkedIn,Contact 2 Name,Contact 2 Title,Contact 2 Primary Email,Contact 2 Secondary Email,Contact 2 Primary Phone,Contact 2 Secondary Phone,Contact 2 LinkedIn,Company Name,Company Description,Company LinkedIn,Company Website,Relevant Links,Country,Region,Industry Sector,Industry Sub Sector,Industry Business Activity,Level of Internationalization,Number of Employees,Annual Revenue,African Presences,Lead Temperature,Lead Status,Lead Type,Lead Source,Client Category,Company Contacted,Next Steps,Lead Owner,Created By,Modified By,First Contact Date,Last Contact Date,Date Follow Up,Kick Off Date,Capex Amount,Jobs,Jobs Timeline,Investment Size,Investment Timeline,Decision Timeline\n';
    csv += rows.join(',');
    jest.spyOn(utils, 'readFileAsText').mockResolvedValue('image content123123');
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <LeadManagementUserImport />
        </BrowserRouter>
      </MockedProvider>
    );

    const uploadButton = container.queryByTestId('lead-csv-input-button');
    fireEvent.click(uploadButton);
    const inputElement = container.queryByTestId('lead-csv-input');
    fireEvent.change(inputElement, { target: { files: [csv] } });
    await waitFor(() => {
      // assert ui state to have selector field errors
      expect(container.queryByTestId('lead-csv-errors')).toBeInTheDocument();
      // Country field is wrong
      expect(
        screen.getByText('Country is not valid in the 2nd row 27th column.')
      ).toBeInTheDocument();
      // Region field is wrong
      expect(
        screen.getByText('Region is not valid in the 2nd row 28th column.')
      ).toBeInTheDocument();
      // Industry Sector field is wrong
      expect(
        screen.getByText('Industry Sector is not valid in the 2nd row 29th column.')
      ).toBeInTheDocument();
      // Industry Sub Sector field is wrong
      expect(
        screen.getByText('Industry Sub Sector is not valid in the 2nd row 30th column.')
      ).toBeInTheDocument();
      // Industry Business Activity field is wrong
      expect(
        screen.getByText('Industry Business Activity is not valid in the 2nd row 31st column.')
      ).toBeInTheDocument();
      // Level of Internationalization field is wrong
      expect(
        screen.getByText('Level of Internationalization is not valid in the 2nd row 32nd column.')
      ).toBeInTheDocument();
      // Lead Status is wrong
      expect(
        screen.getByText('Lead Status is not valid in the 2nd row 37th column.')
      ).toBeInTheDocument();

      // Lead Type is Wrong
      expect(
        screen.getByText('Lead Type is not valid in the 2nd row / 38th column.')
      ).toBeInTheDocument();
      // Lead Source is wrong
      expect(
        screen.getByText('Lead Source is not valid in the 2nd row 39th column.')
      ).toBeInTheDocument();

      // Client Category is wrong
      expect(
        screen.getByText('Client Category is not valid in the 2nd row 40th column.')
      ).toBeInTheDocument();
    });
  });

  it('should upload  when csv file has empty selector fields', async () => {
    const rows = [
      'Chechin',
      'CEO',
      'MJC@acmefabrics.com',
      'MJC@gmail.com',
      '5320000000',
      '5320002121',
      'Linkedin.com/mjc',
      'Porter Smith',
      'Overseas Developement',
      'PS@acmefabrics.com',
      'PS@gmail.com',
      '53211111111',
      '532121121212',
      'LinkedIn.com/ps',
      'Jeff Knobel',
      'Bank Coordinator',
      'JK@acmefabrics.com',
      'Jk@gmail.com',
      '532222222',
      '5324444444',
      'LinkedIn.com/jk',
      'Acme Fabrics',
      'Fabric manufaturing',
      'LinkedIn.com/Acme-Fabrics',
      'AcmeFabrics.com',
      'google.com',
      '',
      '',
      '',
      '',
      '',
      '',
      '128',
      '220000',
      'yes',
      '',
      '',
      '',
      '',
      '',
      'Yes',
      '2021-09-02',
      '1,000',
      'in 3 years',
      '1 year',
      '30 days',
      'Presentation',
      'Jo Jo Miller',
      '2022-03-01',
      'Jo Jo Miller',
      'Jo Jo Miller',
      'James Farley',
      '2022-02-08',
      '2022-03-01'
    ];
    let csv =
      'Name,Title,Email,Secondary Email,Primary Phone,Secondary Phone,LinkedIn,Contact 1 Name,Contact 1 Title,Contact 1 Primary Email,Contact 1 Secondary Email,Contact 1 Primary Phone,Contact 1 Secondary Phone,Contact 1 LinkedIn,Contact 2 Name,Contact 2 Title,Contact 2 Primary Email,Contact 2 Secondary Email,Contact 2 Primary Phone,Contact 2 Secondary Phone,Contact 2 LinkedIn,Company Name,Company Description,Company LinkedIn,Company Website,Relevant Links,Country,Region,Industry Sector,Industry Sub Sector,Industry Business Activity,Level of Internationalization,Number of Employees,Annual Revenue,African Presences,Lead Temperature,Lead Status,Lead Type,Lead Source,Client Category,Company Contacted,Next Steps,Lead Owner,Created By,Modified By,First Contact Date,Last Contact Date,Date Follow Up,Kick Off Date,Capex Amount,Jobs,Jobs Timeline,Investment Size,Investment Timeline,Decision Timeline\n';
    csv += rows.join(',');
    jest.spyOn(utils, 'readFileAsText').mockResolvedValue('image content123123');
    const container = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <BrowserRouter>
          <LeadManagementUserImport />
        </BrowserRouter>
      </MockedProvider>
    );

    const uploadButton = container.queryByTestId('lead-csv-input-button');
    fireEvent.click(uploadButton);
    const inputElement = container.queryByTestId('lead-csv-input');
    fireEvent.change(inputElement, { target: { files: [csv] } });
    await waitFor(() => {
      // assert ui state to have no selector field errors
      expect(container.queryByTestId('lead-csv-errors')).not.toBeInTheDocument();
    });
  });
});
