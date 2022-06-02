import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import DrawerContent from '../component/DrawerContent';
import SeenNotifications, { UnseenNotifications } from '../graphql/menu_query';

describe('Drawer Content Component', () => {
  const mocks = [
    {
      request: {
        query: UnseenNotifications
      },
      result: {
        data: {
          unseenNotifications: [
            {
              id: 'uyhgfdsferf',
              category: 'task',
              description: 'a task has been assigned to you',
              createdAt: '2022-10-10',
              seenAt: '2022-10-10',
              header: 'sample header'
            }
          ]
        }
      }
    },
    {
      request: {
        query: SeenNotifications
      },
      result: {
        data: {
          seenNotifications: [
            {
              id: 'uyhgfdsfeergfegef',
              category: 'comment',
              description: 'sample comment',
              createdAt: '2022-10-10',
              seenAt: '2022-10-10',
              header: 'sample header for comment'
            }
          ]
        }
      }
    }
  ];

  it('render without error', async () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <DrawerContent />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(container.queryAllByTestId('card')[0]).toBeInTheDocument();
      expect(container.queryAllByTestId('date')[0]).toBeInTheDocument();
      expect(container.queryAllByTestId('header')[0]).toBeInTheDocument();
      expect(container.queryAllByTestId('description')[0]).toBeInTheDocument();
    }, 10);
  });

  it('no notifications', async () => {
    const newMocks = [
      {
        request: {
          query: UnseenNotifications
        },
        result: {
          data: {
            unseenNotifications: {
              id: 'uyhgfdsferf',
              category: 'task',
              description: 'a task has been assigned to you',
              createdAt: '2022-10-10',
              seenAt: '2022-10-10',
              header: 'sample header'
            }
          }
        }
      },
      {
        request: {
          query: SeenNotifications
        },
        result: {
          data: {
            seenNotifications: {
              id: 'uyhgfdsferf',
              category: 'task',
              description: 'a task has been assigned to you',
              createdAt: '2022-10-10',
              seenAt: '2022-10-10',
              header: 'sample header'
            }
          }
        }
      }
    ];
    const container = render(
      <MockedProvider mocks={newMocks} addTypename={false}>
        <BrowserRouter>
          <DrawerContent />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(container.queryByTestId('no_notifications')).toHaveTextContent(
        'notification.no_notifications'
      );
    }, 10);
  });
});
