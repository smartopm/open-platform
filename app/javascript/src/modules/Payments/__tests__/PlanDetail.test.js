import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import PlanDetail from '../Components/UserTransactions/PlanDetail'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('It should test the plan detail modal component', () => {
  const planData = {
    id: '84h3ui7ehf',
    planType: 'type',
    startDate: '2020-12-12',
    installmentAmount: 100,
    planValue: 200,
    duration: 12,
    status: 'active',
    endDate: '2020-12-12',
    user: {
      name: 'some name'
    },
    landParcel: {
      parcelNumber: 'test123'
    }
  }

  it('it should render plan detail modal', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <PlanDetail 
            open
            handleModalClose={jest.fn}
            currencyData={{ currency: 'ZMW', locale: 'en-ZM'}}
            planData={planData}
          />
        </BrowserRouter>
      </MockedProvider> 
    )

    expect(container.getByTestId("name")).toBeInTheDocument()
    expect(container.getByTestId("detail")).toBeInTheDocument()
    expect(container.getByTestId("status")).toBeInTheDocument()
    expect(container.getByTestId("start-date")).toBeInTheDocument()
    expect(container.getByTestId("end-date")).toBeInTheDocument()
  });
});