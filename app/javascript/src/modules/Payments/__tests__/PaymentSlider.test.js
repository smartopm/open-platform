import React from 'react'
import { render } from '@testing-library/react'

import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import PaymentSlider from '../Components/PaymentSlider'

describe('It should test the payment slider component', () => {
  const data = {
    planType: 'basic',
    planValue: 10000,
    totalPayments: 2000,
    owingAmount: 3000,
    installmentsDue: 4,
    landParcel: {
      parcelNumber: 'test123'
    }
  }

  const anotherData = {
    planType: 'basic',
    planValue: 10000,
    totalPayments: 2000,
    owingAmount: 0,
    installmentsDue: 0,
    landParcel: {
      parcelNumber: 'test123'
    }
  }

  it('should render payment slider component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <PaymentSlider 
            currencyData={{ currency: 'ZMW', locale: 'en-ZM'}}
            data={data}
          />
        </BrowserRouter>
      </MockedProvider> 
    )

    expect(container.getByTestId("body")).toBeInTheDocument();
    expect(container.getByTestId("plan-value")).toBeInTheDocument();
    expect(container.getByTestId("owing")).toBeInTheDocument();
  });

  it('should not render owing slider component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <PaymentSlider 
            currencyData={{ currency: 'ZMW', locale: 'en-ZM'}}
            data={anotherData}
          />
        </BrowserRouter>
      </MockedProvider> 
    )

    expect(container.getByTestId("body")).toBeInTheDocument();
    expect(container.getByTestId("plan-value")).toBeInTheDocument();
    expect(container.queryByTestId("owing")).not.toBeInTheDocument();
  });
});