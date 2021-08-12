import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import { act, render } from '@testing-library/react'
import LandParcelLegendContent, { HouselLegendContent } from '../../components/Map/LandParcelLegendContent'

describe('<LandParcelLegendContent />', () => {

  it('should render Land Property Legend Content', async () => {
    
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
    expect(container.queryByText(/unknown/i)).toBeTruthy()
  })

  it('should render House Legend Content', async () => {
    
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <HouselLegendContent />
          </BrowserRouter>
        </MockedProvider>
      )
    })

    expect(container.queryByText(/legend/i)).toBeTruthy()
  })

  it('should display house statuses', async () => {
    
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <HouselLegendContent />
          </BrowserRouter>
        </MockedProvider>
      )
    })

    expect(container.queryByText('misc.planned')).toBeTruthy()
    expect(container.queryByText('misc.in_construction')).toBeTruthy()
    expect(container.queryByText('misc.built')).toBeTruthy()
  })
})
