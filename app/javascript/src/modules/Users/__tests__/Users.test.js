import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import routeData, { MemoryRouter } from 'react-router';
import { MockedProvider } from '@apollo/react-testing';
import Users from '../Containers/Users';
import { UsersDetails, LabelsQuery } from '../../../graphql/queries';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());

describe('UserPage Component', () => {
  const mockHistory = {
    push: jest.fn()
  };

  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: () => {}
    }
  });

  beforeEach(() => {
    jest.spyOn(routeData, 'useHistory').mockReturnValue(mockHistory);
  });
  const usersQueryMock = {
    request: {
      query: UsersDetails,
      variables: { query: '', limit: 25, offset: 0 }
    },
    result: {
      data: {
        users: [
          {
            name: 'Anonymous',
            phoneNumber: '3221038192389',
            roleName: 'Visitor',
            userType: 'visitor',
            id: '630d8061-8c23-4146-b1c0-a0da223e6402',
            email: null,
            avatarUrl: null,
            imageUrl: null,
            subStatus: null,
            extRefId: null,
            expiresAt: null,
            status: 'active',
            state: 'pending',
            labels: [
              {
                id: '059956af-b346-4e0d-9d1e-56cf22379ad7',
                shortDesc: 'weekly_point_reminder_email',
                groupingName: 'Status'
              }
            ]
          }
        ]
      }
    }
  };

  const labelsQueryMock = {
    request: {
      query: LabelsQuery
    },
    result: {
      data: {
        labels: [
          {
            id: '059956af-b346-4e0d-9d1e-56cf22379ad7',
            shortDesc: 'weekly_point_reminder_email',
            userCount: 39,
            description: null,
            color: '#f07030',
            groupingName: 'Status'
          }
        ]
      }
    }
  };
  it('should render the users page without errors', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[usersQueryMock, labelsQueryMock]} addTypename={false}>
          <MemoryRouter>
            <MockedThemeProvider>
              <Users />
            </MockedThemeProvider>
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );

    expect(container.getByTestId('loader')).toBeInTheDocument();
    await waitFor(() => {
      expect(container.getByTestId('menu-list')).toBeInTheDocument();
      expect(container.queryByTestId('search')).toBeInTheDocument();
      expect(container.getByTestId('download_csv_btn')).toBeInTheDocument();
      fireEvent.click(container.getByTestId('menu-list'));
      expect(container.getByTestId('menu_list')).toBeInTheDocument();
      expect(container.getAllByTestId('menu_item')[0]).toBeInTheDocument();
      expect(container.getAllByTestId('menu_item')).toHaveLength(4);

      fireEvent.click(container.getAllByTestId('menu_item')[0]);
      expect(mockHistory.push).toBeCalled();
      expect(mockHistory.push).toBeCalledWith('/users/import');

      fireEvent.click(container.getAllByTestId('menu_item')[1]);
      expect(mockHistory.push).toBeCalledWith('/users/leads/import');

      fireEvent.click(container.getAllByTestId('menu_item')[2]);
      expect(container.queryByText('Customer Journey Stage')).toBeInTheDocument();

      fireEvent.click(container.getAllByTestId('menu_item')[3]);
      expect(mockHistory.push).toBeCalledWith('/users/stats');

      fireEvent.click(container.queryByTestId('download_csv_btn'));
      expect(container.queryAllByTestId('button')[0]).toBeInTheDocument();
      expect(container.queryAllByTestId('arrow-icon')[0]).toBeInTheDocument();

      expect(container.getByTestId('pagination_section')).toBeInTheDocument();
      expect(container.getByTestId('user_item')).toBeInTheDocument();
      expect(container.getByTestId('user_name')).toBeInTheDocument();
      expect(container.getByTestId('user_name').textContent).toContain('Anonymous');
      expect(container.getByTestId('user_email').textContent).toContain('');
      expect(container.getByTestId('user_phone_number').textContent).toContain('3221038192389');
      expect(container.getByTestId('user_type').textContent).toContain('common:user_types.visitor');
      fireEvent.click(container.queryAllByTestId('arrow-icon')[0]);
      fireEvent.click(container.queryAllByText('common:misc.all_this_page')[0]);
      fireEvent.click(container.queryAllByTestId('copy-id')[0]);
      expect(container.queryAllByTestId('copy-id')[0]).toBeInTheDocument();
    }, 20);
  });
  it('should render an error page when something wrong with the query', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider mocks={[usersQueryMock]} addTypename={false}>
          <MemoryRouter>
            <Users />
          </MemoryRouter>
        </MockedProvider>
      </Context.Provider>
    );
    await waitFor(() => {
      expect(container.getByText('Home')).toBeInTheDocument();
    });
  });
});
