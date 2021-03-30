import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';
import UserTransactionsList, { renderTransactions } from "../../components/Payments/UserTransactions/UserTransactions";
import currency from '../../__mocks__/currency'

describe('Render Transaction', () => {
  const transaction = {
    amount: 200,
    source: 'wallet',
    destination: 'deposit',
    status: 'settled',
    createdAt: '2021-03-01T09:55:05Z',
    updatedAt: '2021-03-01T09:55:05Z',
    currentWalletBalance: 100,
    chequeNumber: null,
    bankName: null,
    transactionNumber: null,
    id: '3b464fb7-bb2b-41cb-9245-9300b6d8a729',
    user: {
      id: 'a54d6184-b10e-4865-bee7-7957701d423d',
      name: 'Another somebodyy'
    },
    __typename: 'WalletTransaction'
  };

  const menuData = {
    menuList: [{ content: 'Example', isAdmin: true, color: '', handleClick: jest.fn()}],
    handleTransactionMenu: jest.fn(),
    anchorEl: null,
    open: true,
    userType: 'admin',
    handleClose: jest.fn()
  }

  const userData = {
    name: 'test-name'
  }
  
  it('should render the Transaction item component', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserTransactionsList transaction={transaction} currencyData={currency} userType='admin' userData={userData} />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByTestId('menu')).toBeInTheDocument();
    expect(container.queryByTestId('amount')).toBeInTheDocument();
    expect(container.queryByTestId('status')).toBeInTheDocument();

    fireEvent.click(container.queryByTestId('receipt-menu'))
    expect(container.queryByText('View Receipt')).toBeInTheDocument();
    expect(container.queryByText('Edit Payment')).toBeInTheDocument();
  });

  it('should render the Transaction item component without transactions', async () => {
    const container = render(
      <MockedProvider>
        <BrowserRouter>
          <UserTransactionsList transaction={{}} currencyData={currency} userType='admin' userData={userData} />
        </BrowserRouter>
      </MockedProvider>
    );
    
    expect(container.queryByText('No Transactions Yet')).toBeInTheDocument();
  });

  it('should check if renderTransaction works as expected', () => {
      const results = renderTransactions(transaction, currency, menuData)
      expect(results).toBeInstanceOf(Object);
      expect(results).toHaveProperty('Date Created');
      expect(results).toHaveProperty('Description');
      expect(results).toHaveProperty('Amount');
      expect(results).toHaveProperty('Balance');
      expect(results).toHaveProperty('Status');
      expect(results).toHaveProperty('Menu');

      const statusContainer = render(results.Status)
      const amountContainer = render(results.Amount)
      const balanceContainer = render(results.Balance)
      const descContainer = render(results.Description)
      const menuContainer = render(results.Menu)
      expect(statusContainer.queryByTestId('status').textContent).toContain('Paid')
      expect(amountContainer.queryByTestId('amount').textContent).toContain('$200.00')
      expect(balanceContainer.queryByTestId('balance').textContent).toContain('$100.00')
      expect(descContainer.queryByTestId('description').textContent).toContain('Invoice')
      expect(menuContainer.queryByTestId('receipt-menu')).toBeTruthy()
  });
});
