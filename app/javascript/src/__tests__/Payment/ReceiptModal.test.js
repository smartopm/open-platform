import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import ReceiptModal from '../../modules/Payments/Components/ReceiptModal';
import currency from '../../__mocks__/currency';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('It should test the payment receipt modal component', () => {
  const paymentData = {
    amount: '1000',
    source: 'cash',
    currentWalletBalance: 100,
    user: {
      name: 'some name'
    }
  };

  const userData = {
    name: 'some name',
    transactionNumber: 1234
  };

  const open = true;

  const handleModalClose = jest.fn;

  it('it should render payment receipt modal', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <ReceiptModal
            open={open}
            paymentData={paymentData}
            userData={userData}
            handleClose={handleModalClose}
            currencyData={currency}
          />
        </MockedProvider>
      </BrowserRouter>
    );

    // expect(container.getByTestId('print')).toBeInTheDocument();
    expect(container.getByTestId('continue')).toBeInTheDocument();
  });
});
