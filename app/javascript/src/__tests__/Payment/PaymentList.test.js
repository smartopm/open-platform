import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import { Spinner } from '../../shared/Loading';
import PaymentList, { renderPayment, renderSubscriptionPlans } from '../../modules/Payments/Components/PaymentList';
import currency from '../../__mocks__/currency';
import { Context } from '../../containers/Provider/AuthStateProvider';
import userMock from '../../__mocks__/userMock';
import { PlansPaymentsQuery, SubscriptionPlansQuery } from '../../modules/Payments/graphql/payment_query';

describe('Payment List Item Component', () => {
  const transactions = [
    {
      amount: 1000,
      receiptNumber: 'SI1008',
      status: 'paid',
      createdAt: '2021-06-04T08:50:45Z',
      id: '5d0d8051-2510-42ed-886a-48bbfa9f6414',
      userTransaction: {
        source: 'cash',
        amount: 1000,
        id: 'dd7bcc9d-c063-4aad-8110-d784d535f3e3',
        transactionNumber: '9234832423'
      },
      user: {
        id: '9c617681-b6b3-4ebf-b5aa-c7a606c2f2f4',
        name: 'JM',
        imageUrl: null,
        email: 'hello_again@gmail.com',
        phoneNumber: '26097150001748',
        extRefId: null
      },
      paymentPlan: {
        landParcel: {
          parcelType: '232',
          parcelNumber: 'Plot 664354'
        }
      }
    }
  ];

  const subscriptionPlans = [
    {
      amount: 100000,
      status: 'active',
      startDate: '2021-06-04',
      endDate: '2022-06-04',
      planType: 'basic',
      id: '5d0d8051-2510-567a-886a-48bbfa9f6414'
    }
  ];

  const mocks = [
    {
    request: {
      query: PlansPaymentsQuery,
      variables: { limit: 50, offset: 0, query: '' }
    },
    result: {
      data: {
        paymentsList: transactions
      }
    }
  },
  {
    request: {
      query: SubscriptionPlansQuery
    },
    result: {
      data: {
        subscriptionPlans
      }
    }
  }
];
  it('should render the invoice item component', async () => {
    const container = render(
      <Context.Provider value={userMock}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <BrowserRouter>
            <PaymentList currencyData={currency} />
          </BrowserRouter>
        </MockedProvider>
      </Context.Provider>
    );

    const loader = render(<Spinner />);

    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();

    await waitFor(
      () => {
        expect(container.queryAllByTestId('created_by')[0].textContent).toContain('JM');
        expect(container.queryAllByTestId('payment_info')[0].textContent).toContain('Cash Deposit');
        expect(container.queryAllByTestId('payment_info')).toHaveLength(1);
        expect(container.queryAllByTestId('receipt_number')).toHaveLength(1);
        expect(container.queryAllByTestId('simple-tab-0')).toHaveLength(1);
        expect(container.queryAllByTestId('simple-tab-1')).toHaveLength(1);
      },
      { timeout: 100 }
    );

    const filterClick = container.getByTestId('filter');
    fireEvent.click(filterClick);
    expect(container.queryByText('Client Name')).toBeInTheDocument();

    const searchInput = container.queryByTestId('search');
    fireEvent.change(searchInput, { target: { value: 'text' } });
    expect(searchInput.value).toBe('text');

    const planTabClick = container.getByTestId('simple-tab-1');
    fireEvent.click(planTabClick);
    expect(loader.queryAllByTestId('loader')[0]).toBeInTheDocument();
  });

  it('should check if renderPayment works as expected', () => {
    const results = renderPayment(transactions[0], currency);
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('Client Name');
    expect(results[0]).toHaveProperty('Payment Info');
    expect(results[0]).toHaveProperty('Receipt Number');
    expect(results[0]).toHaveProperty('Plot Info');
  });

  it('should check if renderSubscriptionPlans works as expected', () => {
    const menuData = {
      menuList: [{ content: 'Edit subscription plan', isAdmin: true, color: '', handleClick: jest.fn()}],
      handleTransactionMenu: jest.fn(),
      anchorEl: null,
      open: true,
      userType: 'admin',
      handleClose: jest.fn()
    }
    const results = renderSubscriptionPlans(subscriptionPlans[0], currency, menuData);
    expect(results).toBeInstanceOf(Array);
    expect(results[0]).toHaveProperty('Plan Type');
    expect(results[0]).toHaveProperty('Start Date');
    expect(results[0]).toHaveProperty('End Date');
    expect(results[0]).toHaveProperty('Amount');
    expect(results[0]).toHaveProperty('Status');
  });
});
