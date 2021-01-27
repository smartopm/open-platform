import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import { act, render } from '@testing-library/react'
import LandParcelLegendContent from '../components/Map/LandParcelLegendContent'

describe('<LandParcelLegend />', () => {
  
  it('should render Land Parcel Legend', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <LandParcelLegendContent />
          </BrowserRouter>
        </MockedProvider>
      )
    })

    expect(container.queryByText(/legend/i)).toBeTruthy()
  })
})
