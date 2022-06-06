/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import MockedThemeProvider from '../../modules/__mocks__/mock_theme'
import CreatePointOfInterest from '../../components/LandParcels/CreatePointOfInterest'

describe('Create Point of Interest Component', () => {
  it('should render add new point of interest form', async () => {
    const refetch = jest.fn()
    render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <CreatePointOfInterest refetch={refetch} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>)

      await waitFor(() => {
        expect(screen.queryByTestId('new-poi-button')).toBeInTheDocument()
        expect(screen.getByText('buttons.new_point_of_interest')).toBeInTheDocument()
        
        const newPoiButton = screen.queryByTestId('new-poi-button')
        fireEvent.click(newPoiButton)

        const poiName = screen.getByTestId('poi-name')
        fireEvent.change(poiName, { target: { value: 'Hotel' } })
        expect(poiName.value).toBe('Hotel')
        
        const poiDescription = screen.getByTestId('poi-description')
        fireEvent.change(poiDescription, { target: { value: 'Hotel Description' } })
        expect(poiDescription.value).toBe('Hotel Description')

        const GeoLongitudeX = screen.queryByTestId('long_x')
        fireEvent.change(GeoLongitudeX, { target: { value: '28.535' } })
        expect(GeoLongitudeX.value).toBe('28.535')
    
        const GeoLatitudeY = screen.queryByTestId('lat_y')
        fireEvent.change(GeoLatitudeY, { target: { value: '-15.255' } })
        expect(GeoLatitudeY.value).toBe('-15.255')
  
        expect(newPoiButton).toBeInTheDocument()
      }, 10)
  })
})