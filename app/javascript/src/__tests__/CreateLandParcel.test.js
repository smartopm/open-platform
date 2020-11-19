import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import '@testing-library/jest-dom/extend-expect'
import CreateLandParcel from '../components/LandParcels/CreateLandParcel'

describe('Label Item Component', () => {
  it('it should include the label details ', () => {
      const refetch = jest.fn()
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <CreateLandParcel refetch={refetch} />
        </BrowserRouter>
      </MockedProvider>)
      const parcelButton = container.queryByTestId('parcel-button')
      fireEvent.click(parcelButton)
      const parcelNumber = container.queryByTestId('parcel-number')
      fireEvent.change(parcelNumber, { target: { value: 'This is a parcel number' } })
      expect(parcelNumber.value).toBe('This is a parcel number')
      expect(parcelButton).toBeInTheDocument()
  })
})