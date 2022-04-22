import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import authState from '../../../../__mocks__/authstate';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import LeadEvents from '../Components/LeadEvents';
import { UserEventsQuery, UserMeetingsQuery, UserSignedDealsQuery } from '../graphql/queries';
import CreateEvent from '../graphql/mutations';

import MockedThemeProvider from '../../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('LeadEvents Page', () => {
  const dataMock = [
    {
      request: {
        query: CreateEvent,
        variables: {
          userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99',
          name: 'First Tilisi run',
          logType: 'event'
        }
      },
      result: {
        data: {
          leadLogCreate: {
            success: true
          }
        }
      }
    },
    {
      request: {
        query: UserEventsQuery,
        variables: { userId: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e99' }
      },
      result: {
        data: {
          leadEvents: [
            {
              id: 'c96f64bb-e3b4-42ff-b6a9-66889ec79e9990099',
              name: 'Tilisi run',
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

  it('LeadEvents component', async () => {
    render(
      <MockedProvider mocks={dataMock} addTypename={false}>
        <Context.Provider value={authState}>
          <BrowserRouter>
            <MockedThemeProvider>
              <LeadEvents userId="c96f64bb-e3b4-42ff-b6a9-66889ec79e99" />
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('events')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('events_header')).toBeInTheDocument();
      expect(screen.queryByText('lead_management.events')).toBeInTheDocument();
      expect(screen.queryByText('lead_management.events_header')).toBeInTheDocument();
      const eventTextField = screen.getByLabelText('lead_management.event_name');
      userEvent.type(eventTextField, 'First Tilisi run');
      const saveButton = screen.getAllByRole('button')[0];
      // user input should set add button enabled
      expect(saveButton).toBeEnabled();
    });

    // clicking on the add button should submit current data
    await waitFor(() => {
      fireEvent.click(screen.getAllByRole('button')[0]);
    });
  });
});
