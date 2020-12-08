import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { MockedProvider } from '@apollo/react-testing'
import LandParcel from '../containers/LandParcels/LandParcel'
import '@testing-library/jest-dom/extend-expect'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('Land Parcel Page', () => {
  it('renders land parcel page', async () => {
    const container = render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <LandParcel />
        </BrowserRouter>
      </MockedProvider>
    )

    expect(container.queryByText('Parcels and Properties')).toBeInTheDocument()
  })
})
