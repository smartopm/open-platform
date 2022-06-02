/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'

import CreatePointOfInterest from '../../components/LandParcels/CreatePointOfInterest'

describe('Create Point of Interest Component', () => {
  it('should render add new point of interest form', () => {
    const refetch = jest.fn()
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <CreatePointOfInterest refetch={refetch} />
        </BrowserRouter>
      </MockedProvider>)

      const newPoiButton = container.queryByTestId('new-poi-button')
      fireEvent.click(newPoiButton)

      const poiName = container.getByTestId('poi-name')
      fireEvent.change(poiName, { target: { value: 'Hotel' } })
      expect(poiName.value).toBe('Hotel')
  
      const GeoLongitudeX = container.queryByTestId('long_x')
      fireEvent.change(GeoLongitudeX, { target: { value: '28.535' } })
      expect(GeoLongitudeX.value).toBe('28.535')
  
      const GeoLatitudeY = container.queryByTestId('lat_y')
      fireEvent.change(GeoLatitudeY, { target: { value: '-15.255' } })
      expect(GeoLatitudeY.value).toBe('-15.255')

      expect(newPoiButton).toBeInTheDocument()
  })
})