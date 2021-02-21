import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import PaymentStatDetails, { renderPayments } from '../../components/Accounting/PaymentStatDetails';

describe('Payment List Item Component', () => {
  const data = [
    {
      amount: 100,
      createdAt: '2021-01-26T20:26:39Z',
      source: 'cash',
      id: '162f751-83a1-6d59569',
      user: {
        id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
        name: 'joe'
      }
    },
    {
      amount: 200,
      createdAt: '2021-01-27T20:26:39Z',
      source: 'cash',
      id: '162f751-83a1-6d59569',
      user: {
        id: '162f7517-7cc8-42f9-b2d0-a83a16d59569',
        name: 'joe m'
      }
    }
  ];
  it('should render the invoice stat component component', async () => {
    const container = render(
      <BrowserRouter>
        <PaymentStatDetails currency="k" data={data} />
      </BrowserRouter>
    );
      expect(container.queryAllByTestId('type')[0].textContent).toContain('cash');
      expect(container.queryAllByTestId('user')[0].textContent).toContain('joe');
      expect(container.queryAllByTestId('amount')[1].textContent).toContain('k200');
  });
  it('should check if renderPayments works as expected', () => {
    const results = renderPayments(data, 'k');
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('Payment Type');
    expect(results[0]).toHaveProperty('Date Paid');
    expect(results[0]).toHaveProperty('Payment made by');
    expect(results[0]).toHaveProperty('Amount');
  });
});
