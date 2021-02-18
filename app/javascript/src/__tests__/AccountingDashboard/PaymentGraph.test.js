import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { TransactionsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import PaymentGraph from '../../components/Accounting/PaymentGraph';

describe('Payment Graph Component', () => {
  const paymentAccountingStats = [
    {
      noOfDays: '10-20',
      cash: 20,
      mobileMoney: 30
    },
    {
      noOfDays: '21-30',
      cash: 30,
      mobileMoney: 20
    }
  ];
  it('should render the payment graph component', async () => {
    const mock = [
      {
        request: {
          query: TransactionsQuery,
          variables: { limit: 50, offset: 0, query: '' }
        },
        result: {
          data: {
            paymentAccountingStats
          }
        }
      }
    ];

    const container = render(
      <MockedProvider mocks={mock} addTypename={false}>
        <BrowserRouter>
          <PaymentGraph />
        </BrowserRouter>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByText('Payment Dashboard')).toBeInTheDocument()
      },
      { timeout: 100 }
    );
  });
});
