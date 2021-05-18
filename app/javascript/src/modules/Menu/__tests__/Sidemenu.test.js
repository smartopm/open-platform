import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import authState from '../../../__mocks__/authstate';
import { SideMenu } from '../index';
import modules from '../..';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('Side Nav component', () => {
  it('should render proper the sidenav menu', () => {
    const handleDrawerToggle = jest.fn();
    const features = [
      "Search",
      "Referral",
      "Payments",
      "Time Card",
      "Logout",
      "Community",
      "Messages",
      "Dashboard",
      "Properties",
      "Users",
      "LogBook",
      "Action Flows",
      "Time Card",
      "Campaigns",
      "Business",
      "Discussions",
      "Labels",
      "News"
    ]

    const container = render(
      <BrowserRouter>
        <SideMenu
          toggleDrawer={handleDrawerToggle}
          menuItems={modules}
          userType={authState.user.userType}
          communityFeatures={features}
          mobileOpen={false}
          direction="left"
        />
      </BrowserRouter>
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
  });
});