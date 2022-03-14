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
  };

  const authState = {
    user: {
      permissions: [
        { module: 'user', permissions: ['can_see_menu_item'] },
        { module: 'entry_request', permissions: ['can_see_menu_item'] },
        { module: 'communication', permissions: ['can_see_menu_item'] },
        { module: 'forms', permissions: ['can_see_menu_item'] }
      ],
      community: {
        features: {
          Users: { features: [] },
          Messages: { features: [] },
          LogBook: { features: [] },
          Payments: { features: [] },
          Properties: { features: [] },
          Forms: { features: [] },
          'Customer Journey': { features: [] }
        }
      }
    }
  };
  it('should render the user detail header component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserDetailHeader
            data={data}
            userType="admin"
            currentTab="Contacts"
            authState={authState}
          />
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
            <UserDetailHeader
              data={data}
              userType="admin"
              currentTab="Contacts"
              authState={authState}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('button')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('arrow-icon'));
    expect(container.queryByText('common:menu.user_settings')).toBeInTheDocument();

    fireEvent.click(container.queryByText('common:menu.user_settings'));
    expect(container.queryByText('common:right_menu.edit_user')).toBeInTheDocument();
    fireEvent.click(container.queryByText('common:right_menu.edit_user'));
    fireEvent.click(container.queryByText('common:menu.print_id'));
    fireEvent.click(container.queryByText('common:menu.merge_user'));
    fireEvent.click(container.queryByText('common:menu.user_logs'));
    fireEvent.click(container.queryAllByText('common:menu.user_settings')[1]);
    expect(container.queryByText('common:right_menu.edit_user')).not.toBeInTheDocument();
    expect(container.queryByText('common:menu.print_id')).not.toBeInTheDocument();
    expect(container.queryByText('common:menu.merge_user')).not.toBeInTheDocument();
    expect(container.queryByText('common:menu.user_logs')).not.toBeInTheDocument();
    fireEvent.click(container.queryByText('common:misc.payments'));
    fireEvent.click(container.queryByText('common:misc.plots'));
    fireEvent.click(container.queryByText('common:menu.lead_management'));
    fireEvent.click(container.queryByText('common:misc.forms'));
    fireEvent.click(container.queryByText('common:menu.customer_journey'));
    fireEvent.click(container.queryByText('common:misc.communication'));
    expect(container.queryByText('common:right_menu.communications')).toBeInTheDocument();
    fireEvent.click(container.queryByText('common:menu.send_sms'));
    fireEvent.click(container.queryByText('common:menu.send_otp'));
    fireEvent.click(container.queryByText('common:menu.message_support'));
    fireEvent.click(container.queryAllByText('common:misc.communication')[1]);
    expect(container.queryByText('common:menu.send_sms')).not.toBeInTheDocument();
    expect(container.queryByText('common:menu.send_otp')).not.toBeInTheDocument();
    fireEvent.click(container.queryByTestId('arrow-icon'));
    expect(container.queryByText('common:right_menu.edit_user')).not.toBeInTheDocument();
  });

  it('should not render the user breadcrumb when user is not an admin', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserDetailHeader data={data} userType='client' currentTab='Contacts' authState={authState} />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.queryByTestId('breadcrumbuser')).not.toBeInTheDocument();
  });
});
