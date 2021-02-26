import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { InvoicesStats } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import InvoiceGraph from '../../components/Payments/InvoiceGraph';

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
          query: InvoicesStats
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
          <InvoiceGraph currency='k' />
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
