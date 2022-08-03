import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import PaymentReceipt from '../Components/UserTransactions/PaymentReceipt';
import currency from '../../../__mocks__/currency';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import authState from '../../../__mocks__/authstate';
import MockedThemeProvider from '../../__mocks__/mock_theme';

jest.mock('react-signature-canvas');
window.print = jest.fn();
describe('It should test the payment receipt modal component', () => {
  const paymentData = {
    id: 'yy893rhkj3hiujhf4u3hr43u',
    amount: 1000,
    status: 'paid',
    bankName: 'bank name',
    chequeNumber: '111123',
    transactionNumber: '257439',
    createdAt: '2020-12-28',
    receiptNumber: 't1234',
    currentPlotPendingBalance: 2000,
    paymentPlan: {
      id: 'y738o48r093',
      landParcel: {
        id: '3iu73u4ri3h',
        parcelNumber: 'P4444'
      }
    },
    user: {
      id: 'ui3iiui3',
      name: 'some name',
      extRefId: '234'
    },
    depositor: {
      id: 'ui3iiui3',
      name: 'some name'
    },
    community: {
      id: 'ui3iiui3',
      name: 'Nkwashi',
      logoUrl: 'img.jpg',
      currency: 'zambian_kwacha',
      bankingDetails: {
        bankName: 'Test bank name',
        accountName: 'Thebe',
        accountNo: '1234',
        branch: 'Test branch',
        swiftCode: '032',
        sortCode: '456',
        address: '11, Nalikwanda Rd,',
        city: 'Lusaka',
        country: 'Zambia',
        taxIdNo: 'tax1234'
      },
      socialLinks: [{ category: 'website', social_link: 'www.web.com' }],
      supportEmail: [{ category: 'bank', email: 'payment@support.com' }],
      supportNumber: [{ category: 'bank', phone_number: '+260 1234' }]
    }
  };

  const open = true;

  const handleModalClose = jest.fn();

  it('should render payment receipt modal', () => {
    const container = render(
      <BrowserRouter>
        <Context.Provider value={authState}>
          <MockedProvider>
            <MockedThemeProvider>
              <PaymentReceipt
                open={open}
                paymentData={paymentData}
                handleClose={handleModalClose}
                currencyData={currency}
              />
            </MockedThemeProvider>
          </MockedProvider>
        </Context.Provider>
      </BrowserRouter>
    );

    expect(container.queryByText('common:table_headers.name')).toBeInTheDocument();
    expect(container.queryByText('NRC')).toBeInTheDocument();
    expect(container.queryByText('common:table_headers.date')).toBeInTheDocument();
    expect(container.queryByText('common:table_headers.payment_plan')).toBeInTheDocument();
    expect(container.queryByText('common:table_headers.plot_number')).toBeInTheDocument();
    expect(container.queryByTestId('action-button')).toBeInTheDocument();
    fireEvent.click(container.queryByTestId('action-button'));

    expect(container.queryByTestId('client-name')).toHaveTextContent('some name');
    expect(container.queryByTestId('nrc')).toHaveTextContent('234');

    expect(container.queryByTestId('plot-no')).toHaveTextContent('misc.plot_plan_no');
    expect(container.queryByTestId('pay-type')).toHaveTextContent(
      'common:table_headers.payment_type'
    );
    expect(container.queryByTestId('amount')).toHaveTextContent('table_headers.amount_paid');

    expect(container.queryByTestId('account-name')).toHaveTextContent('Thebe');
    expect(container.queryByTestId('tax-id-no')).toHaveTextContent('tax1234');
    expect(container.queryByTestId('address')).toHaveTextContent('11, Nalikwanda Rd,');
    expect(container.queryByTestId('city')).toHaveTextContent('Lusaka');
    expect(container.queryByTestId('country')).toHaveTextContent('Zambia');
    expect(container.queryByTestId('support-email')).toHaveTextContent('payment@support.com');
    expect(container.queryByTestId('website')).toHaveTextContent('www.web.com');
    expect(container.queryByTestId('support-phone-no')).toHaveTextContent('+260 1234');

    expect(container.queryByText('misc.banking_details')).toBeInTheDocument();
    expect(container.queryByText('misc.bank')).toBeInTheDocument();
    expect(container.queryByText('misc.account_name')).toBeInTheDocument();
    expect(container.queryByText('misc.account_number')).toBeInTheDocument();
    expect(container.queryByText('misc.branch')).toBeInTheDocument();
    expect(container.queryByText('misc.swift_code')).toBeInTheDocument();
    expect(container.queryByText('misc.sort_code')).toBeInTheDocument();
  });
});
