/* eslint-disable */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { act, render } from '@testing-library/react';
import { AuthStateProvider } from '../../containers/Provider/AuthStateProvider';
import LandParcelMap from '../../components/LandParcels/LandParcelMap';
import PointOfInterestDrawerDialog from '../../components/Map/PointOfInterestDrawerDialog';
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
jest.mock('react-leaflet');
describe('LandParcelMap', () => {
  it('should mount component correctly', async () => {
    const props = {
      handlePlotClick: jest.fn(),
      geoData: []
    };

    let container;

    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <LandParcelMap handlePlotClick={props.handlePlotClick} geoData={props.geoData} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      );
    });

    expect(container.queryByTestId('leaflet-map-container')).toBeTruthy();
  });

  it('should mount drawer component correctly', async () => {
    const props = {
      anchor: 'right',
      open: true,
      onClose: jest.fn,
      imageData: { url: '', loading: false },
      selectedPoi: {
        poiName: 'Hotel',
        parcelNumber: 'poi-123',
        parcelType: 'poi',
        longX: 28.123,
        latY: -15.123
      }
    };

    let container;

    await act(async () => {
      container = render(
        <MockedProvider>
          <AuthStateProvider>
            <BrowserRouter>
              <MockedThemeProvider>
                <PointOfInterestDrawerDialog {...props} />
              </MockedThemeProvider>
            </BrowserRouter>
          </AuthStateProvider>
        </MockedProvider>
      );
    });

    expect(container.queryByText('poi-123')).toBeTruthy();
    expect(container.getByText('Hotel')).toBeTruthy();
    expect(container.getByText('-15.123')).toBeTruthy();
    expect(container.getByText('28.123')).toBeTruthy();
  });
});
