import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import { act, render } from '@testing-library/react'
import LandParcelLegend from '../components/Map/LandParcelLegend'

describe('<LandParcelLegend />', () => {
  it('should render Land Parcel', async () => {
    
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <LandParcelLegend />
          </BrowserRouter>
        </MockedProvider>
      )
    })
    expect(container).toMatchSnapshot()
  })
})
