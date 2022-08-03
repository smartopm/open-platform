import React from 'react';
import { render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom/';
import Support, { SupportContact } from '../Components/SupportCard';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('Support card loads component', () => {
  const user = {
    userType: 'client',
    community: {
      name: 'Nkwashi',
      supportNumber: [{ phone_number: '+260 966 194383', category: 'sales' }],
      supportEmail: [{ email: 'support@doublegdp.com', category: 'customer_care' }],
      supportWhatsapp: [{ whatsapp: '+2347065834175', category: 'customer_care' }]
    }
  };
  it('should render support card', () => {
    const container = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <Support handleSendMessage={jest.fn()} user={user} />
        </MockedThemeProvider>
      </BrowserRouter>
    );
    expect(container.queryByText(/Nkwashi/i)).toBeInTheDocument();
    expect(container.queryByText(/partnership.registration_kiosk/i)).toBeInTheDocument();
    expect(container.queryByText('support@doublegdp.com')).toBeInTheDocument();
    expect(container.queryByText('misc.sales_support')).toBeInTheDocument();
    expect(container.queryByText('misc.customer_care')).toBeInTheDocument();
    expect(container.queryByText('+260 966 194383')).toBeInTheDocument();
    expect(container.queryByText('+2347065834175')).toBeInTheDocument();
    expect(container.queryByText('buttons.support_chat')).toBeInTheDocument();
    expect(container.queryByText('buttons.pay_with_mobile_money')).toBeInTheDocument();
    expect(container.queryByText('buttons.pay_with_mobile_money')).not.toBeDisabled();
    expect(container.queryByText('buttons.privacy_and_terms')).toBeInTheDocument();
    expect(container.queryByText('buttons.privacy_and_terms')).not.toBeDisabled();
  });

  it('should render not render Pay with Mobile Money for CM community', () => {
    const updatedUser = {
      ...user,
      community: {
        ...user.community,
        name: 'Ciudad Morazán'
      }
    };
    const container = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <Support handleSendMessage={jest.fn()} user={updatedUser} />
        </MockedThemeProvider>
      </BrowserRouter>
    );
    expect(container.queryByText(/Ciudad Morazán/i)).toBeInTheDocument();
    expect(container.queryByText('Pay With Mobile Money')).not.toBeInTheDocument();
  });

  it('should display no contacts message', () => {
    const newUser = {
      userType: 'client',
      community: {
        supportNumber: [],
        supportEmail: [{ email: 'support@doublegdp.com', category: 'customer_care' }],
        supportWhatsapp: []
      }
    };
    const container = render(
      <BrowserRouter>
        <MockedThemeProvider>
          <Support handleSendMessage={jest.fn()} user={newUser} />
        </MockedThemeProvider>
      </BrowserRouter>
    );

    expect(container.queryByText('misc.contacts_not_available')).toBeInTheDocument();
  });
});

describe('Support contact component', () => {
  const customerCare = {
    contact: '+260 900000000',
    type: 'phone'
  };
  it('should render support card', () => {
    const container = render(<SupportContact support={customerCare} classes={{}} />);
    expect(container.queryByText('+260 900000000')).toBeInTheDocument();
  });
});
