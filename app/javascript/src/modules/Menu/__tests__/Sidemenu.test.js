import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { createClient } from '../../../utils/apollo';
import { SideMenu } from '../index';
import modules from '../..';
import authState from '../../../__mocks__/authstate';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Side Nav component', () => {
  const handleDrawerToggle = jest.fn();
  const features = {
    Search: { features: [] },
    Referral: { features: [] },
    Payments: { features: [] },
    'Time Card': { features: [] },
    Logout: { features: [] },
    Community: { features: [] },
    Messages: { features: [] },
    Dashboard: { features: [] },
    Properties: { features: [] },
    Users: { features: [] },
    LogBook: { features: [] },
    'Action Flows': { features: [] },
    Campaigns: { features: [] },
    Business: { features: [] },
    Discussions: { features: [] },
    Labels: { features: [] },
    News: { features: [] },
    Tasks: { features: []},
  }

  it('should render proper the sidenav menu', async () => {
    const data = {
      user: {
        id: 'a54d6184-b10e-4865-bee7-7957701d423d',
        name: 'Another somebodyy',
        userType: 'admin',
        expiresAt: null,
        community: {
          features: {Tasks: { features: [] }},
          name: 'City',
          logoUrl: 'http://image.jpg',
          smsPhoneNumbers: ["+254724821901", "+154724582391"],
          emergencyCallNumber: "254724821901",
        },
        permissions: {
          note: {
            permissions: [
            'can_see_menu_item',
            'can_create_note',
            'can_get_task_count',
            'can_get_task_stats',
            'can_get_own_tasks',
            'can_fetch_task_histories',
            'can_fetch_task_comments',
            'can_fetch_flagged_notes',
          ]
          }
        }
      }
    };

    const container = render(
      <ApolloProvider client={createClient}>
        <Context.Provider value={authState}>
          <MockedProvider>
            <BrowserRouter>
              <SideMenu
                toggleDrawer={handleDrawerToggle}
                menuItems={modules}
                userType={data.user.userType}
                communityFeatures={Object.keys(features)}
                mobileOpen={false}
                direction="left"
              />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      </ApolloProvider>
    );
    expect(container.queryAllByTestId('sidenav-container')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('sidenav-container')).toHaveLength(1);

    expect(container.queryByText('misc.users')).toBeInTheDocument();
    expect(container.queryByText('misc.log_book')).toBeInTheDocument();
    expect(container.queryByText('misc.time_card')).toBeInTheDocument();
    expect(container.queryByText('misc.action_flows')).toBeInTheDocument();
    expect(container.queryByText('menu.community')).toBeInTheDocument();
    expect(container.queryByText('misc.properties')).toBeInTheDocument();
    expect(container.queryByText('menu.dashboard')).toBeInTheDocument();

    expect(container.queryByText('misc.news')).not.toBeInTheDocument() // should not be initially visible 


    // toggle the menu and make sure new menus will show
    fireEvent.click(container.queryByText('menu.community'));
    expect(container.queryByText('misc.campaigns')).toBeInTheDocument();
    expect(container.queryByText('misc.business')).toBeInTheDocument();
    expect(container.queryByText('misc.news')).toBeInTheDocument();
    expect(container.queryByText('misc.labels')).toBeInTheDocument();
    expect(container.queryByText('misc.discussions')).toBeInTheDocument();
    expect(container.queryByText('misc.tasks')).toBeInTheDocument();
  });

  it('should not render tasks submenu item when user does not have permissions', async () => {
    const data = {
      user: {
        id: 'a54d6184-b10e-4865-bee7-7957701d423d',
        name: 'Another somebodyy',
        userType: 'admin',
        expiresAt: null,
        community: {
          features: {Tasks: { features: [] }},
          name: 'City',
          logoUrl: 'http://image.jpg',
          smsPhoneNumbers: ["+254724821901", "+154724582391"],
          emergencyCallNumber: "254724821901",
        },
        permissions: {
          note: {
            permissions: [
            'can_create_note',
            'can_get_task_count',
            'can_get_task_stats',
            'can_get_own_tasks',
            'can_fetch_task_histories',
            'can_fetch_task_comments',
            'can_fetch_flagged_notes',
          ]
          }
        }
      }
    };

    const container = render(
      <ApolloProvider client={createClient}>
        <Context.Provider value={data}>
          <MockedProvider>
            <BrowserRouter>
              <SideMenu
                toggleDrawer={handleDrawerToggle}
                menuItems={modules}
                userType={data.user.userType}
                communityFeatures={Object.keys(features)}
                mobileOpen={false}
                direction="left"
              />
            </BrowserRouter>
          </MockedProvider>
        </Context.Provider>
      </ApolloProvider>
    );
    expect(container.queryAllByTestId('sidenav-container')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('sidenav-container')).toHaveLength(1)

    // toggle the menu and make sure new menus will show
    fireEvent.click(container.queryByText('menu.community'));
    expect(container.queryByText('misc.tasks')).not.toBeInTheDocument()
  });
});