import React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { UserLabelsQuery } from '../../graphql/queries';
import Notifications from '../../containers/Preferences/Notifications';
import { NotificationPreference } from '../../graphql/mutations';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('Notifications Component', () => {
  it('should display neccesary elements after fetching user labels', async () => {
    const mocks = [
      {
        request: {
          query: UserLabelsQuery,
          variables: {
            userId: 'jf20'
          }
        },
        result: {
          data: {
            userLabels: [
              {
                id: '12h3k4',
                shortDesc: 'com_news_sms'
              },
              {
                id: '12yuk4',
                shortDesc: 'com_news_email'
              },
              {
                id: '12adk4',
                shortDesc: 'weekly_point_reminder_email'
              }
            ]
          }
        }
      }
    ];

    let container;
    await act(async () => {
      container = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <Notifications />
          </BrowserRouter>
        </MockedProvider>
      );
    });
    expect(container.getByText(/Points and Rewards: Get weekly reminders/)).toBeInTheDocument();
    expect(container.getByText(/News and Updates: Receive the latest news/)).toBeInTheDocument();
  });

  it('should handle save-notification-preference', async () => {
    const mocks = [
      {
        request: {
          query: NotificationPreference,
          variables: { preferences: ['com_news_sms', 'com_news_email'] }
        },
        error: new Error('An error occurred')
      }
    ];

    let container;
    await act(async () => {
      container = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <Notifications />
          </BrowserRouter>
        </MockedProvider>
      );
    });

    fireEvent.click(container.queryByTestId('preferences-save-button'));

    await waitFor(() => {
      expect(container.queryByTestId('toastr')).toBeInTheDocument();
    }, 100);
  });
});
