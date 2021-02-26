import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { PaymentStats } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import PaymentGraph from '../../components/Payments/PaymentGraph';

describe('Payment Graph Component', () => {
  const paymentAccountingStats = [
    {
      tnxDate: '2020-10-10',
      cash: 20,
      mobileMoney: 30,
      bankTransfer: 10,
      eft: 50,
      pos: 49
    },
    {
      tnxDate: '2020-10-10',
      cash: 30,
      mobileMoney: 20,
      bankTransfer: 10,
      eft: 50,
      pos: 49
    }
  ];
  it('should render the payment graph component', async () => {
    const mock = [
      {
        request: {
          query: PaymentStats
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
          <PaymentGraph currency='k' />
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
