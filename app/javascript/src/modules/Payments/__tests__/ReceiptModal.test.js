import React from 'react';
import { render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import ReceiptModal from '../Components/UserTransactions/ReceiptModal';
import currency from '../../../__mocks__/currency';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('@rails/activestorage/src/file_checksum', () => jest.fn());
describe('It should test the payment receipt modal component', () => {
  const paymentData = {
    amount: 1000,
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

  it('should render payment receipt modal', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <MockedThemeProvider>
            <ReceiptModal
              open={open}
              paymentData={paymentData}
              userData={userData}
              handleClose={handleModalClose}
              currencyData={currency}
            />
          </MockedThemeProvider>
        </MockedProvider>
      </BrowserRouter>
    );
    expect(container.getByTestId('continue')).toBeInTheDocument();
  });
});
