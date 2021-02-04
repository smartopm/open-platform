import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { InvoicesQuery, InvoiceStatsQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import InvoiceList, { renderInvoices } from '../../components/Payments/InvoiceList';

describe('Invoice Item Component', () => {
  const invoices = [
    {
      id: '299191a9-dece-4ea5-96a2-1e50424fa38a',
      amount: 23423423,
      status: 'in_progress',
      description: 'Final Payment',
      invoiceNumber: '123',
      dueDate: '2020-12-31T14:26:00Z',
      createdAt: '2020-12-28T22:00:00Z',
      updatedAt: '2020-12-28T22:00:00Z',
      pendingAmount: 0,
      user: {
        id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
        name: 'joe'
      },
      landParcel: {
        id: '233b1634-bf08-4ece-a213-b3f120a1e009',
        parcelNumber: 'Plot-1343'
      },
      payments: [
        {
          id: '2d00802e-8f65-4643-b25c-ede2c0d51fe5',
          createdAt: '2021-02-02T10:13:21Z',
          amount: 1000
        }
      ]
    },
    {
      id: '19f57fc2-610c-49b8-bc16-1dc239015b58',
      amount: 30,
      status: 'paid',
      description: 'Extra payment',
      invoiceNumber: '123',
      dueDate: '2020-12-28T22:00:00Z',
      createdAt: '2020-12-28T22:00:00Z',
      updatedAt: '2020-12-28T22:00:00Z',
      pendingAmount: 0,
      user: {
        id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
        name: 'joe'
      },
      landParcel: {
        id: '50da896a-9217-43b9-a28f-03a13c7d401f',
        parcelNumber: 'Starter-200'
      },
      payments: [
        {
          id: '2d003402e-8f65-4643-b25c-ede2c0d51fe5',
          createdAt: '2021-02-02T10:13:21Z',
          amount: 1000
        }
      ]
    }
  ];
  it('should render the invoice item component', async () => {
    const invoiceMock = [
      {
        request: {
          query: InvoicesQuery,
          variables: { status: null, limit: 50, offset: 0, query: '' }
        },
        result: {
          data: {
            invoices
          }
        }
      },
      {
        request: {
          query: InvoiceStatsQuery
        },
        result: {
          data: {
            invoiceStats: {
              late: 0,
              paid: 5,
              inProgress: 6,
              cancelled: 2
            }
          }
        }
      }
    ];

    const container = render(
      <MockedProvider mocks={invoiceMock} addTypename={false}>
        <BrowserRouter>
          <InvoiceList currency="k" />
        </BrowserRouter>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryAllByTestId('created_by')[0].textContent).toContain('joe');
        expect(container.queryAllByTestId('invoice_amount')[0].textContent).toContain('k23423423');
        expect(container.queryAllByTestId('parcel_number')[0].textContent).toContain('Plot-1343');
        expect(container.queryAllByTestId('invoice_status')[0].textContent).toContain(
          'In-Progress'
        );
      },
      { timeout: 100 }
    );
  });
  it('should check if renderInvoices works as expected', () => {
    const results = renderInvoices(invoices, 'k');
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('Parcel Number');
    expect(results[0]).toHaveProperty('Amount');
    expect(results[0]).toHaveProperty('Due date');
    expect(results[0]).toHaveProperty('Invoice Status');
    expect(results[0]).toHaveProperty('CreatedBy');
  });
});
