import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserInvoiceItem, { renderInvoices } from '../../components/Payments/UserTransactions/UserInvoiceItem';
import currency from '../../__mocks__/currency';

describe('Invoice Item Component', () => {
  const invoice = {
    id: '299191a9-dece-4ea5-96a2-1e50424fa38a',
      amount: 23423423,
      status: 'paid',
      description: 'Final Payment',
      invoiceNumber: '123',
      dueDate: '2020-12-31T14:26:00Z',
      createdAt: '2020-12-28T22:00:00Z',
      updatedAt: '2020-12-28T22:00:00Z',
      pendingAmount: 0,
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
  };

  it('should render the invoice item component', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserInvoiceItem currencyData={currency} invoice={invoice} />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('description')).toBeInTheDocument();
    expect(container.queryByTestId('amount')).toBeInTheDocument();
    expect(container.queryByTestId('status')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('description'))
    expect(container.queryByText('Invoice Details')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('cancel'))
  });

  it('should render the invoice item component with no invoice', () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserInvoiceItem currencyData={currency} invoice={{}} />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByText('No Invoice Available')).toBeInTheDocument();
  });
  it('should check if renderInvoices works as expected', () => {
    const results = renderInvoices(invoice, currency);
    expect(results).toBeInstanceOf(Object);
    expect(results).toHaveProperty('Issue Date');
    expect(results).toHaveProperty('Description');
    expect(results).toHaveProperty('Amount');
    expect(results).toHaveProperty('Payment Date');
    expect(results).toHaveProperty('Status');
  });
});