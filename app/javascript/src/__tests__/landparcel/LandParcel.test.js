/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
// import ParcelItem from '../../components/LandParcels/LandParcelItem'
// import { ParcelPageTitle } from '../../components/LandParcels/LandParcel'

describe.skip('It should test the comment component', () => {
  const data = {
    id: "253673",
    parcelNumber: 'plot-1234',
    address1: 'address',
    address2: "add",
    city: 'lagos',
    postalCode: '123234',
    stateProvince: 'hiwhe',
    country: 'Nigeria',
    parcelType: 'land'
  }

  it('should check if ParcelItem renders with no error', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <ParcelItem parcel={data} onParcelClick={() => {}} />
        </MockedProvider>
      </BrowserRouter>
    )

    expect(container.getByTestId("parcel-address1")).toBeInTheDocument()
    expect(container.queryByText("plot-1234")).toBeInTheDocument()
    expect(container.queryByText("123234")).toBeInTheDocument()
    expect(container.queryByText("address")).toBeInTheDocument()
    expect(container.queryByText("lagos")).toBeInTheDocument()
    expect(container.queryByText("Nigeria")).toBeInTheDocument()
    expect(container.queryByText("hiwhe")).toBeInTheDocument()
    expect(container.queryByText("add")).toBeInTheDocument()
  });

// This should be replaced with DataList component
  it('should check for parcel title', () => {
    const container = render(<ParcelPageTitle />)
    expect(container.queryByText("Property Number")).toBeInTheDocument()
    expect(container.queryByText("Address1")).toBeInTheDocument()
    expect(container.queryByText("Address2")).toBeInTheDocument()
    expect(container.queryByText("Postal Code")).toBeInTheDocument()
    expect(container.queryByText("city")).toBeInTheDocument()
    expect(container.queryByText("State Province")).toBeInTheDocument()
    expect(container.queryByText("Country")).toBeInTheDocument()
    expect(container.queryByText("Property Type")).toBeInTheDocument()
  })
});