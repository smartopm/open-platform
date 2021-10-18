import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import PlanListItem from '../Components/PlanListItem'

describe('It should test the plan item list item component', () => {
  const data = {
    planType: 'basic',
    landParcel: {
      parcelNumber: 'test123',
      parcelType: 'basic'
    },
    user: {
      id: 'ijlol34321cd'
    },
    planPayments: [{
      amount: 100.0,
      status: 'paid',
      createdAt: "2020-11-13T10:53:16Z",
      receiptNumber: 'MI131'
    }]
  }

  const menuList = [
    {
      content: ('payment.misc.payment_reminder'),
      isAdmin: true,
      handleClick: () => jest.fn()
    }
  ]
  const menuData = {
    menuList,
    handleMenuClick: jest.fn,
    anchorEl: null,
    open: false,
    userType: 'admin',
    handleClose: () => jest.fn
  }

  it('should render plan item list component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <PlanListItem 
            currencyData={{ currency: 'ZMW', locale: 'en-ZM'}}
            data={data}
            menuData={menuData}
          />
        </BrowserRouter>
      </MockedProvider> 
    )

    expect(container.getByTestId("landparcel")).toBeInTheDocument();
    expect(container.getByTestId("payment-slider")).toBeInTheDocument();
    expect(container.getByTestId("label")).toBeInTheDocument();
    const viewHistory = container.getByTestId('view-history');
    expect(viewHistory).toBeInTheDocument();
    fireEvent.click(viewHistory);
    expect(container.getByTestId("payment-date")).toBeInTheDocument();
    expect(container.getByTestId("receipt-number")).toBeInTheDocument();
    expect(container.getByTestId("amount-paid")).toBeInTheDocument();
    expect(container.getByTestId("payment-status")).toBeInTheDocument();
  });
});