import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import DrawerContent from '../component/DrawerContent';
import UserNotifications from '../graphql/menu_query';

describe('Drawer Content Component', () => {
  const mocks = [
    {
      request: {
        query: UserNotifications
      },
      result: {
        data: {
          userNotifications: [
            {
              id: 'uyhgfdsferf',
              category: 'task',
              description: 'a task has been assigned to you',
              createdAt: '2022-10-10',
              seenAt: null,
              header: 'sample header',
              notifableId: 'dwwerfwewewefdwe',
              url: '/tasks?taskId=dwwerfwewewefdwe'
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
          query: UserNotifications
        },
        result: {
          data: {
            userNotifications: {
              id: 'uyhgfdsferfesc',
              category: 'task',
              description: 'a task has been assigned to you',
              createdAt: '2022-10-10',
              seenAt: '2022-10-10',
              header: 'sample header',
              notifableId: 'dwwerfwewewefdwe',
              url: '/tasks?taskId=dwwerfwewewefdwe'
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
