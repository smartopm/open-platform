import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { AllEventLogsQuery, TransactionsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import PaymentList, { renderPayment } from '../../components/Payments/PaymentList';
import currency from '../../__mocks__/currency';

describe('Payment List Item Component', () => {
  const transactions = [
    {
      amount: 100,
      status: 'settled',
      createdAt: '2021-01-26T20:26:39Z',
      updatedAt: '2021-01-26T20:26:39Z',
      destination: 'wallet',
      source: 'cash',
      currentWalletBalance: 0,
      id: '162f751-83a1-6d59569',
      user: {
        id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
        name: 'joe m',
        imageUrl: 'tolu.jpg'
      }
    },
    {
      amount: 200,
      status: 'settled',
      createdAt: '2021-03-01T09:55:05Z',
      updatedAt: '2021-03-01T09:55:05Z',
      destination: 'invoice',
      source: 'cash',
      currentWalletBalance: 0,
      id: '3b464fb7-bb2b-41cb-9245-9300b6d8a729',
      user: {
        id: 'a54d6184-b10e-4865-bee7-7957701d423d',
        name: 'Another somebodyy',
        imageUrl: null
      },
    }
  ];
  it('should render the invoice item component', async () => {
    const mock = {
      request: {
        query: TransactionsQuery,
        variables: { limit: 50, offset: 0, query: '' }
      },
      result: {
        data: {
          transactions
        }
      }
    };
    const anotherMock = {
      request: {
        query: AllEventLogsQuery,
        variables: {
          subject: ['payment_update'],
          refId: '162f751-83a1-6d59569',
          refType: 'WalletTransaction'
        }
      },
      result: {
        data: {
          result: {
            id: '385u9432n384ujdf',
            createdAt: '2021-03-03T12:40:38Z',
            refId: '162f751-83a1-6d59569',
            refType: 'WalletTransaction',
            subject: 'payment_update',
            sentence: 'Joe made changes to this payment',
            data: {},
            actingUser: {
              name: 'Joe',
              id: '162f7517-7cc8-42f9-b2d0-a83a16d59569'
            },
            entryRequest: null
          }
        }
      }
    };

    const container = render(
      <MockedProvider mocks={[mock, anotherMock]} addTypename={false}>
        <BrowserRouter>
          <PaymentList currencyData={currency} />
        </BrowserRouter>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryAllByTestId('created_by')[0].textContent).toContain('joe');
        expect(container.queryAllByTestId('payment_type')[0].textContent).toContain('Cash');
        expect(container.queryAllByTestId('payment_type')).toHaveLength(1)
        expect(container.queryAllByTestId('payment_amount')).toHaveLength(1)
      },
      { timeout: 100 }
    );
  });
  it('should check if renderPayment works as expected', () => {
    const results = renderPayment(transactions[0], currency);
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('User');
    expect(results[0]).toHaveProperty('Deposit Date');
    expect(results[0]).toHaveProperty('Payment Type');
    expect(results[0]).toHaveProperty('Amount');
  });
});
