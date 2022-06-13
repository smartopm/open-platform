import React from 'react';
import { render } from '@testing-library/react';

import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import StatementPlan from '../Components/UserTransactions/PlanStatement';
import currency from '../../../__mocks__/currency';
import userMock from '../../../__mocks__/authstate';
import { Context } from '../../../containers/Provider/AuthStateProvider';
import MockedThemeProvider from '../../__mocks__/mock_theme';

describe('It should test the plan statement modal component', () => {
  const data = {
    paymentPlan: {
      id: '62302e94822',
      startDate: '2020-12-28',
      planType: 'BASIC',
      planValue: 1000,
      statementPaidAmount: 200,
      user: {
        name: 'some name',
        phoneNumber: '27798',
        extRefId: '672hb'
      },
      landParcel: {
        parcelNumber: '58i792',
        community: {
          name: 'Nkwashi',
          logoUrl: 'logo.jpg',
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
      }
    },
    statements: [
      {
        receiptNumber: '26289',
        paymentDate: '2020-12-28',
        amountPaid: 300,
        installmentAmount: 400,
        settledInstallments: 2,
        debitAmount: 4000,
        unallocatedAmount: 300,
        id: '385u943-ujdf'
      }
    ]
  };

  const open = true;

  const handleModalClose = jest.fn();

  it('should render plan statement modal', () => {
    const container = render(
      <Context.Provider value={userMock}>
        <BrowserRouter>
          <MockedProvider>
            <MockedThemeProvider>
              <StatementPlan
                open={open}
                data={data}
                handleClose={handleModalClose}
                currencyData={currency}
              />
            </MockedThemeProvider>
          </MockedProvider>
        </BrowserRouter>
      </Context.Provider>
    );

    expect(container.queryByText('misc.statement_for_plan')).toBeInTheDocument();
    expect(container.queryByText('11, Nalikwanda Rd,')).toBeInTheDocument();
    expect(container.queryByText('Lusaka')).toBeInTheDocument();

    expect(container.queryByTestId('client-name')).toHaveTextContent('some name');
    expect(container.queryByTestId('nrc')).toHaveTextContent('672hb');

    expect(container.queryByTestId('account-name')).toHaveTextContent('Thebe');
    expect(container.queryByTestId('tax-id-no')).toHaveTextContent('tax1234');
    expect(container.queryByTestId('address')).toHaveTextContent('11, Nalikwanda Rd,');
    expect(container.queryByTestId('city')).toHaveTextContent('Lusaka');
    expect(container.queryByTestId('country')).toHaveTextContent('Zambia');
    expect(container.queryByTestId('support-email')).toHaveTextContent('payment@support.com');
    expect(container.queryByTestId('website')).toHaveTextContent('www.web.com');
    expect(container.queryByTestId('support-phone-no')).toHaveTextContent('+260 1234');

    expect(container.queryByTestId('receipt-no')).toHaveTextContent('26289');
    expect(container.queryByTestId('pay-date')).toHaveTextContent('2020-12-28');
    expect(container.queryByTestId('amount')).toBeInTheDocument();

    expect(container.queryByText('misc.banking_details')).toBeInTheDocument();
    expect(container.queryByText('misc.bank')).toBeInTheDocument();
    expect(container.queryByText('misc.account_name')).toBeInTheDocument();
    expect(container.queryByText('misc.account_number')).toBeInTheDocument();
    expect(container.queryByText('misc.branch')).toBeInTheDocument();
    expect(container.queryByText('misc.swift_code')).toBeInTheDocument();
    expect(container.queryByText('misc.sort_code')).toBeInTheDocument();
  });
});
