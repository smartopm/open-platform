import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/';
import { MockedProvider } from '@apollo/react-testing';

import userEvent from '@testing-library/user-event'
import CampaignSplitScreenContent from '../components/CampaignSplitScreenContent';
import MockedThemeProvider from '../../__mocks__/mock_theme';
import SearchID from '../graphql/campaign_query';
import MockedSnackbarProvider, { mockedSnackbarProviderProps } from '../../__mocks__/mock_snackbar';
import { SnackbarContext } from '../../../shared/snackbar/Context';

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
            <MockedSnackbarProvider>
              <CampaignSplitScreenContent
                refetch={jest.fn()}
                handleClose={jest.fn}
                campaign={campaign}
              />
            </MockedSnackbarProvider>
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
            <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
              <CampaignSplitScreenContent
                refetch={jest.fn()}
                handleClose={jest.fn}
                campaign={newCampaign}
              />
            </SnackbarContext.Provider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>{
      fireEvent.click(container.queryByTestId('save-campaign'));
      expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
        message: 'message.include_name',
        type: mockedSnackbarProviderProps.messageType.error
      });
    }, 5)
  });

  it('should render error when batch time not present', async () => {
    const newCampaign = {...campaign, batchTime: ''}
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
              <CampaignSplitScreenContent
                refetch={jest.fn()}
                handleClose={jest.fn}
                campaign={newCampaign}
              />
            </SnackbarContext.Provider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(container.queryByTestId('save-campaign'));
      expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
        message: 'message.include_batch_time',
        type: mockedSnackbarProviderProps.messageType.error
      });
    }, 5)
  });

  it('should render error when status is scheduled and message not present', async () => {
    const newCampaign = {...campaign, status: 'scheduled'}
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
              <CampaignSplitScreenContent
                refetch={jest.fn()}
                handleClose={jest.fn}
                campaign={newCampaign}
              />
            </SnackbarContext.Provider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(container.queryByTestId('save-campaign'));
      expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
        message: 'message.include_message',
        type: mockedSnackbarProviderProps.messageType.error
      });
    }, 5)
  });

  it('should render error when status is scheduled and userIdList not present', async () => {
    const newCampaign = {...campaign, message: 'sample message', status: 'scheduled'}
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
              <CampaignSplitScreenContent
                refetch={jest.fn()}
                handleClose={jest.fn}
                campaign={newCampaign}
              />
            </SnackbarContext.Provider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(container.queryByTestId('save-campaign'));
      expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
        message: 'message.include_user_list',
        type: mockedSnackbarProviderProps.messageType.error
      });
    }, 5)
  });

  it('should render error when campaign type is email and email template is not present', async () => {
    const newCampaign = {...campaign, campaignType: 'email'}
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <SnackbarContext.Provider value={{...mockedSnackbarProviderProps}}>
              <CampaignSplitScreenContent
                refetch={jest.fn()}
                handleClose={jest.fn}
                campaign={newCampaign}
              />
            </SnackbarContext.Provider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      fireEvent.click(container.queryByTestId('save-campaign'));
      expect(mockedSnackbarProviderProps.showSnackbar).toHaveBeenCalledWith({
        message: 'message.include_email_template',
        type: mockedSnackbarProviderProps.messageType.error
      });
    }, 5)
  });

  it('should render search bar', async () => {
    const mockData = {
      request: {
        query: SearchID
      },
      result: {
        data: {
          searchUserIds: [
            {
              id: '12345678890',
              name: 'sample-name1',
              imageUrl: 'image.jpg',
              avatarUrl: 'avatar.jpg'
            }
          ]
        }
      }
    };
    const newCampaign = {
      ...campaign,
      userIdList: '78usdfuir,78ursdir,78ugfuir,78dfruir',
      mailListType: 'idlist'
    };
    const container = render(
      <MockedProvider>
        <BrowserRouter mock={[mockData]} addTypename={false}>
          <MockedThemeProvider>
            <MockedSnackbarProvider>
              <CampaignSplitScreenContent
                refetch={jest.fn()}
                handleClose={jest.fn}
                campaign={newCampaign}
              />
            </MockedSnackbarProvider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    fireEvent.click(container.queryByText('actions.use_id_lists'));
    expect(container.queryByTestId('search')).toBeInTheDocument();
    expect(container.queryByTestId('search-result')).not.toBeInTheDocument();
    userEvent.type(container.queryByTestId('search'), 'sa')
    await waitFor(() => {
      expect(container.queryByTestId('search-result')).toBeInTheDocument();
  }, 10)
  });
});
