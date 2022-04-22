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
          name: 'First Tilisi run',
          logType: 'event',
          userId: authState.user.id
        }
      },
      result: {
        data: {
          leadLog: {
            createdAt: new Date(),
            logType: 'event',
            name: 'First Tilisi run',
            __typename: 'LeadLog'
          },
          __typename: 'LeadLog'
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
                name: 'Daniel Mutuba',
                __typename: 'User'
              },
              __typename: 'LeadLog'
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
                name: 'Daniel Mutuba',
                __typename: 'User'
              },
              __typename: 'LeadLog'
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
                name: 'Daniel Mutuba',
                __typename: 'User'
              },
              __typename: 'LeadLog'
            }
          ]
        }
      }
    }
  ];

  it('LeadEvents component', async () => {
    render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={dataMock}>
          <BrowserRouter>
            <MockedThemeProvider>
              <LeadEvents userId="c96f64bb-e3b4-42ff-b6a9-66889ec79e99" />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    await waitFor(() => {
      expect(screen.queryAllByTestId('events')[0]).toBeInTheDocument();
      expect(screen.queryByTestId('events_header')).toBeInTheDocument();
      expect(screen.queryByText('lead_management.events')).toBeInTheDocument();
      expect(screen.queryByText('lead_management.events_header')).toBeInTheDocument();
      const eventTextField = screen.getByLabelText('lead_management.event_name');
      userEvent.type(eventTextField, 'Tilisi run');
      const saveButton = screen.getAllByRole('button')[0];

      expect(saveButton).toBeEnabled();
      // submit user data
      fireEvent.click(saveButton);
    });

    screen.debug();
    // assert the details tab, loads and is visible in the dom

    // expect(screen.queryByTestId('contact_info')).toBeInTheDocument();

    // expect(screen.queryByText('lead_management.save_updates')).toBeInTheDocument();
    // expect(screen.queryAllByText('lead_management.name')[0]).toBeInTheDocument();

    // expect(screen.queryAllByText('lead_management.linkedin_url')[0]).toBeInTheDocument();

    // expect(screen.queryAllByText('lead_management.primary_email')[0]).toBeInTheDocument();
  });
});
