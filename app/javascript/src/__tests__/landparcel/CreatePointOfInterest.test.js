/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import MockedThemeProvider from '../../modules/__mocks__/mock_theme'
import CreatePointOfInterest from '../../components/LandParcels/CreatePointOfInterest'

describe('Create Point of Interest Component', () => {
  it('should render new poi button', async () => {
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
      }, 10)
  })

  it('should render dialog when new poi button is clicked', async () => {
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
        const newPoiButton = screen.queryByTestId('new-poi-button')
        fireEvent.click(newPoiButton)

        expect(screen.queryByTestId('dialog')).toBeInTheDocument()
        expect(screen.getAllByText('dialog_headers.new_point_of_interest')[0]).toBeInTheDocument()
        expect(screen.getAllByText('form_fields.poi_name')[0]).toBeInTheDocument()
        expect(screen.queryByTestId('poi-name')).toBeInTheDocument()
        expect(screen.getAllByText('form_fields.poi_description')[0]).toBeInTheDocument()
        expect(screen.queryByTestId('poi-description')).toBeInTheDocument()
        expect(screen.getAllByText('form_fields.geo_long_x')[0]).toBeInTheDocument()
        expect(screen.queryByTestId('long_x')).toBeInTheDocument()
        expect(screen.getAllByText('form_fields.geo_lat_y')[0]).toBeInTheDocument()
        expect(screen.queryByTestId('lat_y')).toBeInTheDocument()
        expect(screen.queryByTestId('poi-video-url')).toBeInTheDocument()
        expect(screen.getAllByText('form_actions.add_type')[0]).toBeInTheDocument()
        expect(screen.queryByTestId('add_type')).toBeInTheDocument()
        expect(screen.queryByTestId('upload-image-url')).toBeInTheDocument()
        expect(screen.getAllByText('form_fields.upload_image_url')[0]).toBeInTheDocument()
        expect(screen.queryByTestId('upload_button')).toBeInTheDocument()
        expect(screen.getAllByText('form_fields.add_photo')[0]).toBeInTheDocument()

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
      }, 10)
  })
})