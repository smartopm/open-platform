import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';

import CampaignSplitScreen from '../components/CampaignSplitScreen';
import { Campaign } from '../../../graphql/queries';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import MockedSnackbarProvider from '../../__mocks__/mock_snackbar';

describe('It should render the campaign split screen', () => {
  const mocks = {
    request: {
      query: Campaign,
      variables: { id: '23692382' }
    },
    result: {
      data: {
        campaign: {
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
          campaignType: 'email',
          includeReplyLink: false,
          emailTemplatesId: '6718rtgh25dh',
          campaignMetrics: {
            batchTime: '2020-05-20T05:35:03Z',
            startTime: '2020-05-20T05:36:35Z',
            endTime: '2020-05-20T05:36:36Z',
            totalScheduled: '1',
            totalSent: '1',
            totalClicked: '0',
            totalOpened: '0'
          },
          labels: [{
            id: 'fghj628188',
            shortDesc: 'com_news_email'
          }]
        }
      }
    }
  };

  it('should render CampaignSplitScreen', async () => {
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <MockedSnackbarProvider>
              <CampaignSplitScreen
                campaignId="23692382"
                campaignLength={10}
                refetch={jest.fn()}
                setShow={jest.fn()}
              />
            </MockedSnackbarProvider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(container.queryByTestId('container')).toBeInTheDocument();
    }, 10)
  });
});
