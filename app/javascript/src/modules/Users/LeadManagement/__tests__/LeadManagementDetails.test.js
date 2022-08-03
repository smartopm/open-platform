import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import LeadManagementDetails from '../Components/LeadManagementDetails';
import { LeadDetailsQuery, LeadLabelsQuery } from '../../../../graphql/queries';
import MockedThemeProvider from '../../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('LeadManagementDetails Page', () => {
  const dataMock = [
    {
      request: {
        query: LeadDetailsQuery,
        variables: { id: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99' }
      },
      result: {
        data: {
          user: {
            africanPresence: 'Everywhere',
            avatarUrl:
              'https://daniel.dgdp.site/rails/active_storage/blobs/redirect/eyRsa0xU-unsplash.jpg',
            clientCategory: 'Industry Association',
            companyAnnualRevenue: '$112234442',
            companyContacted: '30',
            companyDescription: 'Real estate company',
            companyEmployees: '50000',
            companyLinkedin: 'blah',
            companyName: 'Tatu City',
            companyWebsite: 'www.westernseedcompany.com',
            country: 'Bhutan',
            createdBy: 'Daniel Mutuba',
            email: 'daniel@doublegdp.com',
            firstContactDate: '2022-02-26T08:48:00Z',
            followupAt: '2022-02-09T21:00:00Z',
            id: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99',
            industry: 'Software & IT services',
            industryBusinessActivity: 'Manufacturing',
            industrySubSector: 'Retail banking',
            lastContactDate: '2022-02-25T08:48:00Z',
            leadOwner: 'Daniel Mutuba',
            leadSource: 'Inbound inquiry',
            leadStatus: 'Evaluation',
            leadTemperature: 'Neutral',
            leadType: 'Investment fund',
            levelOfInternationalization: 'Exporting to Nigeria',
            linkedinUrl: 'https://www.linkedin.com/in/daniel-mutuba-31748190/',
            modifiedBy: 'Daniel Mutuba',
            name: 'Daniel Mutuba',
            title: 'The Boss',
            userType: 'admin',
            imageUrl: "https://www.linkedin.com/in/daniel-mutuba-31748190/'",
            extRefId: '',
            subStatus: '',
            nextSteps: 'Move to South America',
            phoneNumber: '10234567876',
            region: 'C.W. Of Ind. States',
            division: 'China',
            relevantLink: 'today is hot',
            roleName: 'Admin',
            secondaryEmail: '',
            expiresAt: new Date(),
            state: '',
            kickOffDate: '',
            capexAmount: '',
            jobsCreated: '',
            jobsTimeline: '',
            investmentSize: '',
            investmentTimeline: '',
            decisionTimeline: '',
            secondaryPhoneNumber: '',
            taskId: '6a7e722a-9bd5-48d4-aaf7-f3285ccff4a3',
            labels: [],
            contactInfos: [],
            contactDetails: {
              primaryContact: {
                name: '',
                title: '',
                primaryEmail: '',
                secondaryEmail: '',
                primaryPhoneNumber: '',
                secondaryPhoneNumber: '',
                linkedinUrl: ''
              },
              secondaryContact1: {
                name: '',
                title: '',
                primaryEmail: '',
                secondaryEmail: '',
                primaryPhoneNumber: '',
                secondaryPhoneNumber: '',
                linkedinUrl: ''
              },
              secondaryContact2: {
                name: '',
                title: '',
                primaryEmail: '',
                secondaryEmail: '',
                primaryPhoneNumber: '',
                secondaryPhoneNumber: '',
                linkedinUrl: ''
              }
            }
          }
        }
      }
    },
    {
      request: {
        query: LeadLabelsQuery,
        variables: { userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99' }
      },
      result: {
        data: {
          leadLabels: [
            {
              color: '#f07030',
              groupingName: 'Status',
              id: '50077585-b04e-445f-87b6-5aa752353a0b',
              shortDesc: 'QualifiedLead',
              __typename: 'Label'
            },
            {
              color: '#2c8bd0',
              groupingName: 'Division',
              id: 'b7074b29-f63e-4c83-9884-8f95542069fe',
              shortDesc: 'Europe',
              __typename: 'Label'
            }
          ]
        }
      }
    }
  ];

  it('LeadManagementDetails component', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={dataMock} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <LeadManagementDetails userId="c96f64bb-e3b4-42ff-b6a9-66889ec79e99" />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('lead-management-container-header')).toBeInTheDocument();
      expect(screen.queryByText('lead_management.main_header')).toBeInTheDocument();
      // assert tab headers are present
      expect(screen.queryByText('lead_management.detail_header')).toBeInTheDocument();
      expect(screen.queryByText('lead_management.task_header')).toBeInTheDocument();
      expect(screen.queryByText('lead_management.event_header')).toBeInTheDocument();

      expect(screen.queryByTestId('lead-management-tabs')).toBeInTheDocument();

      expect(screen.queryByTestId('lead-management-details-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-management-task-tab')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-management-event-tab')).toBeInTheDocument();

      expect(screen.queryByTestId('lead-management-form')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-management-main-contact-section')).toBeInTheDocument();
      expect(screen.queryByTestId('lead-management-lead-information-section')).toBeInTheDocument();

      expect(
        screen.queryByTestId('lead-management-secondary-info-section-header')
      ).toBeInTheDocument();

      expect(screen.queryByTestId('lead-management-company-section')).toBeInTheDocument();
    }, 10);

    // assert the details tab, loads and is visible in the dom

    expect(screen.queryByTestId('contact_info')).toBeInTheDocument();

    expect(screen.queryByText('lead_management.save_updates')).toBeInTheDocument();
    expect(screen.queryAllByText('lead_management.name')[0]).toBeInTheDocument();

    expect(screen.queryAllByText('lead_management.linkedin_url')[0]).toBeInTheDocument();

    expect(screen.queryAllByText('lead_management.primary_email')[0]).toBeInTheDocument();
  });
});
