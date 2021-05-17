import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import TransactionDetails from '../../modules/Payments/Components/TransactionDetails';
import { Spinner } from '../../shared/Loading';
import currency from '../../__mocks__/currency';
import { AllEventLogsQuery } from '../../graphql/queries';

describe('Transaction Details Component', () => {
  it('should render the transaction details component', async () => {
    const dataMock = {
      amount: 200,
      pendingAmount: 300,
      createdAt: '2020-12-28',
      dueDate: '2020-12-28',
      invoiceNumber: '1234',
      balance: '30',
      id: '5e246346-50d8-4c1f-9b90'
    };

    const mock = [
      {
        request: {
          query: AllEventLogsQuery,
          variables: {
            subject: ['payment_update'],
            refId: '5e246346-50d8-4c1f-9b90',
            refType: 'WalletTransaction',
          }
        },
        result: {
          data: {
            result : {
              id: "385u9432n384ujdf",
              createdAt: '2021-03-03T12:40:38Z',
              refId: '5e246346-50d8-4c1f-9b90',
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
      }
    ];

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    const container = render(
      <BrowserRouter>
        <MockedProvider mocks={mock}>
          <TransactionDetails
            data={dataMock}
            currencyData={currency}
            detailsOpen
            isEditing
            handleClose={jest.fn}
          />
        </MockedProvider>
      </BrowserRouter>
    );

    await waitFor(
      () => {
        expect(container.queryAllByTestId('text-field')[0].value).toContain('$200.00');
        expect(container.queryAllByTestId('text-field')[1].value).toContain('300');
        expect(container.queryAllByTestId('text-field')[2].value).toContain('1234');
        expect(container.queryAllByTestId('text-field')[3].value).toContain('Unpaid');
        expect(container.queryAllByTestId('text-field')[4].value).toContain('2020-12-28');
        expect(container.queryAllByTestId('text-field')[5].value).toContain('2020-12-28');
        expect(container.queryByText('common:menu.invoice')).toBeInTheDocument();
      },
      { timeout: 100 }
    );
  });
});
