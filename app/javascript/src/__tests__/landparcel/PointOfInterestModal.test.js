/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { act, render, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'

import PointOfInterestModal from '../../components/LandParcels/PointOfInterestModal'

describe('Point Of Interest Modal Component', () => {
  it('should render correctly', async () => {
    const props = {
      open: true,
      handleClose: jest.fn(),
      handleSubmit: jest.fn()
    }
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <PointOfInterestModal {...props} />
          </BrowserRouter>
        </MockedProvider>)
    })

    expect(container.getByText(('dialog_headers.new_point_of_interest'))).toBeInTheDocument()
    expect(container.queryByTestId('poi-name')).toBeInTheDocument()
    expect(container.queryByTestId('long_x')).toBeInTheDocument()
    expect(container.queryByTestId('lat_y')).toBeInTheDocument()
    expect(container.queryByTestId('icon-url')).toBeInTheDocument()

    const poiName = container.getByTestId('poi-name')
    fireEvent.change(poiName, { target: { value: 'Hotel' } })
    expect(poiName.value).toBe('Hotel')

    const GeoLongitudeX = container.queryByTestId('long_x')
    fireEvent.change(GeoLongitudeX, { target: { value: '28.535' } })
    expect(GeoLongitudeX.value).toBe('28.535')

    const GeoLatitudeY = container.queryByTestId('lat_y')
    fireEvent.change(GeoLatitudeY, { target: { value: '-15.255' } })
    expect(GeoLatitudeY.value).toBe('-15.255')
  })
})