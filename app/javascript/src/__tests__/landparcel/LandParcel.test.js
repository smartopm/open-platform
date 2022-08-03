/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import 'leaflet'
import 'leaflet-draw'
import ParcelItem, { renderParcel } from '../../components/LandParcels/LandParcelItem'
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';


jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
jest.mock('leaflet-draw')
describe('It should test the comment component', () => {
  const data = {
    id: "253673",
    parcelNumber: 'plot-1234',
    address1: '123 Zoo Estate',
    address2: "Sampala",
    city: 'lagos',
    postalCode: '123234',
    stateProvince: 'South-west',
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

  it('should check if ParcelItem renders with no error', async () => {
    render(
      <BrowserRouter>
        <MockedProvider>
          <MockedThemeProvider>
            <ParcelItem parcel={data} onParcelClick={() => {}} onAddHouseClick={() => {}} />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId("property")).toBeInTheDocument()
      expect(screen.getByTestId("property").textContent).toMatch(/plot-1234/i)
      expect(screen.getByTestId("property").textContent).toMatch(/Category: Land/i)
      expect(screen.getByTestId("property").textContent).toMatch(/Status: Active/i)
      expect(screen.getByTestId("address")).toBeInTheDocument()
      expect(screen.getByTestId("address").textContent).toMatch(/123 Zoo Estate/i)
      expect(screen.getByTestId("address").textContent).toMatch(/sampala/i)
      expect(screen.getByTestId("postal-code")).toBeInTheDocument()
      expect(screen.getByTestId("postal-code").textContent).toMatch(/123234/i)
      expect(screen.getByTestId("city")).toBeInTheDocument()
      expect(screen.getByTestId("city").textContent).toMatch(/lagos/i)
      expect(screen.getByTestId("country")).toBeInTheDocument()
      expect(screen.getByTestId("country").textContent).toMatch(/south-west/i)
      expect(screen.getByTestId("country").textContent).toMatch(/nigeria/i)
      expect(screen.getByTestId("menu")).toBeInTheDocument()
      expect(screen.getByTestId("edit_property_menu")).toBeInTheDocument()
      expect(screen.getByTestId("menu_list")).toBeInTheDocument()
      expect(screen.getAllByTestId("menu_item").length).toBeGreaterThan(0)
      expect(screen.getAllByTestId("menu_item")[0].textContent).toEqual('Add House')
      expect(screen.getAllByTestId("menu_item")[1].textContent).toEqual('Edit Property')
    }, 10)

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