import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { TransactionsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import PaymentList, { renderPayments } from '../../components/Payments/PaymentList';

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
    }
  ];
  it('should render the invoice item component', async () => {
    const mock = [
      {
        request: {
          query: TransactionsQuery,
          variables: { limit: 50, offset: 0, query: '' }
        },
        result: {
          data: {
            transactions
          }
        }
      }
    ];

    const container = render(
      <MockedProvider mocks={mock} addTypename={false}>
        <BrowserRouter>
          <PaymentList currency="k" />
        </BrowserRouter>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryAllByTestId('created_by')[0].textContent).toContain('joe');
        expect(container.queryAllByTestId('payment_type')[0].textContent).toContain('Cash');
        expect(container.queryAllByTestId('payment_type')[1].textContent).toContain('Cash');
      },
      { timeout: 100 }
    );
  });
  it('should check if renderPayments works as expected', () => {
    const results = renderPayments(transactions, 'k');
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('User');
    expect(results[0]).toHaveProperty('Deposit Date');
    expect(results[0]).toHaveProperty('Payment Type');
    expect(results[0]).toHaveProperty('Amount');
  });
});
