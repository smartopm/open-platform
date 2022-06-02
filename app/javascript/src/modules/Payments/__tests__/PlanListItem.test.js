import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import PlanListItem from '../Components/PlanListItem';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('It should test the plan item list item component', () => {
  const data = {
    planType: 'basic',
    status: 'on_track',
    planStatus: 'on_track',
    upcomingInstallmentDueDate: '2021-01-01',
    landParcel: {
      parcelNumber: 'test123',
      parcelType: 'basic'
    },
    user: {
      id: 'ijlol34321cd'
    },
    planPayments: [
      {
        amount: 100.0,
        status: 'paid',
        createdAt: '2020-11-13T10:53:16Z',
        receiptNumber: 'MI131',
        id: 'MI131029'
      }
    ]
  };

  const menuList = [
    {
      content: 'payment.misc.payment_reminder',
      isAdmin: true,
      handleClick: () => jest.fn()
    }
  ];
  const menuData = {
    menuList,
    handleMenuClick: jest.fn,
    anchorEl: document.createElement("button"),
    open: false,
    userType: 'admin',
    handleClose: () => jest.fn
  };

  it('should render plan item list component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <PlanListItem
              currencyData={{ currency: 'ZMW', locale: 'en-ZM' }}
              data={data}
              menuData={menuData}
              handlePlansSelect={jest.fn()}
            />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    expect(container.getByTestId('landparcel')).toBeInTheDocument();
    expect(container.getByTestId('payment-slider')).toBeInTheDocument();
    expect(container.getByTestId('label')).toBeInTheDocument();
    expect(container.getByTestId('due-date')).toBeInTheDocument();
    const viewHistory = container.getByTestId('view-history');
    expect(viewHistory).toBeInTheDocument();
    fireEvent.click(viewHistory);
    expect(container.getByTestId('payment-date')).toBeInTheDocument();
    expect(container.getByTestId('receipt-number')).toBeInTheDocument();
    expect(container.getByTestId('amount-paid')).toBeInTheDocument();
    expect(container.getByTestId('payment-status')).toBeInTheDocument();
  });
});
