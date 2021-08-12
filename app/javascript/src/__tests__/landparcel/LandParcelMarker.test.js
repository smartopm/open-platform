import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import { act, render } from '@testing-library/react'
import LandParcelMarker from '../../components/Map/LandParcelMarker'

describe('<LandParcelMarker />', () => {
  const markerProps = {
      parcelNumber: '1234',
      parcelType: 'basic',
      geoLongX: 28.6530035716,
      geoLatY: -15.5096758256,
    }
  
  it('should render marker correctly', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <LandParcelMarker markerProps={markerProps} />
          </BrowserRouter>
        </MockedProvider>
      )
    })

    expect(container.queryByText(/basic/i)).toBeTruthy()
    expect(container.queryByText(/1234/)).toBeTruthy()
    expect(container.queryByText(/28/)).toBeTruthy()
    expect(container.queryByText(/-15/)).toBeTruthy()
  })

   
  it('should render marker correctly for houses', async () => {
    const houseMarkerProps = {
      parcelNumber: 'House1234',
      geoLongX: 28.6530035716,
      geoLatY: -15.5096758256,
      status: 'Planned'
    }

    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <LandParcelMarker markerProps={houseMarkerProps} category="house"/>
          </BrowserRouter>
        </MockedProvider>
      )
    })

    expect(container.queryByText(/Planned/i)).toBeTruthy()
    expect(container.queryByText(/House1234/)).toBeTruthy()
    expect(container.queryByText(/28/)).toBeTruthy()
    expect(container.queryByText(/-15/)).toBeTruthy()
  })
})
