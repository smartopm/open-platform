import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';
import '@testing-library/jest-dom/extend-expect';
import CampaignSplitScreenContent from '../components/CampaignSplitScreenContent';
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

  it('should render CampaignSplitScreen', async () => {
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

    await waitFor(() => {
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
      expect(container.queryByTestId('email')).toBeInTheDocument();
  
      fireEvent.click(container.queryByTestId('email'));
      expect(container.queryByTestId('email-template')).toBeInTheDocument();
    }, 10)
  });

  it('should render error when name not present', async () => {
    const newCampaign = {...campaign, name: ''}
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <CampaignSplitScreenContent
              refetch={jest.fn()}
              handleClose={jest.fn}
              campaign={newCampaign}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>{
      fireEvent.click(container.queryByTestId('save-campaign'));
      expect(container.queryByText('message.include_name')).toBeInTheDocument();
    }, 5)
  });

  it('should render error when batch time not present', async () => {
    const newCampaign = {...campaign, batchTime: ''}
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <CampaignSplitScreenContent
              refetch={jest.fn()}
              handleClose={jest.fn}
              campaign={newCampaign}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(container.queryByTestId('save-campaign'));
      expect(container.queryByText('message.include_batch_time')).toBeInTheDocument();
    }, 5)
  });

  it('should render error when status is scheduled and message not present', async () => {
    const newCampaign = {...campaign, status: 'scheduled'}
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <CampaignSplitScreenContent
              refetch={jest.fn()}
              handleClose={jest.fn}
              campaign={newCampaign}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(container.queryByTestId('save-campaign'));
      expect(container.queryByText('message.include_message')).toBeInTheDocument();
    }, 5)
  });

  it('should render error when status is scheduled and userIdList not present', async () => {
    const newCampaign = {...campaign, message: 'sample message', status: 'scheduled'}
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <CampaignSplitScreenContent
              refetch={jest.fn()}
              handleClose={jest.fn}
              campaign={newCampaign}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(container.queryByTestId('save-campaign'));
      expect(container.queryByText('message.include_user_list')).toBeInTheDocument();
    }, 5)
  });

  it('should render error when campaign type is email and email template is not present', async () => {
    const newCampaign = {...campaign, campaignType: 'email'}
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <CampaignSplitScreenContent
              refetch={jest.fn()}
              handleClose={jest.fn}
              campaign={newCampaign}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(container.queryByTestId('save-campaign'));
      expect(container.queryByText('message.include_email_template')).toBeInTheDocument();
    }, 5)
  });
});
