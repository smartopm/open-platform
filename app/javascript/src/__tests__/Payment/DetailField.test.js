import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import DetailField from '../../components/Payments/DetailField'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Detail Component', () => {
  it('renders correctly', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <DetailField title='Some Title' value='Some Value' />
        </MockedProvider>
      </BrowserRouter>)
    expect(container.queryByTestId('title').textContent).toContain('Some Title')
    expect(container.queryByTestId('value').textContent).toContain('Some Value')
  })
})
