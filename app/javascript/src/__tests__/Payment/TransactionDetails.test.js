import React from 'react'
import { render, waitFor, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import TransactionDetails from '../../components/Payments/TransactionDetails'
import { Spinner } from '../../shared/Loading'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Transaction Details Component', () => {
  afterEach(cleanup)
  it('should render the transaction details component', async () => {
    const dataMock = {
      amount: 200,
      status: 'in_progress',
      createdAt: '2020-12-28',
    }

    const loader = render(<Spinner />)

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument()

    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <TransactionDetails data={dataMock} currency="k" detailsOpen handleClose={jest.fn} />
        </MockedProvider>
      </BrowserRouter>)

    await waitFor(() => {
      expect(container.queryAllByTestId('text-field')[0].value).toContain('k200')
      expect(container.queryAllByTestId('text-field')[1].value).toContain('in_progress')
      expect(container.queryAllByTestId('text-field')[2].value).toContain('2020-12-28')
    },
    { timeout: 500 }
    ) 
  })
})