import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import PaymentSummary from '../Components/PaymentSummary';
import { InvoiceSummaryQuery, PaymentSummaryQuery } from '../graphql/payment_summary_query';
import { Spinner } from '../../../../shared/Loading';

describe('Payment Summary Component', () => {
  const authState = {
    user: {
      userType: 'admin',
      community: {
        currency: 'k',
        locale: 'nkw'
      }
    }
  }
  const mock = {
    request: {
      query: InvoiceSummaryQuery
    },
    result: {
      data: {
        invoiceSummary:
          {
            today: 100,
            oneWeek: 100,
            oneMonth: 100,
            overOneMonth: 100
          }
      }
    }
  }

  const secondMock = {
    request: {
      query: PaymentSummaryQuery
    },
    result: {
      data: {
        transactionSummary:
          {
            today: 100,
            oneWeek: 100,
            oneMonth: 100,
            overOneMonth: 100
          }
      }
    }
  }

  it('should render the Payment Summary component', async () => {
    const translate = jest.fn(() => 'Some Title')
    const container = render(
      <MockedProvider mocks={[mock, secondMock]} addTypename={false}>
        <BrowserRouter>
          <PaymentSummary authState={authState} translate={translate} />
        </BrowserRouter>
      </MockedProvider>
    );
    
    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryAllByText('100')[0]).toBeInTheDocument();
      },
      { timeout: 200 }
    );

    fireEvent.click(container.queryAllByText(100)[0])
  });
});
