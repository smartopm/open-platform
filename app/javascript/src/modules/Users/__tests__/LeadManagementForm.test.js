import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import { LeadDetailsQuery } from '../../../graphql/queries';
import LeadManagementForm from '../Components/LeadManagementForm';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('LeadManagementDetails Page', () => {
  const leadDataMock = [
    {
      request: {
        query: LeadDetailsQuery,
        variables: { id: authState?.user?.id }
      },
      result: {
        data: {
          user: {
            africanPresence: 'Everywhere',
            avatarUrl:
              'https://daniel.dgdp.site/rails/active_storage/blobs/redirect/eyRsa0xU-unsplash.jpg',
            clientCategory: 'industryAssociation',
            companyAnnualRevenue: '$112234442',
            companyContacted: '30',
            companyDescription: 'Real estate company',
            companyEmployees: '50000',
            companyLinkedin: 'blah',
            companyName: 'Tatu City',
            companyWebsite: 'www.westernseedcompany.com',
            country: 'bhutan',
            createdBy: 'Daniel Mutuba',
            email: 'daniel@doublegdp.com',
            firstContactDate: '2022-02-26T08:48:00Z',
            followupAt: '2022-02-09T21:00:00Z',
            id: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99',
            industry: 'consumerProducts',
            industryBusinessActivity: 'manufacturing',
            industrySubSector: 'businessSupportServices',
            lastContactDate: '2022-02-25T08:48:00Z',
            leadOwner: 'Daniel Mutuba',
            leadSource: 'inboundInquiry',
            leadStatus: 'investimentMotiveVerified',
            leadTemperature: 'neutral',
            leadType: 'investmentFund',
            levelOfInternationalization: 'exportingToNigeria',
            linkedinUrl: 'https://www.linkedin.com/in/daniel-mutuba-31748190/',
            modifiedBy: 'Daniel Mutuba',
            name: 'Daniel Mutuba',
            nextSteps: 'Move to South America',
            phoneNumber: '10234567876',
            region: 'cWOfIndStates',
            relevantLink: 'today is hot',
            roleName: 'Admin',
            secondaryEmail: null,
            secondaryPhoneNumber: null
          }
        }
      }
    }
  ];

  it('LeadManagementDetails component', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={leadDataMock} addTypename>
          <BrowserRouter>
            <LeadManagementForm userId={authState?.user?.id} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
        expect(screen.queryByTestId('lead-management-form')).toBeInTheDocument();
      //   expect(screen.queryByTestId('lead-management-main-contact-section')).toBeInTheDocument();
      //   expect(screen.queryByTestId('lead-management-lead-information-section')).toBeInTheDocument();

      //   expect(
      //     screen.queryByTestId('lead-management-secondary-info-section-header')
      //   ).toBeInTheDocument();

      //   expect(screen.queryByTestId('lead-management-company-section')).toBeInTheDocument();
    });
  });
});
