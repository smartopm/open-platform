import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import CampaignSplitScreenContent from '../components/CampaignSplitScreenContent';
// import { Campaign } from '../../../graphql/queries';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('It should render the campaign split screen content', () => {
  const campaign = {
    id: 'tu278u24',
    status: 'draft',
    campaignMetrics: {
      totalScheduled: 0,
      totalSent: 10,
      totalClicked: 20
    },
    labels: {
      id: '78uruir',
      shortDesc: 'test'
    },
    name: 'sample-name',
    campaignType: 'sms',
    emailTemplatesId: null,
    message: '',
    batchTime: new Date(),
    userIdList: '',
    loaded: false,
    includeReplyLink: false
  };

  // todo: inprove this test @tolu
  it('should render CampaignSplitScreen', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <CampaignSplitScreenContent
              refetch={jest.fn()}
              handleClose={jest.fn}
              campaign={campaign}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('container')).toBeInTheDocument();
    expect(container.queryByTestId('title')).toBeInTheDocument();
    expect(container.queryByTestId('name')).toBeInTheDocument();
    expect(container.queryByTestId('status')).toBeInTheDocument();
    expect(container.queryByTestId('batch-time')).toBeInTheDocument();
    expect(container.queryByTestId('message')).toBeInTheDocument();
    expect(container.queryByTestId('mail-list')).toBeInTheDocument();
    expect(container.queryByTestId('type')).toBeInTheDocument();
    expect(container.queryAllByTestId('live-field-input')[0]).toBeInTheDocument();
    expect(container.queryByTestId('save-campaign')).toBeInTheDocument();
  });
});
