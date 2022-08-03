import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import UserLabels from '../Components/UserLabels';
import { LabelsQuery, UserLabelsQuery } from '../../../graphql/queries';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

describe('It should test the user label component', () => {
  it('should render component', async () => {
    const mockData = [
      {
        request: {
          query: UserLabelsQuery,
          variables: { userId: '59927651-9bb4-4e47-8afe-0989d03d210d' }
        },
        result: {
          data: {
            userLabels: [
              {
                id: '12345678890',
                shortDesc: 'Client',
                color: '#000',
                userCount: 23,
                description: 'some description',
                groupingName: 'Status'
              }
            ]
          }
        }
      }
    ];

    const labelsMockData = {
      request: {
        query: LabelsQuery
      },
      result: {
        data: {
          labels: [
            {
              id: '12345678890',
              shortDesc: 'Client',
              color: '#000',
              userCount: 23,
              description: 'some description',
              groupingName: 'Status'
            }
          ]
        }
      }
    };
    const container = render(
      <MockedProvider mocks={[...mockData, labelsMockData]} addTypename={false}>
        <MockedSnackbarProvider>
          <UserLabels userId="59927651-9bb4-4e47-8afe-0989d03d210d" isLabelOpen />
        </MockedSnackbarProvider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByTestId('chip-label')).toBeInTheDocument();
      fireEvent.click(container.queryByTestId('add_label'));
      expect(container.queryByTestId('userLabel-autoCreate')).toBeInTheDocument();
    }, 10);
  });

  it('should display no labels when user has no labels', async () => {
    const mockData = {
      request: {
        query: UserLabelsQuery,
        variables: { userId: '59927651-9bb4-4e47-8afe-0989d03d210d' }
      },
      result: {
        data: {
          userLabels: []
        }
      }
    };

    const labelsMockData = {
      request: {
        query: LabelsQuery
      },
      result: {
        data: {
          labels: []
        }
      }
    };
    const container = render(
      <MockedProvider mocks={[mockData, labelsMockData]} addTypename={false}>
        <MockedSnackbarProvider>
          <UserLabels userId="59927651-9bb4-4e47-8afe-0989d03d210d" isLabelOpen />
        </MockedSnackbarProvider>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByTestId('no_labels')).toBeInTheDocument();
      expect(container.queryByText('label:label.no_user_labels')).toBeInTheDocument();
    });
  });
});
