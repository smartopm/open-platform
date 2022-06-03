/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { act, render, waitFor, screen } from '@testing-library/react'
import { AuthStateProvider } from '../../containers/Provider/AuthStateProvider';
import PointOfInterestDrawerDialog from '../../components/Map/PointOfInterestDrawerDialog'
import MockedThemeProvider from '../../modules/__mocks__/mock_theme';

describe('PointOfInterestDrawerDialog', () => {
  it('should mount component correctly', async () => {
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
        expect(screen.getByText('poi')).toBeTruthy()
        expect(screen.getByText('poi_list.longitude_x')).toBeTruthy()
        expect(screen.getByText('-15.123')).toBeTruthy()
        expect(screen.getByText('poi_list.latitude_y')).toBeTruthy()
        expect(screen.getByText('28.123')).toBeTruthy()
    }, 10)
  });

  it('should mount component correctly and show no details when selectedPoi is null', async () => {
    const props = {
      anchor: 'right',
      open: true,
      onClose: jest.fn,
      imageData: { url: '', loading: false },
      selectedPoi: null,
    }

    let container;
    
    await act(async () => {
      container = render(
        <MockedProvider>
          <AuthStateProvider>
            <BrowserRouter>
              <PointOfInterestDrawerDialog
                {...props}
              />
            </BrowserRouter>
          </AuthStateProvider>
        </MockedProvider>
      )
    })

    expect(container.queryByText(('misc.no_details'))).toBeTruthy()
  });

  it('should close dialog', async () => {
    const props = {
      anchor: 'right',
      open: false,
      onClose: jest.fn,
      imageData: { url: '', loading: false },
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

    let container;
    
    await act(async () => {
      container = render(
        <MockedProvider>
          <AuthStateProvider>
            <BrowserRouter>
              <PointOfInterestDrawerDialog
                {...props}
              />
            </BrowserRouter>
          </AuthStateProvider>
        </MockedProvider>
      )
    })

    expect(container.queryByText('poi-123')).toBeNull()
    expect(container.queryByText('Hotel')).toBeNull()
    expect(container.queryByText('-15.123')).toBeNull()
    expect(container.queryByText('28.123')).toBeNull()
  });
});