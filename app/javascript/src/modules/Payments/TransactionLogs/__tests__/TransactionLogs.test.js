import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import TransactionLogs from '../Components/TransactionLogs';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../__mocks__/authstate';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import { TransactionLogsQuery } from '../graphql/transaction_logs_query';

describe('PaymentForm', () => {
  const mocks = [
    {
      request: {
        query: TransactionLogsQuery,
        variables: { offset: 0, limit: 10, },
      },
      result: {
        data: {
          transactionLogs: [
            {
              id: '8r3u4jnrwiff',
              paidAmount: 100,
              currency: 'KES',
              invoiceNumber: 'hiuk734i',
              transactionRef: '9842',
              transactionId: 'njiweuw',
              amount: 100,
              description: 'uikwjfebw',
              accountName: 'samplename',
              integrationType: 'hsdf',
              createdAt: '2022-10-10',
              user: {
                id: 'ejwkd29',
                name: 'ujyfw43r',
              },
            },
          ],
        },
      },
    },
  ];
  it('should render the payment form', async () => {
    const container = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Context.Provider value={userMock}>
          <MockedThemeProvider>
            <BrowserRouter>
              <TransactionLogs />
            </BrowserRouter>
          </MockedThemeProvider>
        </Context.Provider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(container.queryByTestId('container')).toBeInTheDocument();
      expect(container.queryByTestId('amount')).toBeInTheDocument();
      expect(container.queryByTestId('icon')).toBeInTheDocument();

      fireEvent.click(container.queryByTestId('icon'))
      expect(container.queryByTestId('invoice')).toBeInTheDocument();
      expect(container.queryByTestId('transaction')).toBeInTheDocument();
      expect(container.queryByTestId('description')).toBeInTheDocument();
    }, 500);
  });
});
