import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import '@testing-library/jest-dom/extend-expect'
import LandParcelModal from '../components/LandParcels/LandParcelModal'

describe('Land Parcel Modal Component', () => {
  it('it should render tabs', () => {
    const props = {
      open: true,
      handelClose: jest.fn,
      modalType: 'new',
      landParcel: {
        id: '1u2y3y4',
        parcelNumber: '15800'
      }
    }
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <LandParcelModal {...props} />
        </BrowserRouter>
      </MockedProvider>)

    expect(container.queryByText('Details')).toBeInTheDocument()
    expect(container.queryByText('Ownership')).toBeInTheDocument()
    expect(container.queryByText('Valuation History')).toBeInTheDocument()

    fireEvent.click(container.queryByText('Ownership'))
    expect(container.queryByText('New Owner')).toBeInTheDocument()

    fireEvent.click(container.queryByText('Valuation History'))
    expect(container.queryByText('Add Valuation')).toBeInTheDocument()

    fireEvent.click(container.queryByText('Add Valuation'))
    const valuationAmount = container.queryByTestId('valuation-amount')
    fireEvent.change(valuationAmount, { target: { value: 200 } })
    expect(valuationAmount.value).toBe('200')

    fireEvent.click(container.queryByText('New Owner'))
    const owner = container.queryByTestId('owner')
    fireEvent.change(owner, { target: { value: 'Owner Name' } })
    expect(owner.value).toBe('Owner Name')
  })
})