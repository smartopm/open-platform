import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import GeneralPlanList, { renderPayments } from '../Components/UserTransactions/GeneralPlanList';
import currency from '../../../__mocks__/currency';
import userMock from '../../../__mocks__/authstate';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('General Plan List Component', () => {
  const data = {
    generalPayments: 2000,
    planPayments: [
      {
        id: '76ey2j3eh2uiu3o48r3',
        createdAt: '2021-11-11',
        amount: 2000,
        receiptNumber: 'rty233',
        status: 'paid',
        userTransaction: {
          source: 'cash'
        },
        user: {
          id: 'f280159d-ac71-4c22-997a-07fd07',
          name: 'another name',
          extRefId: '2345687'
        },
        community: {
          bankingDetails: {
            bankName: 'Test bank name',
            accountName: 'Thebe',
            accountNo: '1234',
            branch: 'Test branch',
            swiftCode: '032',
            sortCode: '456',
            address: '11, Nalikwanda Rd,',
            city: 'Lusaka',
            country: 'Zambia',
            taxIdNo: 'tax1234'
          },
          socialLinks: [{ category: 'website', social_link: 'www.web.com' }],
          supportEmail: [{ category: 'bank', email: 'payment@support.com' }],
          supportNumber: [{ category: 'bank', phone_number: '+260 1234' }],
          currency: 'kwacha'
        }
      }
    ]
  };

  const currentUser = {
    userType: 'admin'
  };
  it('should render the general plan list component', async () => {
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <GeneralPlanList
                data={data}
                currencyData={currency}
                currentUser={currentUser}
                userId="te12312378123"
                balanceRefetch={jest.fn()}
                genRefetch={jest.fn()}
                paymentPlansRefetch={jest.fn()}
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );
    expect(container.queryByTestId('card')).toBeInTheDocument();
    expect(container.queryByTestId('title')).toBeInTheDocument();
    expect(container.queryByTestId('amount')).toBeInTheDocument();
    expect(container.queryByTestId('plan-menu')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('card'));
    expect(container.queryByTestId('payment-date')).toBeInTheDocument();
    expect(container.queryByTestId('payment-type')).toBeInTheDocument();
    expect(container.queryByTestId('pay-amount')).toBeInTheDocument();
    expect(container.queryByTestId('status')).toBeInTheDocument();
    expect(container.queryByTestId('pay-menu')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('plan-menu'));
    expect(container.queryByText('common:menu.view_statement')).toBeInTheDocument();
    expect(container.queryByText('common:menu.allocate_funds')).toBeInTheDocument();

    fireEvent.click(container.queryByText('common:menu.view_statement'));
    fireEvent.click(container.queryByText('common:menu.allocate_funds'));
    expect(container.queryAllByText('common:menu.allocate_funds')[0]).toBeInTheDocument();

    await waitFor(() => {
      fireEvent.click(container.queryByTestId('pay-menu'));
      expect(container.queryByText('common:menu.view_receipt')).toBeInTheDocument();
    }, 10);
  });

  it('should check if renderpayments works as expected', () => {
    const menuData = {
      menuList: [{ content: 'View receipt', isAdmin: true, color: '', handleClick: jest.fn() }],
      handleTransactionMenu: jest.fn(),
      anchorEl: document.createElement("button"),
      open: true,
      userType: 'admin',
      handleClose: jest.fn()
    };
    const results = renderPayments(data.planPayments[0], currency, menuData);
    expect(results).toBeInstanceOf(Object);
    expect(results).toHaveProperty('Payment Date');
    expect(results).toHaveProperty('Payment Type');
    expect(results).toHaveProperty('Amount');
    expect(results).toHaveProperty('Status');
    expect(results).toHaveProperty('Menu');
  });
});
