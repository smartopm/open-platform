/* eslint-disable */
import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { act, render, screen, waitFor } from '@testing-library/react';
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

      render(
        <MockedProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <LandParcelMap handlePlotClick={props.handlePlotClick} geoData={props.geoData} />
            </MockedThemeProvider>
          </BrowserRouter>
        </MockedProvider>
      );

    await waitFor(() => {
      expect(screen.queryByTestId('leaflet-map-container')).toBeInTheDocument()
    }, 10)
  });

  it('should mount drawer component correctly', async () => {
    const props = {
      anchor: 'right',
      open: true,
      onClose: jest.fn,
      imageData: { urls: [], loading: false },
      selectedPoi: {
        poiName: 'Hotel',
        description: 'Hotel Description',
        parcelNumber: 'poi-123',
        parcelType: 'poi',
        longX: 28.123,
        latY: -15.123,
        videoUrls: [],
      }
    }

    render(
      <MockedProvider>
        <AuthStateProvider>
          <BrowserRouter>
            <MockedThemeProvider>
              <PointOfInterestDrawerDialog
                {...props}
              />
            </MockedThemeProvider>
          </BrowserRouter>
        </AuthStateProvider>
      </MockedProvider>
      )

    await waitFor(() => {
      expect(screen.queryByTestId('poi-drawer')).toBeTruthy()
      expect(screen.queryByTestId('carousel-container')).toBeTruthy()
      expect(screen.getByText('Hotel')).toBeTruthy()
      expect(screen.getByText('Hotel Description')).toBeTruthy()
      expect(screen.getByText('dialog_headers.details')).toBeTruthy()
      expect(screen.getByText('poi_list.type')).toBeTruthy()
      expect(screen.getByText('Point of Interest')).toBeTruthy()
      expect(screen.getByText('poi_list.longitude_x')).toBeTruthy()
      expect(screen.getByText('-15.123')).toBeTruthy()
      expect(screen.getByText('poi_list.latitude_y')).toBeTruthy()
      expect(screen.getByText('28.123')).toBeTruthy()
    }, 10)
  });
});
