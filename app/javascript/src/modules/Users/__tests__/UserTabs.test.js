import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import UserStyledTabs from '../Components/UserTabs';
import '@testing-library/jest-dom/extend-expect';
import { UserActivePlanQuery } from '../../../graphql/queries/user';
import { Spinner } from '../../../shared/Loading';

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
      tabValue: 'note',
      handleChange: jest.fn(),
      userType: 'admin'
    };
    const container = render(
      <MockedProvider mocks={mock}>
        <UserStyledTabs {...props} />
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
      expect(container.queryAllByTestId('tabs')).toHaveLength(7)
    },10);
  });

  it('should not show communication and note tabs when user is not admin', async () => {
    const props = {
      tabValue: 'note',
      handleChange: jest.fn(),
      userType: 'resident'
    };
    const container = render(
      <MockedProvider mocks={mock}>
        <UserStyledTabs {...props} />
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
    },10);
  });
    it('should show error when something wrong happens', async () => {
      const erroredMock = [
        {
          request: {
            query: UserActivePlanQuery
          },
          error: new Error('An error occurred while fetching'),
        }
      ];
      const props = {
        tabValue: 'note',
        handleChange: jest.fn(),
        userType: 'admin'
      };
      const container = render(
        <MockedProvider mocks={erroredMock}>
          <UserStyledTabs {...props} />
        </MockedProvider>
      );
  
      const loader = render(<Spinner />);
  
      expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
      await waitFor(() => {
        expect(container.queryByText('An error occurred while fetching')).toBeInTheDocument()
      },10);
    })

});
