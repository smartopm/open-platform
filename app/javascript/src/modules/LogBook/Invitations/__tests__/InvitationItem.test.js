import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import { useTranslation } from 'react-i18next';
import Invitation from '../Components/InvitationItem';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import authState from '../../../../__mocks__/authstate';
import { checkRequests } from '../../utils';

jest.mock('../../utils');

describe('Invitation Component', () => {
  const { t } = useTranslation(['common', 'logbook']);
  checkRequests.mockReturnValue({ valid: false, title: 'valid', color: '#000' });
  const props = {
    visit: {
      id: 'a91dbad4-eeb4',
      name: 'Test another',
      user: {
        id: '162f7517',
        name: 'Js user x',
        status: 'active',
      },
      guest: {
        id: '162f7517',
        name: 'Js user a',
        status: 'active',
      },
      closestEntryTime: {
        visitEndDate: null,
        visitationDate: '2021-08-20T10:51:00+02:00',
        endsAt: '2021-10-31 22:51',
        startsAt: '2021-10-31 02:51',
        occursOn: [],
      },
      status: 'approved',
      occursOn: [],
      visitEndDate: null,
      visitationDate: '2021-08-20T10:51:00+02:00',
      endTime: '2021-10-31 22:51',
      startTime: '2021-10-31 02:51',
      endsAt: '2021-10-31 22:51',
      startsAt: '2021-10-31 02:51',
      exitedAt: '2021-10-31 22:51',
      revoked: true,
      thumbnailUrl: 'https://some-video.com',
      multipleInvites: true,
    },
    timeZone: 'Africa/Lagos',
    handleCardClick: jest.fn(),
    handleGrantAccess: jest.fn(),
    handleViewUser: jest.fn(),
    t,
    matches: false,
    theme: {
      palette: {
        success: {
          main: '',
        },
        error: {
          main: '',
        },
      },
    },
    loadingStatus: {}
  };

  it('should render an invitation card', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <MemoryRouter>
            <MockedThemeProvider>
              <Invitation {...props} />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.getByTestId('request_status')).toBeInTheDocument();
    expect(container.getByTestId('image_preview')).toBeInTheDocument();
    expect(container.getByTestId('grant_access_btn')).toBeInTheDocument();
    expect(container.getByTestId('multiple_host')).toBeInTheDocument();
    expect(container.getByTestId('request_status')).toBeInTheDocument();
    expect(container.getByTestId('user-entry')).toBeInTheDocument();
    expect(container.getByTestId('invitation-status')).toBeInTheDocument();

    expect(container.getByText('logbook:logbook.host')).toBeInTheDocument();
    expect(container.getByText('guest_book.multiple')).toBeInTheDocument();
    expect(container.getByText('guest_book.approved')).toBeInTheDocument();
    expect(container.getByText('guest_book.start_of_visit')).toBeInTheDocument();
    expect(container.getByText('guest_book.visit_time')).toBeInTheDocument();
    expect(container.getByText('guest_book.invalid_now')).toBeInTheDocument();
    expect(container.getByText('access_actions.grant_access')).toBeInTheDocument();

    fireEvent.click(container.getByTestId('multiple_host'));
    await waitFor(() => {
      expect(props.handleViewUser).toHaveBeenCalled();
    })
  });

  it('should render first character of visit name as avatar', () => {
    const customProps = { ...props, visit: { ...props.visit, thumbnailUrl: null } };
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <MemoryRouter>
            <MockedThemeProvider>
              <Invitation {...customProps} />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.getByTestId('request_preview')).toBeInTheDocument();
    expect(container.getByTestId('visit_card')).toBeInTheDocument();
  });

  it('should render user name if not multiple invites', () => {
    const customProps = { ...props, visit: { ...props.visit, multipleInvites: false, status: 'canceled' } };
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <MemoryRouter>
            <MockedThemeProvider>
              <Invitation {...customProps} />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.getByTestId('user_name')).toBeInTheDocument();
    expect(container.getByText('guest_book.pending')).toBeInTheDocument();
  });

  it('should render spinner instead as start icon for grant access btn', () => {
    const customProps = {
      ...props,
      loadingStatus: { loading: true, currentId: 'a91dbad4-eeb4' },
    };
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <MemoryRouter>
            <MockedThemeProvider>
              <Invitation {...customProps} />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.getByTestId('loader')).toBeInTheDocument();
    expect(container.getByTestId('grant_access_btn')).toBeDisabled();
  });

  it('should enable grant access button for an invitation', async () => {
    checkRequests.mockReturnValue({ valid: true, title: 'valid', color: '#000' });
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <MemoryRouter>
            <MockedThemeProvider>
              <Invitation {...props} />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );

    const accessBtn = container.getByTestId('grant_access_btn');
    expect(accessBtn).not.toBeDisabled();
    expect(container.getByText('guest_book.valid')).toBeInTheDocument();

    fireEvent.click(accessBtn);
    await waitFor(() => {
      expect(props.handleGrantAccess).toHaveBeenCalled();
    })
  });
});
