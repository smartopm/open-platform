import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { InvoicesQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import InvoiceList, { renderInvoice } from '../../modules/Payments/Components/InvoiceList';
import currency from '../../__mocks__/currency';

describe('Invoice Item Component', () => {
  const menuData = {
    menuList: [{ content: 'Example', isAdmin: true, color: '', handleClick: jest.fn()}],
    handleTransactionMenu: jest.fn(),
    anchorEl: null,
    open: true,
    userType: 'admin',
    handleClose: jest.fn()
  }
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
        name: 'joe',
        imageUrl: 'image.jpg'
      },
      landParcel: {
        id: '233b1634-bf08-4ece-a213-b3f120a1e009',
        parcelNumber: 'Plot-1343'
      },
      payments: [
        {
          id: '2d00802e-8f65-4643-b25c-ede2c0d51fe5',
          createdAt: '2021-02-02T10:13:21Z',
          amount: 1000,
          paymentType: 'cash',
          paymentStatus: 'paid',
          user: {
            id: '2d00802e-8f65-4643',
            name: 'joe',
          }
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
        name: 'joe',
        imageUrl: 'image.jpg'
      },
      landParcel: {
        id: '50da896a-9217-43b9-a28f-03a13c7d401f',
        parcelNumber: 'Starter-200'
      },
      payments: [
        {
          id: '2d003402e-8f65-4643-b25c-ede2c0d51fe5',
          createdAt: '2021-02-02T10:13:21Z',
          amount: 1000,
          paymentType: 'cash',
          paymentStatus: 'paid',
          user: {
            id: '2d00802e-8f65-4643',
            name: 'joe',
          }
        }
      ]
    }
  ];
  it('should render the invoice item component', async () => {
    const invoiceMock = [
      {
        request: {
          query: InvoicesQuery,
          variables: { limit: 50, offset: 0, query: '' }
        },
        result: {
          data: {
            invoices
          }
        }
      }
    ];

    const container = render(
      <MockedProvider mocks={invoiceMock} addTypename={false}>
        <BrowserRouter>
          <InvoiceList currencyData={currency} userType='admin' />
        </BrowserRouter>
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        // expect(container.queryAllByTestId('created_by')[0].textContent).toContain('joe');
        expect(container.queryAllByTestId('invoice_amount')[0].textContent).toContain('$23,423,423');
        expect(container.queryAllByTestId('invoice-generate-button')[0].textContent).toContain('Create Monthly Invoices');
      },
      { timeout: 200 }
    );
    const menu = container.queryAllByTestId('menu')[0]
    expect(menu).toBeInTheDocument()
    fireEvent.click(menu)
    
    const cancelText = container.queryAllByText('Cancel Invoice')[0]
    expect(cancelText).toBeInTheDocument();

    fireEvent.click(cancelText)

    const deleteButton = container.queryByTestId('confirm_action')
    expect(deleteButton).toBeInTheDocument();
  });
  it('should check if renderInvoice works as expected', () => {
    const results = renderInvoice(invoices[0], currency, menuData);
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('Issue Date');
    expect(results[0]).toHaveProperty('Description');
    expect(results[0]).toHaveProperty('Amount');
    expect(results[0]).toHaveProperty('Payment Date');
    expect(results[0]).toHaveProperty('Status');
    expect(results[0]).toHaveProperty('Menu');
  });
});