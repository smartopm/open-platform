/* eslint-disable react/jsx-no-undef */
import React from 'react'
import ReactTestUtils from 'react-dom/test-utils';
import { render, screen, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import MockedThemeProvider from '../../modules/__mocks__/mock_theme'
import PointOfInterestModal from '../../components/LandParcels/PointOfInterestModal'

describe('Point Of Interest Modal Component', () => {
  it('should render as create dialog', async () => {
    const props = {
      open: true,
      isSubmitting: false,
      selectedPoi: null,
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
      expect(screen.queryByTestId('upload-image-url')).toBeInTheDocument()
      expect(screen.getAllByText('form_fields.upload_image_url')[0]).toBeInTheDocument()
      expect(screen.queryByTestId('upload_button')).toBeInTheDocument()
      expect(screen.getAllByText('form_fields.add_photo')[0]).toBeInTheDocument()

      const poiName = screen.getByTestId('poi-name')
      ReactTestUtils.Simulate.change(poiName, { target: { value: 'Hotel' } })
      expect(poiName.value).toBe('Hotel')

      const poiDescription = screen.getByTestId('poi-description')
      ReactTestUtils.Simulate.change(poiDescription, { target: { value: 'Hotel description' } })
      expect(poiDescription.value).toBe('Hotel description')
  
      const GeoLongitudeX = screen.queryByTestId('long_x')
      ReactTestUtils.Simulate.change(GeoLongitudeX, { target: { value: '28.535' } })
      expect(GeoLongitudeX.value).toBe('28.535')
  
      const GeoLatitudeY = screen.queryByTestId('lat_y')
      ReactTestUtils.Simulate.change(GeoLatitudeY, { target: { value: '-15.255' } })
      expect(GeoLatitudeY.value).toBe('-15.255')
    }, 10)

  })

  it('should render as edit dialog', async () => {
    const props = {
      open: true,
      title: 'Edit Point of Interest',
      editMode: true,
      isSubmitting: false,
      selectedPoi: {
        id: '123',
        icon: null,
        poiName: 'Lorem',
        description: 'Lorem Ispum',
        parcelNumber: 'poi-123',
        parcelType: 'poi',
        longX: 28.32,
        latY: -15.23,
        imageUrls: ['https://example.com/apple.jpg'],
        videoUrls: ['https://youtube.com/embed/12345']
      },
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
      expect(screen.queryByTestId('customDialog')).toBeInTheDocument()
      expect(screen.queryByTestId('customDialog').textContent).toEqual(props.title)
      expect(screen.queryByTestId('dialog')).toBeInTheDocument()
      expect(screen.getAllByText('form_fields.poi_name')[0]).toBeInTheDocument()
      expect(screen.queryByTestId('poi-name')).toBeInTheDocument()
      expect(screen.queryByTestId('poi-name').value).toEqual(props.selectedPoi.poiName)
      expect(screen.getAllByText('form_fields.poi_description')[0]).toBeInTheDocument()
      expect(screen.queryByTestId('poi-description')).toBeInTheDocument()
      expect(screen.queryByTestId('poi-description').textContent).toEqual(props.selectedPoi.description)
      expect(screen.getAllByText('form_fields.geo_long_x')[0]).toBeInTheDocument()
      expect(screen.queryByTestId('long_x')).toBeInTheDocument()
      expect(screen.queryByTestId('long_x').value).toEqual(props.selectedPoi.longX.toString())
      expect(screen.getAllByText('form_fields.geo_lat_y')[0]).toBeInTheDocument()
      expect(screen.queryByTestId('lat_y')).toBeInTheDocument()
      expect(screen.queryByTestId('lat_y').value).toEqual(props.selectedPoi.latY.toString())
      expect(screen.queryByTestId('edit-poi-video-url')).toBeInTheDocument()
      expect(screen.queryByTestId('option-text-field')).toBeInTheDocument()
      expect(screen.queryByTestId('option-input-field').value).toEqual(props.selectedPoi.videoUrls[0])
      expect(screen.getAllByText('misc.option_with_count')[0]).toBeInTheDocument()
      expect(screen.queryByTestId('remove-option-btn')).toBeInTheDocument()
      expect(screen.queryByTestId('DeleteOutlineIcon')).toBeInTheDocument()
      expect(screen.queryByTestId('poi-video-url')).toBeInTheDocument()
      expect(screen.getAllByText('form_actions.add_type')[0]).toBeInTheDocument()
      expect(screen.queryByTestId('add_type')).toBeInTheDocument()
      expect(screen.queryByTestId('upload-image-url')).toBeInTheDocument()
      expect(screen.getAllByText('form_fields.upload_image_url')[0]).toBeInTheDocument()
      expect(screen.queryByTestId('upload_button')).toBeInTheDocument()
      expect(screen.getAllByText('form_fields.add_photo')[0]).toBeInTheDocument()
      expect(screen.queryByTestId('upload_preview')).toBeInTheDocument()
      expect(screen.queryByTestId('image_close')).toBeInTheDocument()
      expect(screen.queryByTestId('CloseIcon')).toBeInTheDocument()
      expect(screen.queryByTestId('authenticated_image')).toBeInTheDocument()
      expect(screen.queryByTestId('authenticated_image').src).toEqual(props.selectedPoi.imageUrls[0])
      expect(screen.queryByTestId('dialog_cancel')).toBeInTheDocument()
      expect(screen.getAllByText('common:form_actions.cancel')[0]).toBeInTheDocument()
      expect(screen.queryByTestId('custom-dialog-button')).toBeInTheDocument()
      expect(screen.queryByTestId('custom-dialog-button').textContent).toEqual('Save')

      const saveBtn = screen.queryByTestId('custom-dialog-button')
      ReactTestUtils.Simulate.click(saveBtn)
      expect(props.handleSubmit).toHaveBeenCalled();
    }, 10)

  })
})