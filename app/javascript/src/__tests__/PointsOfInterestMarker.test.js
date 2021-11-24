import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import { act, render } from '@testing-library/react'
import PointsOfInterestMarker from '../components/Map/PointsOfInterestMarker'

jest.mock('react-leaflet')
describe.skip('<PointsOfInterestMarker />', () => {
  const markerProps = {
      poiName: 'University',
      iconUrl: '',
      geoLongX: 28.6530035716,
      geoLatY: -15.5096758256,
      geomType: 'Polygon'
    }

  it('should render marker correctly', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <PointsOfInterestMarker markerProps={markerProps} />
          </BrowserRouter>
        </MockedProvider>
      )
    })

    expect(container).toMatchSnapshot()
  })
})
