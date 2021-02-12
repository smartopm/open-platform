import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { MockedProvider } from '@apollo/react-testing'
import { BrowserRouter } from 'react-router-dom/'
import PaymentReceipt from '../../components/Payments/PaymentReceipt'

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn())
describe('It should test the payment receipt modal component', () => {
  const paymentData =
      {
        amount: '1000',
        source: 'cash',
        currentWalletBalance: 100,
        user: {
          name: 'some name'
        }
      }

  const userData = {
    name: 'some name 2',
    transactionNumber: 1234
  }

  const open = true

  const handleModalClose = jest.fn()

  it('it should render payment receipt modal', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <PaymentReceipt open={open} paymentData={paymentData} userData={userData} handleClose={handleModalClose} currency='k' />
        </MockedProvider>
      </BrowserRouter>
    )
    
    expect(container.queryByText('some name')).toBeInTheDocument()
    expect(container.getByTestId('nkwashi')).toBeInTheDocument()
    expect(container.queryByText('cash')).toBeInTheDocument()
    expect(container.queryByText('1000')).toBeInTheDocument()
  });
});