import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import { SideMenu } from '../index';
import modules from '../..';
import authState from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Side Nav component', () => {
  const handleDrawerToggle = jest.fn();
  const features = {
    Search: { features: [] },
    Referral: { features: [] },
    Transactions: { features: [] },
    'Time Card': { features: [] },
    Logout: { features: [] },
    Community: { features: [] },
    Messages: { features: [] },
    Dashboard: { features: [] },
    Properties: { features: [] },
    Users: { features: [] },
    LogBook: { features: [] },
    'Guest List': { features: [] },
    'Action Flows': { features: [] },
    Campaigns: { features: [] },
    Business: { features: [] },
    Discussions: { features: [] },
    Labels: { features: [] },
    News: { features: [] },
    Tasks: { features: []},
    'Tasks Lists': { features: []},
    'Email Templates': { features: [] },
    Processes: { features: [] }
  }

  it('should render proper the sidenav menu', async () => {
    const container = render(
      <Context.Provider value={authState}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <SideMenu
                toggleDrawer={handleDrawerToggle}
                menuItems={modules}
                userType={authState.user.userType}
                communityFeatures={Object.keys(features)}
                mobileOpen={false}
                direction="left"
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryAllByTestId('sidenav-container')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('sidenav-container')).toHaveLength(1);

    expect(container.queryByText('misc.users')).toBeInTheDocument();
    expect(container.queryByText('misc.access')).toBeInTheDocument();
    expect(container.queryByText('misc.time_card')).toBeInTheDocument();
    expect(container.queryByText('misc.action_flows')).toBeInTheDocument();
    expect(container.queryByText('menu.community')).toBeInTheDocument();
    expect(container.queryByText('misc.properties')).toBeInTheDocument();
    expect(container.queryByText('menu.dashboard')).toBeInTheDocument();
    expect(container.queryByText('common:menu.payment_plural')).toBeInTheDocument();
    expect(container.queryByText('menu.processes')).toBeInTheDocument();
    expect(container.queryByText('misc.news')).not.toBeInTheDocument() // should not be initially visible

    // toggle the menu and make sure new menus will show
    fireEvent.click(container.queryByText('menu.community'));
    expect(container.queryByText('misc.campaigns')).toBeInTheDocument();
    expect(container.queryByText('misc.business_directory')).toBeInTheDocument();
    expect(container.queryByText('misc.news')).toBeInTheDocument();
    expect(container.queryByText('misc.labels')).toBeInTheDocument();
    expect(container.queryByText('misc.discussions')).toBeInTheDocument();
    expect(container.queryByText('misc.tasks')).toBeInTheDocument();
    expect(container.queryByText('menu.email_templates')).toBeInTheDocument();
  });

  it('should not render submenu items when user does not have required permissions', async () => {
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
        permissions: [
            {
              module: "community",
              permissions: ['can_see_menu_item']
            },
            {
              module: "note",
              permissions: []
            },
            {
              module: "email_template",
              permissions: []
            },
            ]
      }
    };

    const container = render(
      <Context.Provider value={data}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>

              <SideMenu
                toggleDrawer={handleDrawerToggle}
                menuItems={modules}
                userType={data.user.userType}
                communityFeatures={Object.keys(features)}
                mobileOpen={false}
                direction="left"
              />

            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryAllByTestId('sidenav-container')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('sidenav-container')).toHaveLength(1)

    // toggle the menu and make sure new menus will show
    fireEvent.click(container.queryByText('menu.community'));
    expect(container.queryByText('misc.tasks')).not.toBeInTheDocument();
    expect(container.queryByText('menu.processes')).not.toBeInTheDocument();
    expect(container.queryByText('menu.email_templates')).not.toBeInTheDocument();
  });
});
