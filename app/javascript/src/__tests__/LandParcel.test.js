import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import LandParcel from '../components/LandParcels/LandParcel'
import { ParcelQuery } from '../graphql/queries'

describe('It should test the comment component', () => {
  const mockData = {
    request: {
      query: ParcelQuery,
      variables: {
        limit: 20,
        offset: 0
      } 
    },
    result: {
      data: {
        fetchLandParcel: [
          {
            id: 'dcwwe',
            parcelNumber: "1234",
            address1: 'iwed',
            address2: 'efc',
            city: 'lagos',
            postalCode: '1234',
            stateProvince: 'lagos',
            country: 'nigeria',
            parcelType: 'land',
            createdAt: "2020-11-13T10:53:16Z"
          }
        ]
      }
    }
  }

  it('it should render with no error', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider mock={mockData} addTypename={false}>
          <LandParcel />
        </MockedProvider>
      </BrowserRouter>
    )

    expect( container.queryByText('Parcel Number')).toBeInTheDocument()
  });
});