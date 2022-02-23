import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserDetailHeader from '../Components/UserDetailHeader';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('User Detail Header Component', () => {
  const data = {
    user: {
      id: '37286ew3'
    }
  }

  const authState = {
    user: {
      permissions: [{module: 'user', permissions: ['can_see_menu_item']}],
      community: {
        features: {
          Users: { features: [] }
        }
      }
    }
  }
  it('should render the user detail header component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserDetailHeader data={data} userType='admin' currentTab='Contacts' authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('breadcrumb')).toBeInTheDocument();
    expect(container.queryByTestId('user-detail')).toBeInTheDocument();
  });

  it('should render render select menu list', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <UserDetailHeader data={data} userType='admin' currentTab='Contacts' authState={authState} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('button')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('arrow-icon'));
    expect(container.queryByText('User Settings')).toBeInTheDocument();

    fireEvent.click(container.queryByText('User Settings'))
    expect(container.queryByText('Edit User')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('user-detail'))
  });
});
