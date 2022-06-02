/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { render } from '@testing-library/react'

import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import 'leaflet'
import 'leaflet-draw'
import ParcelItem, { renderParcel } from '../../components/LandParcels/LandParcelItem'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
jest.mock('leaflet-draw')
describe('It should test the comment component', () => {
  const data = {
    id: "253673",
    parcelNumber: 'plot-1234',
    address1: 'address',
    address2: "add",
    city: 'lagos',
    postalCode: '123234',
    stateProvince: 'hiwhe',
    country: 'Nigeria',
    parcelType: 'basic',
    objectType: 'land',
    status: 'active'
  }

  const menuData = {
    menuList: [{ content: 'Add House', isAdmin: true, color: '', handleClick: jest.fn()}],
    handlePropertyMenu: jest.fn(),
    anchorEl: document.createElement("button"),
    open: true,
    handleClose: jest.fn()
  }

  it('should check if ParcelItem renders with no error', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <ParcelItem parcel={data} onParcelClick={() => {}} onAddHouseClick={() => {}} />
        </MockedProvider>
      </BrowserRouter>
    )

    expect(container.getByTestId("property")).toBeInTheDocument()
    expect(container.getByTestId("address")).toBeInTheDocument()
    expect(container.getByTestId("postal-code")).toBeInTheDocument()
    expect(container.getByTestId("city")).toBeInTheDocument()
    expect(container.getByTestId("country")).toBeInTheDocument()
    expect(container.getByTestId("menu")).toBeInTheDocument()
  });

  it('should check if renderProperty works as expected', () => {
    const results = renderParcel(data, menuData);
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('Property Number/Property Type');
    expect(results[0]).toHaveProperty('Address1/Address2');
    expect(results[0]).toHaveProperty('Postal Code');
    expect(results[0]).toHaveProperty('City');
    expect(results[0]).toHaveProperty('State Province/Country');
    expect(results[0]).toHaveProperty('Menu')
  });
});