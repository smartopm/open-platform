import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import LeadEvents from '../Components/LeadEvents';
import { UserMeetingsQuery, UserSignedDealsQuery } from '../graphql/queries';
import { LeadDetailsQuery } from '../../../../graphql/queries';
import CreateEvent from '../graphql/mutations';

import MockedThemeProvider from '../../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('LeadEvents Page', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  const DOWN_ARROW = { keyCode: 40 };

  const dataMock = [
    {
      request: {
        query: LeadDetailsQuery,
        variables: { id: authState?.user?.id }
      },
      result: {
        data: {
          user: {
            africanPresence: 'Everywhere',
            title: 'Everywhere',
            userType: 'Admin',
            imageUrl: '',
            subStatus: '',
            extRefId: '',
            expiresAt: null,
            state: 'valid',
            labels: null,
            contactDetails: null,
            contactInfos: null,
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
            country: 'Algeria',
            createdBy: 'Daniel Mutuba',
            email: 'daniel@doublegdp.com',
            firstContactDate: '2022-02-26T08:48:00Z',
            followupAt: '2022-02-09T21:00:00Z',
            id: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99',
            industry: 'Communications',
            industryBusinessActivity: 'Manufacturing',
            industrySubSector: 'Freight/Distribution Services',
            lastContactDate: '2022-02-25T08:48:00Z',
            leadOwner: 'Daniel Mutuba',
            leadSource: 'Inbound inquiry',
            leadStatus: 'Evaluation',
            leadTemperature: 'Neutral',
            leadType: 'Investment fund',
            levelOfInternationalization: 'Exporting to West Africa',
            linkedinUrl: 'https://www.linkedin.com/in/daniel-mutuba-31748190/',
            modifiedBy: 'Daniel Mutuba',
            name: 'Daniel Mutuba',
            nextSteps: 'Move to South America',
            phoneNumber: '10234567876',
            region: 'Baltics',
            relevantLink: 'today is hot',
            roleName: 'Admin',
            secondaryEmail: '',
            secondaryPhoneNumber: ''
          }
        }
      }
    }
  ];

  const queriesMock = [
    {
      request: {
        query: UserMeetingsQuery,
        variables: { userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99' }
      },
      result: {
        data: {
          leadMeetings: [
            {
              id: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e9990099',
              name: 'Tilisi Stakeholders Meeting',
              createdAt: new Date(),
              actingUser: {
                name: 'Daniel Mutuba'
              }
            }
          ]
        }
      }
    },
    {
      request: {
        query: UserSignedDealsQuery,
        variables: { userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99' }
      },
      result: {
        data: {
          signedDeals: [
            {
              id: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e9990099',
              name: 'Tilisi First Deal Signed',
              createdAt: new Date(),
              actingUser: {
                name: 'Daniel Mutuba'
              }
            }
          ]
        }
      }
    }
  ];

  const eventRequestDataMock = [
    ...queriesMock,
    {
      request: {
        query: CreateEvent,
        variables: {
          userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99',
          name: 'First Tilisi meeting',
          logType: 'meeting'
        }
      },
      result: {
        data: {
          leadLogCreate: {
            success: true
          }
        }
      }
    }
  ];

  it('Creates a meeting event', async () => {
    render(
      <MockedProvider mocks={eventRequestDataMock} addTypename={false}>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <LeadEvents
                userId="c96f64bb-e3b4-42ff-b6a9-66889ec79e99"
                data={dataMock[0].result.data}
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('meetings')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('meetings_header')).toBeInTheDocument();
      expect(screen.queryByText('lead_management.meetings')).toBeInTheDocument();
      const eventTextField = screen.getByLabelText('lead_management.meeting_name');
      userEvent.type(eventTextField, 'First Tilisi meeting');
      const saveButton = screen.queryByTestId('add-meeting-button');
      // // user input should set add button enabled
      expect(saveButton).toBeEnabled();
    });

    // clicking on the add button should submit current data
    await waitFor(() => {
      fireEvent.click(screen.queryByTestId('add-meeting-button'));
    });
  });

  it('Adds a division', async () => {
    render(
      <MockedProvider mocks={eventRequestDataMock} addTypename={false}>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <LeadEvents
                userId="c96f64bb-e3b4-42ff-b6a9-66889ec79e99"
                data={dataMock[0].result.data}
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('division')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('division_header')).toBeInTheDocument();
      expect(screen.queryByText('lead_management.division')).toBeInTheDocument();
    });
  });
});
