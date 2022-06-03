/* eslint-disable */
import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import { render, screen, waitFor } from '@testing-library/react'
import GeoMap from '../containers/GeoMap'
import { CurrentCommunityQuery } from '../modules/Community/graphql/community_query'

jest.mock('react-leaflet')
jest.mock('leaflet.markercluster')
describe('GeoMap', () => {
  const mocks = [
    {
      request: {
        query: CurrentCommunityQuery,
        variables: {}
      },
      result: {
        currentCommunity: {
          name: 'Nkwashi'
        }
      }
    },
  ];

  it('should mount component correctly', async () => {
     render(
        <MockedProvider mocks={mocks} addTypename>
        <BrowserRouter>
          <GeoMap />
        </BrowserRouter>
      </MockedProvider>
      )

    await waitFor(() => {
      screen.debug(undefined, 20000)
      expect(container.queryByTestId('leaflet-map-container')).toBeTruthy()
    }, 10)
  });
});