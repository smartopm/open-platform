import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import UserStyledTabs from '../Components/UserTabs';

import { UserActivePlanQuery } from '../../../graphql/queries/user';
import { Spinner } from '../../../shared/Loading';
import MockedThemeProvider from "../../__mocks__/mock_theme";

describe('component that with styled tabs', () => {
  const mock = [
    {
      request: {
        query: UserActivePlanQuery
      },
      result: {
        data: {
          userActivePlan: true
        }
      }
    }
  ];
  it('should render correct tabs when user is admin', async () => {
    const props = {
      tabValue: 'Notes',
      handleChange: jest.fn(),
      user: {
        userType: 'admin',
        community: {
          features: {
            Tasks: { features: [] },
            Messages: { features: [] },
            Payments: { features: [] },
            Properties: { features: [] }
          }
        }
      }
    };
    const container = render(
      <MockedProvider mocks={mock}>
        <MockedThemeProvider>
          <UserStyledTabs {...props} />
        </MockedThemeProvider>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryByText('common:misc.communication')).toBeInTheDocument();
      expect(container.queryByText('common:misc.notes')).toBeInTheDocument();
      expect(container.queryByText('common:misc.contact')).toBeInTheDocument();
      expect(container.queryByText('common:misc.payments')).toBeInTheDocument();
      expect(container.queryByText('common:misc.plots')).toBeInTheDocument();
      // verify number of tabs in case they get changed
      expect(container.queryAllByTestId('tabs')).toHaveLength(6);
    }, 10);
  });

  it('should not show communication and note tabs when user is not admin', async () => {
    const props = {
      tabValue: 'Contacts',
      handleChange: jest.fn(),
      user: {
        userType: 'client',
        community: {
          features: {
            Tasks: { features: [] },
            Messages: { features: [] },
            Payments: { features: [] },
            Properties: { features: [] }
          }
        }
      }
    };
    const container = render(
      <MockedProvider mocks={mock}>
        <MockedThemeProvider>
          <UserStyledTabs {...props} />
        </MockedThemeProvider>
      </MockedProvider>
    );
    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(() => {
      expect(container.queryByText('common:misc.communication')).not.toBeInTheDocument();
      expect(container.queryByText('common:misc.notes')).not.toBeInTheDocument();
      expect(container.queryByText('common:misc.contact')).toBeInTheDocument();
      expect(container.queryByText('common:misc.payments')).toBeInTheDocument();
      expect(container.queryByText('common:misc.plots')).toBeInTheDocument();
    }, 10);
  });
  it('should show error when something wrong happens', async () => {
    const erroredMock = [
      {
        request: {
          query: UserActivePlanQuery
        },
        error: new Error('An error occurred while fetching')
      }
    ];
    const props = {
      tabValue: 'Notes',
      handleChange: jest.fn(),
      user: {
        userType: 'admin',
        community: {
          features: {
            Tasks: { features: [] },
            Messages: { features: [] },
            Payments: { features: [] },
            Properties: { features: [] }
          }
        }
      }
    };
    const container = render(
      <MockedProvider mocks={erroredMock}>
        <MockedThemeProvider>
          <UserStyledTabs {...props} />
        </MockedThemeProvider>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
    await waitFor(() => {
      expect(container.queryByText('An error occurred while fetching')).toBeInTheDocument();
    }, 10);
  });
});
