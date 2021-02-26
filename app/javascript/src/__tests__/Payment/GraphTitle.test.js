import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BrowserRouter } from 'react-router-dom/'
import GraphTitle from '../../components/Payments/GraphTitle'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('It should test the graph title component', () => {

  it('it should render Graph Title', () => {
    const container = render(
      <BrowserRouter>
        <GraphTitle title='Heading' />
      </BrowserRouter>
    )
    expect(container.queryByText('Heading')).toBeInTheDocument()
  });
});