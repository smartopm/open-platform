import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import { act, render } from '@testing-library/react'
import LandParcelLegendContent from '../components/Map/LandParcelLegendContent'

describe('<LandParcelLegendContent />', () => {

  it('should render Land Parcel Legend Content', async () => {
    
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
    expect(container.queryByText(/nkwashi/i)).toBeTruthy()
  })
  it('should display plot statuses', async () => {
    
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

    expect(container.queryByText(/sold/i)).toBeTruthy()
    expect(container.queryByText(/available/i)).toBeTruthy()
  })
})
