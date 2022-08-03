import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import ReactTestUtils from 'react-dom/test-utils';
import RouteData from 'react-router';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import PaymentForm from '../Components/PaymentForm';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import userMock from '../../../../__mocks__/authstate';
import MockedThemeProvider from '../../../__mocks__/mock_theme';
import MockedSnackbarProvider from '../../../__mocks__/mock_snackbar';
import { TransactionInitiateMutation, TransactionVerifyMutation } from '../graphql/transaction_logs_mutation';

describe('PaymentForm', () => {
  const userEvent = ReactTestUtils.Simulate;
  const transactionInitiateMock = [
    {
      request: {
        query: TransactionInitiateMutation,
        variables: { amount: 10.0, invoiceNumber: 'az12Q', description: 'initiate transaction' } 
      },
      result: {
        data: {
          transactionInitiate: {
            paymentLink: 'https://flutterwave/payments/pay/124312'
          }
        }
      }
    }
  ]
  it('should render the payment form', async () => {
    const container = render(
      <MockedProvider mocks={transactionInitiateMock} addTypename={false}>
        <Context.Provider value={userMock}>
          <BrowserRouter>
            <MockedThemeProvider>
              <MockedSnackbarProvider>
                <PaymentForm />
              </MockedSnackbarProvider>
            </MockedThemeProvider>
          </BrowserRouter>
        </Context.Provider>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('payment_form')).toBeInTheDocument();
    expect(container.queryByTestId('invoice_number')).toBeInTheDocument();
    expect(container.queryByTestId('amount')).toBeInTheDocument();
    expect(container.queryByTestId('optional_description')).toBeInTheDocument();
    expect(container.queryByTestId('account_name')).toBeInTheDocument();
    expect(container.queryByText('payment:misc.make_a_payment')).toBeInTheDocument();
    expect(container.queryByTestId('make_a_payment_btn')).toBeInTheDocument();
    expect(container.queryByTestId('make_a_payment_btn')).toBeDisabled();
    expect(container.queryByTestId('make_a_payment_btn').textContent).toContain('misc.next');
    userEvent.change(container.queryByLabelText('task:task.optional_description'), {
      target: { value: 'some description' }
    });
    expect(container.queryByLabelText('task:task.optional_description').value).toContain(
      'some description'
    );

    userEvent.change(container.queryByLabelText('form_fields.invoice_number *'), {
      target: { value: 'some invoice number' }
    });
    expect(container.queryByLabelText('form_fields.invoice_number *').value).toContain(
      'some invoice number'
    );

    userEvent.change(container.queryByLabelText('table_headers.amount *'), {
      target: { value: '10000' }
    });
    expect(container.queryByLabelText('table_headers.amount *').value).toContain('10000');

    expect(container.queryByTestId('make_a_payment_btn')).not.toBeDisabled();

    userEvent.change(container.queryByLabelText('form_fields.account_name *'), {
      target: { value: 'JU' }
    });
    expect(container.queryByLabelText('form_fields.account_name *').value).toContain('JU');

    userEvent.submit(container.queryByTestId('payment_form'));
    // after submitting, it should be disabled again and flutterwave modal to be called
    expect(container.queryByTestId('make_a_payment_btn')).toBeDisabled();
  });

  describe('Payment Form after transaction completion', ()=> {
    const mockParams = {
      status: 'successful',
      tx_ref: 'asasdA_a13a',
      transaction_id: '11122'
    };
    beforeEach(() => {
      jest.spyOn(RouteData, 'useParams').mockReturnValue(mockParams);
    });

    it('renders to payment form after successful transaction', async () => {
      const verifyTransactionMock = [
        {
          request: {
            query: TransactionVerifyMutation,
            variables: { transactionRef: 'asasdA_a13a', transactionId: '11122'}
          },
          result: {
            data: {
              transactionVerify: {
                status: "successful"
              }
            }
          }
        }
      ]
  
      const container = render(
        <MockedProvider mocks={verifyTransactionMock} addTypename={false}>
          <Context.Provider value={userMock}>
            <BrowserRouter>
              <MockedThemeProvider>
                <MockedSnackbarProvider>
                  <PaymentForm />
                </MockedSnackbarProvider>
              </MockedThemeProvider>
            </BrowserRouter>
          </Context.Provider>
        </MockedProvider>
      );
  
      expect(container.queryByTestId('payment_form')).toBeInTheDocument();
      expect(container.queryByTestId('invoice_number')).toBeInTheDocument();
      expect(container.queryByTestId('amount')).toBeInTheDocument();
      expect(container.queryByTestId('optional_description')).toBeInTheDocument();
      expect(container.queryByTestId('account_name')).toBeInTheDocument();
      expect(container.queryByText('payment:misc.make_a_payment')).toBeInTheDocument();
      expect(container.queryByTestId('make_a_payment_btn')).toBeInTheDocument();
      expect(container.queryByTestId('make_a_payment_btn')).toBeDisabled();
      expect(container.queryByTestId('make_a_payment_btn').textContent).toContain('misc.next');
    });
  })
});
