import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import Invoices from '../../components/Payments/Invoice'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('It should test the comment component', () => {
  const userId = 'geikhwe'

  it('it should render with no error', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <Invoices userId={userId} />
        </MockedProvider>
      </BrowserRouter>
    )

    expect(container.getByTestId("parcel-address1")).toBeInTheDocument()
  });
});