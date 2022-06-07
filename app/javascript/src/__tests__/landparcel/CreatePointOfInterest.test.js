/* eslint-disable react/jsx-no-undef */
import React from 'react'
import ReactTestUtils from 'react-dom/test-utils';
import { render, waitFor, screen } from '@testing-library/react'
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
        ReactTestUtils.Simulate.click(newPoiButton)

        const poiName = screen.getByTestId('poi-name')
        ReactTestUtils.Simulate.change(poiName, { target: { value: 'Hotel' } })
        expect(poiName.value).toBe('Hotel')
        
        const poiDescription = screen.getByTestId('poi-description')
        ReactTestUtils.Simulate.change(poiDescription, { target: { value: 'Hotel Description' } })
        expect(poiDescription.value).toBe('Hotel Description')

        const GeoLongitudeX = screen.queryByTestId('long_x')
        ReactTestUtils.Simulate.change(GeoLongitudeX, { target: { value: '28.535' } })
        expect(GeoLongitudeX.value).toBe('28.535')
    
        const GeoLatitudeY = screen.queryByTestId('lat_y')
        ReactTestUtils.Simulate.change(GeoLatitudeY, { target: { value: '-15.255' } })
        expect(GeoLatitudeY.value).toBe('-15.255')
  
        expect(newPoiButton).toBeInTheDocument()
      }, 10)
  })
})