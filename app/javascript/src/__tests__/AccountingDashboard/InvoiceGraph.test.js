import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { TransactionsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import InvoiceGraph from '../../components/Accounting/InvoiceGraph';

describe('Invoice Graph Component', () => {
  const invoiceAccountingStats = [
    {
      noOfDays: '10-20',
      noOfInvoices: 20
    },
    {
      noOfDays: '21-30',
      noOfInvoices: 40
    }
  ];
  it('should render the invoice graph component', async () => {
    const mock = [
      {
        request: {
          query: TransactionsQuery,
          variables: { limit: 50, offset: 0, query: '' }
        },
        result: {
          data: {
            invoiceAccountingStats
          }
        }
      }
    ];

    const container = render(
      <MockedProvider mocks={mock} addTypename={false}>
        <BrowserRouter>
          <InvoiceGraph />
        </BrowserRouter>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByText('Invoicing Dashboard')).toBeInTheDocument()
      },
      { timeout: 100 }
    );
  });
});
