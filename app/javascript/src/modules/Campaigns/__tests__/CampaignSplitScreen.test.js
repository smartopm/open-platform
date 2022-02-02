import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import CampaignSplitScreen from '../components/CampaignSplitScreen';
import { Campaign } from '../../../graphql/queries';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('It should render the campaign split screen', () => {
  const mocks = {
    request: {
      query: Campaign,
      variables: { id: '23692382' }
    },
    result: {
      data: {
        campaigns: {
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
          }
        }
      }
    }
  };

  it('should render CampaignSplitScreen', () => {
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <CampaignSplitScreen
              campaignId="23692382"
              campaignLength={10}
              refetch={jest.fn()}
              setShow={jest.fn}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('container')).toBeInTheDocument();
  });
});