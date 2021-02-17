/* eslint-disable */
import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { act, render } from '@testing-library/react'
import LandParcelMap from '../../components/LandParcels/LandParcelMap'

jest.mock('react-leaflet')
describe('LandParcelMap', () => {
  it('should mount component correctly', async () => {
    const props = {
      handlePlotClick: jest.fn(),
      geoData:[],
    }

    let container;
    
    await act(async () => {
      container = render(
        <MockedProvider>
        <BrowserRouter>
          <LandParcelMap 
          handlePlotClick={props.handlePlotClick} 
          geoData={props.geoData}
          />
        </BrowserRouter>
      </MockedProvider>
      )
    })

    expect(container.queryByTestId('leaflet-map-container')).toBeTruthy()
  });
});