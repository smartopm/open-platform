import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import TransactionDetails from '../../components/Payments/TransactionDetails'
import { Spinner } from '../../shared/Loading'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())

describe('Transaction Details Component', () => {
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
      expect(container.queryByText('k200')).toBeInTheDocument();
      expect(container.queryByText('In-Progress')).toBeInTheDocument();
      expect(container.queryByText('2020-12-28')).toBeInTheDocument();
    },
    { timeout: 500 }
    ) 
  })
})