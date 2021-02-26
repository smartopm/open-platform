import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import DetailHeading from '../../components/Payments/DetailHeading'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('It should test the detail heading component', () => {

  it('it should render detail heading', () => {
    const container = render(
      <BrowserRouter>
        <DetailHeading title='Heading' />
      </BrowserRouter>
    )
    expect(container.queryByText('Heading')).toBeInTheDocument()
  });
});