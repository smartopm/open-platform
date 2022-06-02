import React from 'react'
import { render } from '@testing-library/react'

import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import PlanMobileDataList, { PaymentMobileDataList, TransactionMobileDataList } from '../Components/UserTransactions/PaymentMobileDataList'

describe('It should test the plan mobile datalist component', () => {
  const planHeader = [
    { title: 'Plot Number', col: 2 },
    { title: 'Payment Plan', col: 2 },
    { title: 'Start Date', col: 2 },
    { title: 'Balance/Monthly Amount', col: 2 },
    { title: 'Payment Day', col: 2 },
    { title: 'Menu', col: 2 }
  ];

  const data = [
    {
      'Plot Number': 'number',
      'Payment Plan': 'plan',
      'Start Date': 'start',
      'Balance/Monthly Amount': 'amount',
      'Payment Day': 'day',
      'Menu': 'menu',
    }
  ]

  it('should render plan mobile datalist', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <PlanMobileDataList 
            keys={planHeader}
            data={data}
          />
        </BrowserRouter>
      </MockedProvider> 
    )

    expect(container.getByTestId("title")).toBeInTheDocument()
    expect(container.getByTestId("content")).toBeInTheDocument()
  });

  it('should render Payment mobile datalist', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <PaymentMobileDataList 
            keys={planHeader}
            data={data}
          />
        </BrowserRouter>
      </MockedProvider> 
    )

    expect(container.getByTestId("title")).toBeInTheDocument()
    expect(container.getByTestId("content")).toBeInTheDocument()
  });

  it('should render Transaction mobile datalist', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <TransactionMobileDataList 
            keys={planHeader}
            data={data}
          />
        </BrowserRouter>
      </MockedProvider> 
    )

    expect(container.getByTestId("title")).toBeInTheDocument()
    expect(container.getByTestId("content")).toBeInTheDocument()
  });
});