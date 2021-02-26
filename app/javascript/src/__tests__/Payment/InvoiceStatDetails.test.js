import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import InvoiceStatDetails, { renderInvoices } from '../../components/Payments/InvoiceStatDetails';

describe('Payment List Item Component', () => {
  const data = [
    {
      amount: 100,
      createdAt: '2021-01-26T20:26:39Z',
      dueDate: '2021-01-26T20:26:39Z',
      id: '162f751-83a1-6d59569',
      user: {
        id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
        name: 'joe'
      },
      landParcel: {
        parcelNumber: 'test-123',
        id: '162f7517-7cc8-42f9-b2d0-a83a16d59569'
      }
    }
  ];
  it('should render the invoice stat component component', async () => {
    const container = render(
      <BrowserRouter>
        <InvoiceStatDetails currency="k" data={data} />
      </BrowserRouter>
    );
      expect(container.queryAllByTestId('client_name')[0].textContent).toContain('joe');
      expect(container.queryAllByTestId('description')[0].textContent).toContain('test-123');
      expect(container.queryAllByTestId('amount')[0].textContent).toContain('k100');
  });
  it('should check if renderInvoices works as expected', () => {
    const results = renderInvoices(data, 'k');
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('Client Name');
    expect(results[0]).toHaveProperty('Invoice Description');
    expect(results[0]).toHaveProperty('Date Issue/Due Date');
    expect(results[0]).toHaveProperty('Amount');
  });
});
