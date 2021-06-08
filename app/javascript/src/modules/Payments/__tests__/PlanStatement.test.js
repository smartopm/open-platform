import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import StatementPlan from '../Components/UserTransactions/PlanStatement';
import currency from '../../../__mocks__/currency';

describe('It should test the plan statement modal component', () => {
  const data = {
    paymentPlan: {
      id: '62302e94822',
      startDate: '2020-12-28',
      planType: 'BASIC',
      planValue: 1000,
      statementPaidAmount: 200,
      statementPendingBalance: 500,
      user: {
        name: 'some name',
        phoneNumber: '27798',
        extRefId: '672hb'
      },
      landParcel: {
        parcelNumber: '58i792',
        community: {
          name: 'Nkwashi',
          logoUrl: 'logo.jpg'
        }
      }
    },
    statements: [{
      receiptNumber: '26289',
      paymentDate: '2020-12-28', 
      amountPaid: 300,
      installmentAmount: 400,
      settledInstallments: 2,
      debitAmount: 4000,
      unallocatedAmount: 300
    }]
  };

  const open = true;

  const handleModalClose = jest.fn();

  it('it should render plan statement modal', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <StatementPlan
            open={open}
            data={data}
            handleClose={handleModalClose}
            currencyData={currency}
          />
        </MockedProvider>
      </BrowserRouter>
    );

    expect(container.queryByText('Nkwashi Project,')).toBeInTheDocument();
    expect(container.queryByText('11, Nalikwanda Rd,')).toBeInTheDocument();
    expect(container.queryByText('Lusaka,')).toBeInTheDocument();

    expect(container.queryByTestId('client-name')).toHaveTextContent('some name');
    expect(container.queryByTestId('nrc')).toHaveTextContent('672hb');

    expect(container.queryByTestId('receipt-no')).toHaveTextContent('26289');
    expect(container.queryByTestId('pay-date')).toHaveTextContent('2020-12-28');
    expect(container.queryByTestId('amount')).toHaveTextContent('300');

    expect(container.queryByText('Banking Details')).toBeInTheDocument();
    expect(container.queryByText('Bank')).toBeInTheDocument();
    expect(container.queryByText('Account Name')).toBeInTheDocument();
    expect(container.queryByText('Account Number')).toBeInTheDocument();
    expect(container.queryByText('Branch')).toBeInTheDocument();
    expect(container.queryByText('Swift Code')).toBeInTheDocument();
    expect(container.queryByText('Sort Code')).toBeInTheDocument();
  });
});
