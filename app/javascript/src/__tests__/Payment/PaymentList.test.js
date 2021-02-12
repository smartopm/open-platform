import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { PaymentsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import PaymentList, { renderPayments } from '../../components/Payments/PaymentList';

describe('Payment List Item Component', () => {
  const payments = [
    {
      amount: 100,
      createdAt: '2021-01-26T20:26:39Z',
      paymentStatus: null,
      paymentType: 'cash',
      chequeNumber: null,
      bankName: null,
      id: '162f751-83a1-6d59569',
      user: {
        id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
        name: 'joe m'
      }
    },
    {
      amount: 100,
      createdAt: '2021-01-26T20:26:39Z',
      paymentStatus: null,
      paymentType: 'cash',
      chequeNumber: null,
      bankName: null,
      id: '162f751-83a1-6d59569-sdf3453sd',
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
          query: PaymentsQuery,
          variables: { limit: 50, offset: 0, query: '' }
        },
        result: {
          data: {
            payments
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
        expect(container.queryAllByTestId('payment_type')[0].textContent).toContain('cash');
        expect(container.queryAllByTestId('payment_type')[1].textContent).toContain('cash');
      },
      { timeout: 100 }
    );
  });
  it('should check if renderPayments works as expected', () => {
    const results = renderPayments(payments, 'k');
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('User');
    expect(results[0]).toHaveProperty('Deposit Date');
    expect(results[0]).toHaveProperty('PaymentType');
    expect(results[0]).toHaveProperty('Amount');
    expect(results[0]).toHaveProperty('chequeNumber');
  });
});
