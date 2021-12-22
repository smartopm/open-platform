import React from 'react'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom'
import { act, render } from '@testing-library/react'
import SubUrbanLayer from '../../components/Map/SubUrbanLayer'

describe('<SubUrbanLayer />', () => {
  it('should render SubUrbanLayer', async () => {
    let container;
    await act(async () => {
      container = render(
        <MockedProvider>
          <BrowserRouter>
            <SubUrbanLayer data={{}} />
          </BrowserRouter>
        </MockedProvider>
      )
    })
    expect(container).toMatchSnapshot()
  })
})
