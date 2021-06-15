import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom/';
import PaymentReceipt from '../Components/UserTransactions/PaymentReceipt';
import currency from '../../../__mocks__/currency';

jest.mock('react-signature-canvas');
describe('It should test the payment receipt modal component', () => {
  const paymentData = {
    id: 'yy893rhkj3hiujhf4u3hr43u',
    amount: 1000,
    status: 'paid',
    bankName: 'bank name',
    chequeNumber: '111123',
    transactionNumber: '257439',
    createdAt: '2020-12-28',
    planPayments: [{
      id: '27397iy2gr',
      receiptNumber: 't1234',
      currentPlotPendingBalance: 2000,
      paymentPlan: {
        id: 'y738o48r093',
        landParcel: {
          id: '3iu73u4ri3h',
          parcelNumber: 'P4444'
        }
      }
    }],
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
      socialLinks: [{ category: 'website', social_link: 'www.web.com'}],
      supportEmail: [{ category: 'bank', email: 'payment@support.com'}],
      supportNumber: [{ category: 'bank', phone_number: '+260 1234'}],
    }
  };

  const open = true;

  const handleModalClose = jest.fn();

  it('it should render payment receipt modal', () => {
    const container = render(
      <BrowserRouter>
        <MockedProvider>
          <PaymentReceipt
            open={open}
            paymentData={paymentData}
            handleClose={handleModalClose}
            currencyData={currency}
          />
        </MockedProvider>
      </BrowserRouter>
    );

    expect(container.queryByText('Name')).toBeInTheDocument();
    expect(container.queryByText('NRC')).toBeInTheDocument();
    expect(container.queryByText('Date')).toBeInTheDocument();

    expect(container.queryByTestId('client-name')).toHaveTextContent('some name');
    expect(container.queryByTestId('nrc')).toHaveTextContent('234');

    expect(container.queryByTestId('plot-no')).toHaveTextContent('Plot/Plan No.');
    expect(container.queryByTestId('pay-type')).toHaveTextContent('Payment Type');
    expect(container.queryByTestId('amount')).toHaveTextContent('Amount Paid');

    expect(container.queryByTestId('account-name')).toHaveTextContent('Thebe');
    expect(container.queryByTestId('tax-id-no')).toHaveTextContent('tax1234');
    expect(container.queryByTestId('address')).toHaveTextContent('11, Nalikwanda Rd,');
    expect(container.queryByTestId('city')).toHaveTextContent('Lusaka');
    expect(container.queryByTestId('country')).toHaveTextContent('Zambia');
    expect(container.queryByTestId('support-email')).toHaveTextContent('payment@support.com');
    expect(container.queryByTestId('website')).toHaveTextContent('www.web.com');
    expect(container.queryByTestId('support-phone-no')).toHaveTextContent('+260 1234');

    expect(container.queryByText('Banking Details')).toBeInTheDocument();
    expect(container.queryByText('Bank')).toBeInTheDocument();
    expect(container.queryByText('Account Name')).toBeInTheDocument();
    expect(container.queryByText('Account Number')).toBeInTheDocument();
    expect(container.queryByText('Branch')).toBeInTheDocument();
    expect(container.queryByText('Swift Code')).toBeInTheDocument();
    expect(container.queryByText('Sort Code')).toBeInTheDocument();
  });
});
