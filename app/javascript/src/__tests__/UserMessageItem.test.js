import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import UserMessageItem, { checkRoute } from '../components/Messaging/MessageItem';

describe('user message item component', () => {
  const message = `Please share your feedback with this 30 seconds survey: https://app.doublegdp.com/news/posts/survey/
    and your email test@testdotcom.com`;
  const data = {
    id: '1',
    name: 'joen',
    user: {},
    category: 'SMS',
    message,
    clientNumber: '2603434343',
    dateMessageCreated: new Date(),
    isTruncate: false,
    isAdmin: true
  };

  it('renders necessary elements', () => {
    render(
      <MockedProvider>
        <BrowserRouter>
          <UserMessageItem {...data} />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(screen.queryAllByTestId('user_avatar')[0]).toBeInTheDocument();
    expect(screen.queryAllByTestId('msg-owner')[0]).toBeInTheDocument();
    expect(screen.queryAllByTestId('date-value')[0]).toBeInTheDocument();
    expect(screen.queryAllByTestId('msg-body')[0]).toBeInTheDocument();
    expect(screen.queryAllByText('SMS')[0]).toBeInTheDocument();
    expect(screen.queryAllByText(/Please share your feedback with/i)[0]).toBeInTheDocument();
    expect(screen.queryByText('common:misc.not_read')).toBeInTheDocument();
  });
});

describe('check route', () => {
  const location1 = '/message/348534';
  const location4 = '/messages';
  const location2 = '/user/348534';
  const location3 = '/news/348534';

  it('should know when it is being used on messages', () => {
    expect(checkRoute(location1)).toBe('is_message');
  });
  it('should know when it is being used on user profile', () => {
    expect(checkRoute(location2)).toBe('is_profile');
  });
  it('should know when it is being used on nkwashi news posts', () => {
    expect(checkRoute(location3)).toBe('is_post');
  });
  it('should know when it is being used on message list', () => {
    expect(checkRoute(location4)).toBe('is_message');
  });
});
