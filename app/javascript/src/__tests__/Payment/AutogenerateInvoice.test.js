import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import AutogenerateInvoice from '../../modules/Payments/Components/AutogenerateInvoice';
import { InvoiceAutogenerationData } from '../../graphql/queries';
import currency from '../../__mocks__/currency'
import { Spinner } from '../../shared/Loading';

describe('Autogenerate Component', () => {
  const mock = {
    request: {
      query: InvoiceAutogenerationData
    },
    result: {
      data: {
        invoiceAutogenerationData: {
          numberOfInvoices: 0,
          totalAmount: 0
        }
      }
    }
  };
  it('renders correctly', async () => {
    const container = render(
      <MockedProvider mocks={[mock]}>
        <AutogenerateInvoice close={jest.fn()} currencyData={currency} />
      </MockedProvider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryByTestId('title_msg').textContent).toContain(
          'This will generate all invoices for this month.'
        );
        expect(container.queryByTestId('number_invoices').textContent).toContain(
          ' Number of invoices for this month'
        );
        expect(container.queryByTestId('invoices_amount').textContent).toContain(
          'Total amount for invoices this month'
        );
        expect(container.queryByTestId('invoice-generate-button').textContent).toContain(
          'Generate Invoices'
        );
        expect(container.queryByTestId('invoice-generate-button')).not.toBeDisabled()
      },
      { timeout: 100 }
    );
  });
});
