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
      createdAt: '2021-01-26T20:26:39Z',
      updatedAt: '2021-01-26T20:26:39Z',
      id: '0aa61057-bec1-43f6-ad02-70c220ed56f3',
      currentWalletBalance: 200,
      status: 'settled',
      user: {
        id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
        name: 'joe m'
      }
    },
    {
      amount: 100,
      createdAt: '2021-01-26T20:26:39Z',
      updatedAt: '2021-01-26T20:26:39Z',
      id: '0aa61057-bec1-43f6-ad02-70c220ed56f3',
      currentWalletBalance: 200,
      status: 'pending',
      user: {
        id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
        name: 'joe m'
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
      },
    ];

    const container = render(
      <MockedProvider mocks={mock} addTypename={false}>
        <BrowserRouter>
          <PaymentList currency='k' />
        </BrowserRouter>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryAllByTestId('created_by')[0].textContent).toContain('joe');
        expect(container.queryAllByTestId('payment_status')[0].textContent).toContain('Settled');
        expect(container.queryAllByTestId('payment_status')[1].textContent).toContain('Pending');
      },
      { timeout: 100 }
    );
  });
  it('should check if renderPayments works as expected', () => {
    const results = renderPayments(transactions, 'k');
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('Amount');
    expect(results[0]).toHaveProperty('Paid date');
    expect(results[0]).toHaveProperty('Balance');
    expect(results[0]).toHaveProperty('Status');
    expect(results[0]).toHaveProperty('CreatedBy');
  });
});
