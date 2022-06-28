import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import 'leaflet';
import 'leaflet-draw';
import CreateLandParcel from '../components/LandParcels/CreateLandParcel';
import { AddNewProperty } from '../graphql/mutations';
import MockedThemeProvider from '../modules/__mocks__/mock_theme';
import MockedSnackbarProvider from '../modules/__mocks__/mock_snackbar';

jest.mock('leaflet-draw');
describe('Land Property Component', () => {
  const mocks = {
    request: {
      query: AddNewProperty,
      variables: {
        parcelNumber: 'This is a parcel number',
        address1: 'This is a address1',
        address2: 'This is a address2',
        city: 'This is a city',
        postalCode: '123',
        stateProvince: 'This is state province',
        parcelType: 'This is parcel type',
        country: 'This is country',
        longX: 0,
        latY: 0,
        geom: null,
        ownershipFields: []
      }
    },
    result: { data: { PropertyCreate: { landParcel: { id: '7867943' } } } }
  };
  const refetchHouseData = jest.fn();
  const selectedLandParcel = {
    id: '7867943'
  };
  it('should render add property form', async () => {
    const refetch = jest.fn();
    const container = render(
      <MockedProvider mocks={[mocks]} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <MockedSnackbarProvider>
              <CreateLandParcel
                refetch={refetch}
                newHouse={false}
                refetchHouseData={refetchHouseData}
                selectedLandParcel={selectedLandParcel}
              />
            </MockedSnackbarProvider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    const parcelButton = container.queryByTestId('parcel-button');
    fireEvent.click(parcelButton);

    const parcelNumber = container.queryByTestId('parcel-number');
    fireEvent.change(parcelNumber, { target: { value: 'This is a parcel number' } });
    expect(parcelNumber.value).toBe('This is a parcel number');

    const address1 = container.queryByTestId('address1');
    fireEvent.change(address1, { target: { value: 'This is a address1' } });
    expect(address1.value).toBe('This is a address1');

    const address2 = container.queryByTestId('address2');
    fireEvent.change(address2, { target: { value: 'This is a address2' } });
    expect(address2.value).toBe('This is a address2');

    const city = container.queryByTestId('city');
    fireEvent.change(city, { target: { value: 'This is a city' } });
    expect(city.value).toBe('This is a city');

    const postalCode = container.queryByTestId('postal-code');
    fireEvent.change(postalCode, { target: { value: 123 } });
    expect(postalCode.value).toBe('123');

    const stateProvince = container.queryByTestId('state-province');
    fireEvent.change(stateProvince, { target: { value: 'This is state province' } });
    expect(stateProvince.value).toBe('This is state province');

    const country = container.queryByTestId('country');
    fireEvent.change(country, { target: { value: 'This is country' } });
    expect(country.value).toBe('This is country');

    const parcelType = container.queryByTestId('parcel-type');
    fireEvent.change(parcelType, { target: { value: 'This is parcel type' } });
    expect(parcelType.value).toBe('This is parcel type');

    expect(parcelButton).toBeInTheDocument();
    expect(container.queryByTestId('custom-dialog-button')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('custom-dialog-button'));

    await waitFor(
      () => {
        expect(container.queryByText('messages.property_added')).toBeInTheDocument();
      },
      { timeout: 500 }
    );
    fireEvent.click(container.queryByTestId('dialog_cancel'));
  });

  it('should render property form with error', async () => {
    const errorMocks = {
      request: {
        query: AddNewProperty,
        variables: {
          parcelNumber: '57567',
          address1: '',
          address2: '',
          city: '',
          postalCode: '',
          stateProvince: '',
          parcelType: '',
          country: '',
          longX: 0,
          latY: 0,
          geom: null
        }
      },
      result: { data: { PropertyCreate: { landParcel: { id: '7867943' } } } }
    };
    const refetch = jest.fn();
    const container = render(
      <MockedProvider mocks={[errorMocks]} addTypename={false}>
        <BrowserRouter>
          <MockedThemeProvider>
            <MockedSnackbarProvider>
              <CreateLandParcel
                refetch={refetch}
                newHouse={false}
                refetchHouseData={refetchHouseData}
                selectedLandParcel={selectedLandParcel}
              />
            </MockedSnackbarProvider>
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      const parcelButton = container.queryByTestId('parcel-button');
      fireEvent.click(parcelButton);

      const parcelNumber = container.queryByTestId('parcel-number');
      fireEvent.change(parcelNumber, { target: { value: 'This is a parcel number' } });
      expect(parcelNumber.value).toBe('This is a parcel number');

      const address1 = container.queryByTestId('address1');
      fireEvent.change(address1, { target: { value: 'This is a address1' } });
      expect(address1.value).toBe('This is a address1');

      const address2 = container.queryByTestId('address2');
      fireEvent.change(address2, { target: { value: 'This is a address2' } });
      expect(address2.value).toBe('This is a address2');

      const city = container.queryByTestId('city');
      fireEvent.change(city, { target: { value: 'This is a city' } });
      expect(city.value).toBe('This is a city');

      const postalCode = container.queryByTestId('postal-code');
      fireEvent.change(postalCode, { target: { value: 123 } });
      expect(postalCode.value).toBe('123');

      const stateProvince = container.queryByTestId('state-province');
      fireEvent.change(stateProvince, { target: { value: 'This is state province' } });
      expect(stateProvince.value).toBe('This is state province');

      const country = container.queryByTestId('country');
      fireEvent.change(country, { target: { value: 'This is country' } });
      expect(country.value).toBe('This is country');

      const parcelType = container.queryByTestId('parcel-type');
      fireEvent.change(parcelType, { target: { value: 'This is parcel type' } });
      expect(parcelType.value).toBe('This is parcel type');

      expect(parcelButton).toBeInTheDocument();
      expect(container.queryByTestId('custom-dialog-button')).toBeInTheDocument();

      fireEvent.click(container.queryByTestId('custom-dialog-button'));
    }, 10);
  });
});
