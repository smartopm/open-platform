import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import '@testing-library/jest-dom/extend-expect'
import LandParcelModal from '../../components/LandParcels/LandParcelModal'

describe('Land Property Modal Component', () => {
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
    const ownerAddress = container.queryByTestId('owner-address')
    fireEvent.change(ownerAddress, { target: { value: 'Owner Address' } })
    expect(ownerAddress.value).toBe('Owner Address')
    expect(container.queryByTestId("owner")).toBeDefined();
  })

  it('it should not allow adding new items if in "details" mode until edit-btn is clicked', () => {
    const props = {
      open: true,
      handelClose: jest.fn,
      modalType: 'details',
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

    expect(container.queryByText('Add Valuation')).toBeNull()
    expect(container.queryByText('New Owner')).toBeNull()

    fireEvent.click(container.queryByText('Edit Property'))
    expect(container.queryByText('Add Valuation')).toBeInTheDocument()
    expect(container.queryByText('New Owner')).toBeInTheDocument()

    const parcelNumber = container.queryByTestId('parcel-number')
    fireEvent.change(parcelNumber, { target: { value: '12345' } })
    expect(parcelNumber.value).toBe('12345')
  })
})