/* eslint-disable */
import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { act, render } from '@testing-library/react'
import GeoMap from '../containers/GeoMap'

jest.mock('react-leaflet')
jest.mock('leaflet.markercluster')
describe('GeoMap', () => {
  it('should mount component correctly', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
        <BrowserRouter>
          <GeoMap />
        </BrowserRouter>
      </MockedProvider>
      )
    })

    expect(container.queryByTestId('leaflet-map-container')).toBeTruthy()
  });
});