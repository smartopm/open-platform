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

    const container = render(
      <BrowserRouter>
        <SideMenu
          toggleDrawer={handleDrawerToggle}
          menuItems={modules}
          userType={authState.user.userType}
          mobileOpen={false}
        />
      </BrowserRouter>
    );
    expect(container.queryAllByTestId('sidenav-container')[0]).toBeInTheDocument();
    expect(container.queryAllByTestId('sidenav-container')).toHaveLength(1);
    expect(container.queryByText('Home')).toBeInTheDocument()
    expect(container.queryByText('Communication')).not.toBeInTheDocument()
    expect(container.queryByText('Log Book')).toBeInTheDocument()
    expect(container.queryByText('Payments')).toBeInTheDocument()
    expect(container.queryByText('Users')).toBeInTheDocument()
    expect(container.queryByText('Properties')).toBeInTheDocument()
    expect(container.queryByText('Action Flows')).toBeInTheDocument()
    expect(container.queryByText('Time Card')).toBeInTheDocument()
    expect(container.queryByText('Community')).toBeInTheDocument()
    expect(container.queryByText('News')).not.toBeInTheDocument() // should not be initially visible 


    // toggle the menu and make sure new menus will show
    fireEvent.click(container.queryByText('Community'));
    expect(container.queryByText('News')).toBeInTheDocument()
    expect(container.queryByText('Discussions')).toBeInTheDocument()
    expect(container.queryByText('Messages')).toBeInTheDocument()
    expect(container.queryByText('Campaigns')).toBeInTheDocument()
    expect(container.queryByText('Labels')).toBeInTheDocument()
    expect(container.queryByText('Business')).toBeInTheDocument()
    expect(container.queryByText('Permits & Request Forms')).toBeInTheDocument()
    expect(container.queryByText('Business')).toBeInTheDocument()
  });
});