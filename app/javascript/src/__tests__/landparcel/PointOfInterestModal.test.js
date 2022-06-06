/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import MockedThemeProvider from '../../modules/__mocks__/mock_theme'
import PointOfInterestModal from '../../components/LandParcels/PointOfInterestModal'

describe('Point Of Interest Modal Component', () => {
  it('should render correctly', async () => {
    const props = {
      open: true,
      handleClose: jest.fn(),
      handleSubmit: jest.fn()
    }
    render(
      <MockedProvider>
        <BrowserRouter>
          <MockedThemeProvider>
            <PointOfInterestModal {...props} />
          </MockedThemeProvider>
        </BrowserRouter>
      </MockedProvider>
    )

    await waitFor(() => {
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

      const poiName = screen.getByTestId('poi-name')
      fireEvent.change(poiName, { target: { value: 'Hotel' } })
      expect(poiName.value).toBe('Hotel')

      const poiDescription = screen.getByTestId('poi-description')
      fireEvent.change(poiDescription, { target: { value: 'Hotel description' } })
      expect(poiDescription.value).toBe('Hotel description')
  
      const GeoLongitudeX = screen.queryByTestId('long_x')
      fireEvent.change(GeoLongitudeX, { target: { value: '28.535' } })
      expect(GeoLongitudeX.value).toBe('28.535')
  
      const GeoLatitudeY = screen.queryByTestId('lat_y')
      fireEvent.change(GeoLatitudeY, { target: { value: '-15.255' } })
      expect(GeoLatitudeY.value).toBe('-15.255')
    }, 10)

  })
})