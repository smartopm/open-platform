import React from 'react'
import { render } from '@testing-library/react'
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
    }
  }

  it('it should render plan item list component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <PlanListItem 
            currencyData={{ currency: 'ZMW', locale: 'en-ZM'}}
            data={data}
          />
        </BrowserRouter>
      </MockedProvider> 
    )

    expect(container.getByTestId("landparcel")).toBeInTheDocument();
    expect(container.getByTestId("payment-slider")).toBeInTheDocument();
    expect(container.getByTestId("label")).toBeInTheDocument();
  });
});