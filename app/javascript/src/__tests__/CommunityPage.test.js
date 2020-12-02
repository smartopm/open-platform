/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom'
import  CommunityPage from '../components/Settings/CommunityPage'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
const data = {
  id: 'eujgt',
  logoUrl: 'url',
  supportEmail: {
    "sales": 'toluola@gmail.com',
    "customer_care": 'tolu@gmail.com'
  },
  supportNumber: {
    "sales": '47954',
    "customer_care": '12345'
  }
}

describe('CommentBox', () => {
  it('should render with wrong props', () => {
    const container = render(
      <BrowserRouter>
        <CommunityPage data={data} />
      </BrowserRouter>
    )

    expect(container.queryByText('Community Logo')).toBeInTheDocument()
    expect(container.queryByText('Support Contact Information')).toBeInTheDocument()
  })
})
