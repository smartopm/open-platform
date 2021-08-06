/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { act, render } from '@testing-library/react'
import { AuthStateProvider } from '../../containers/Provider/AuthStateProvider';
import PointOfInterestDrawerDialog from '../../components/Map/PointOfInterestDrawerDialog'

describe('PointOfInterestDrawerDialog', () => {
  it('should mount component correctly', async () => {
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
        latY: -15.123,
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

    expect(container.queryByText('poi-123')).toBeTruthy()
    expect(container.getByText('Hotel')).toBeTruthy()
    expect(container.getByText('-15.123')).toBeTruthy()
    expect(container.getByText('28.123')).toBeTruthy()
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

    expect(container.queryByText(('property:misc.no_details'))).toBeTruthy()
  });

  it('should close dialog', async () => {
    const props = {
      anchor: 'right',
      open: false,
      onClose: jest.fn,
      imageData: { url: '', loading: false },
      selectedPoi: {
        poiName: 'Hotel',
        parcelNumber: 'poi-123',
        parcelType: 'poi',
        longX: 28.123,
        latY: -15.123,
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