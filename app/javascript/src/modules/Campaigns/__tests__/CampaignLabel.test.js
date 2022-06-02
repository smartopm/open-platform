/* eslint-disable */
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import CampaignLabels from '../components/CampaignLabels';
import { LabelsQuery } from '../../../graphql/queries';

describe('It should test the create label component', () => {
  const mockData = {
    request: {
      query: LabelsQuery
    },
    result: {
      data: {
        labels: [
          {
            id: '12345678890',
            shortDesc: 'Client'
          }
        ]
      }
    }
  };

  const props = {
    handleLabelSelect: jest.fn(),
    handleDelete: jest.fn(),
  };

  it('it should render with no error', async () => {
    const container = render(
      <MockedProvider mock={[mockData]} addTypename={false}>
        <CampaignLabels {...props} />
      </MockedProvider>
    );

    await waitFor(() => {
        expect(container.queryByTestId('campaignLabel-creator')).toBeDefined();
    }, 10)
  });
});
