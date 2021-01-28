import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DataList from '../../shared/list/DataList';
import Text, { GridText } from '../../shared/Text';
import { dateToString } from '../DateContainer';
import CenteredContent from '../CenteredContent';
import { invoiceStatus } from '../../utils/constants'
import TransactionDetails from './TransactionDetails'

const invoiceHeader = [
  { title: 'Invoice Number', col: 1 },
  { title: 'Invoice', col: 1 },
  { title: 'Date Created', col: 1 },
  { title: 'Status', col: 1 },
  { title: 'Amount', col: 1 },
  { title: 'Balance', col: 1 }
];

const paymentHeader = [
  { title: 'Payment', col: 1 },
  { title: 'Status', col: 1 },
  { title: 'Date Created', col: 1 },
  { title: 'Amount', col: 1 },
  { title: 'Type', col: 1 },
];

const depositHeader = [
  { title: 'Deposit', col: 1 },
  { title: 'Status', col: 1 },
  { title: 'Date Created', col: 1 },
  { title: 'Amount', col: 1 },
  { title: 'Source', col: 1 },
];
export default function UserTransactionsList({ transactions, currency }) {
  const [transType, setTransType] = useState('')
  const [open, setOpen] = useState(false)

  function invoiceOnclick() {
    setTransType('invoice')
  }

  if (!Object.keys(transactions).length) {
    return <CenteredContent><Text content="No Transactions Yet" align="justify" /></CenteredContent>
  }
  return (
    <div>
      <TransactionDetails 
        detailsOpen={open}
        handleClose={() => setOpen(false)}
        transType={transType}
      />
      <DataList 
        keys={invoiceHeader} 
        data={renderInvoiceTransactions(transactions.invoices, currency)} 
        hasHeader={false} 
        clickable={{status: true}}
        handleClick={invoiceOnclick}
      />
      <DataList 
        keys={paymentHeader} 
        data={renderPaymentTransactions(transactions.payments, currency)} 
        hasHeader={false} 
        clickable={{status: true}}
      />
      <DataList 
        keys={depositHeader} 
        data={renderDepositTransactions(transactions.deposits, currency)} 
        hasHeader={false} 
        clickable={{status: true}}
      />
    </div> 
  )
}

export function renderInvoiceTransactions(data, currency) {
  return data.map((transaction, count) => {
    return {
      id: transaction.id,
      'Invoice Number': <GridText col={1} content={`#${transaction.transactionNumber || count + 1}`} />,
      Invoice: <GridText content='Invoice' />,
      'Date Created': <GridText content={`Created on ${dateToString(transaction.createdAt)}`} />,
      Status: <GridText col={3} content={`Updated to ${invoiceStatus[transaction.status]} on ${dateToString(transaction.updatedAt)}`}  />,
      Amount: <GridText content={`${currency}${transaction.amount}`} />,
      Balance: <GridText content={`Balance of ${currency}${transaction.currentWalletBalance || 0}`} />,
    };
  });
}

export function renderPaymentTransactions(data, currency) {
  return data.map((transaction) => {
    return {
      Payment: <GridText content='Payment' />,
      'Date Created': <GridText content={`Paid on ${dateToString(transaction.createdAt)}`} />,
      Status: <GridText col={3} content={`Updated to ${transaction.paymentStatus} on ${dateToString(transaction.updatedAt)}`} />,
      Amount: <GridText content={`${currency}${transaction.amount}`} />,
      Type: <GridText content={transaction.paymentType === 'cash' ? 'Cash' : 'Cheque/CashierCheque'} />
    };
  });
}

export function renderDepositTransactions(data, currency) {
  return data.map((transaction) => {
    return {
      Deposit: <GridText content='Deposit' />,
      'Date Created': <GridText content={`Deposited on ${dateToString(transaction.createdAt)}`} />,
      Status: <GridText col={3} content={`Updated to ${transaction.status} on ${dateToString(transaction.updatedAt)}`} />,
      Amount: <GridText content={`${currency}${transaction.amount}`} />,
      Source: <GridText content={transaction.source === 'cash' ? 'Cash' : 'Cheque/CashierCheque'} />
    };
  });
}

UserTransactionsList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      balance: PropTypes.number
    })
  ).isRequired,
  currency: PropTypes.string.isRequired
};
