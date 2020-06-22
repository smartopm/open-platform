import React from 'react'
import Campaign from '../components/CampaignList'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import { MockedProvider } from '@apollo/react-testing'

describe('Campaign List page', () => {

  it('should render without error', () => {
    const { getByText } = render(
      <MockedProvider>
        <BrowserRouter>
          <Campaign />
        </BrowserRouter>
      </MockedProvider>
    )
  })
})
