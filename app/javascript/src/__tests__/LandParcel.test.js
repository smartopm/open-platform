import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import ParcelItem from '../components/LandParcels/LandParcelItem'

describe('It should test the comment component', () => {
  const data = {
    id: "253673",
    parcelNumber: '1234',
    address1: 'address',
    address2: "add",
    city: 'lagos',
    postalCode: '1234',
    stateProvince: 'hiwhe',
    country: 'Nigeria',
    parcelType: 'land'
  }

  it('it should render with no error', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <ParcelItem parcel={data} />
        </MockedProvider>
      </BrowserRouter>
    )

    expect(container.getByTestId("parcel-address1")).toBeInTheDocument()
  });
});