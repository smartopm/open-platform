import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import { allCampaigns } from '../../../graphql/queries';
import Campaign from '../components/CampaignList';
import Loading from '../../../shared/Loading';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import { DeleteCampaign } from '../../../graphql/mutations';

describe('Campaign List page', () => {
  it('should render without error', async () => {
    const mocks = {
      request: {
        query: allCampaigns,
        variables: { limit: 50, offset: 0, query: '' }
      },
      result: {
        data: {
          campaigns: [
            {
              id: '54343432432',
              batchTime: '2020-06-24T11:58:22.573Z',
              status: 'draft',
              communityId: '34324234',
              createdAt: '2020-06-24T11:58:22.573Z',
              endTime: '2020-07-24T11:58:22.573Z',
              message: 'This is a campaign message',
              name: 'Important',
              startTime: '2020-06-24T11:58:22.573Z',
              updatedAt: '2020-06-25T11:58:22.573Z',
              userIdList: 'bsufsbdf343, 53094549035, 09u4093',
              campaignMetrics: {
                batchTime: '2020-05-20T05:35:03Z',
                startTime: '2020-05-20T05:36:35Z',
                endTime: '2020-05-20T05:36:36Z',
                totalScheduled: '1',
                totalSent: '1',
                totalClicked: '0'
              },
              __typename: 'Campaign'
            }
          ]
        }
      }
    };

    const deleteMock = {
      request: {
        query: DeleteCampaign,
        variables: { id: '54343432432' }
      },
      result: {
        data: {
          campaign: {
            id: '42552342',
            status: 'deleted'
          }
        }
      }
    };

    await act(async () => {
      const container = render(
        <MockedProvider mocks={[mocks, deleteMock]} addTypename={false}>
          <BrowserRouter>
            <MockedThemeProvider>
              <Campaign />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      );

      const loader = render(<Loading />);
      expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

      await waitFor(
        () => {
          expect(container.queryByTestId('container')).toBeInTheDocument();
          expect(container.queryByTestId('campaign-list')).toBeInTheDocument();
          expect(container.queryByTestId('campaign-item-menu')).toBeInTheDocument();
        },
        { timeout: 200 }
      );

      fireEvent.click(container.queryByTestId('campaign-item-menu'));
      expect(container.queryByText('misc.open_campaign_details')).toBeInTheDocument();
      expect(container.queryByText('actions.delete_campaign')).toBeInTheDocument();
      fireEvent.click(container.queryByText('actions.delete_campaign'));
      expect(container.queryByTestId('confirm_action')).toBeInTheDocument();

      expect(container.queryByTestId('new-campaign')).toBeInTheDocument();

      fireEvent.click(container.queryByTestId('new-campaign'));
      fireEvent.click(container.queryByTestId('card'));
    });
  });
});
