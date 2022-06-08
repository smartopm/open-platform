import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import NotificationCard from '../component/NotificationCard';
import { NotificationUpdate } from '../graphql/sos_mutation';

describe('NotificationCard component', () => {
  const notification = {
    category: 'comment',
    createdAt: '2022-10-10',
    description: 'sample comment',
    header: 'sample header',
    id: 'uwiehdnwlkcm'
  };

  const mocks = [
    {
      request: {
        query: NotificationUpdate,
        variables: { id: 'uwiehdnwlkcm' }
      },
      result: {
        data: {
          notificationUpdate: {
            success: true
          }
        }
      }
    }
  ];
  it('should render correctly', () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <NotificationCard notification={notification} />
      </MockedProvider>
    );

    expect(container.queryByTestId('card')).toBeInTheDocument();
    expect(container.queryByTestId('date')).toBeInTheDocument();
    expect(container.queryByTestId('header_text')).toHaveTextContent('sample header');
    expect(container.queryByTestId('description_text')).toHaveTextContent('sample comment');
  });

  it('should render seen notification card', () => {
    const newNotification = { ...notification, seenAt: '2022-01-01' };
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <NotificationCard notification={newNotification} />
      </MockedProvider>
    );

    expect(container.queryByTestId('seen')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('card'))
  });
});
