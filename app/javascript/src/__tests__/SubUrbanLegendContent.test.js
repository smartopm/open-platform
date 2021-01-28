import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import { act, render } from '@testing-library/react'
import SubUrbanLegendContent from '../components/Map/SubUrbanLegendContent'

describe('<SubUrbanLegendContent />', () => {
  it('should render SubUrbanLegendContent', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <SubUrbanLegendContent />
          </BrowserRouter>
        </MockedProvider>
      )
    })
    expect(container).toMatchSnapshot()
  })
})
