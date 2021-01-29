import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DataList from '../../shared/list/DataList';
import Text, { GridText } from '../../shared/Text';
import { dateToString } from '../DateContainer';
import CenteredContent from '../CenteredContent';
import { invoiceStatus } from '../../utils/constants'
import TransactionDetails from './TransactionDetails'

const transactionHeader = [
  { title: 'Invoice Number', col: 1 },
  { title: 'Status', col: 1 },
  { title: 'Date Created', col: 1 },
  { title: 'Amount', col: 1 },
  { title: 'Balance', col: 1 }
];
export default function UserTransactionsList({ transaction, currency }) {
  const [open, setOpen] = useState(false)

  if (!Object.keys(transaction).length) {
    return <CenteredContent><Text content="No Transactions Yet" align="justify" /></CenteredContent>
  }
  return (
    <div>
      <DataList 
        keys={transactionHeader} 
        data={[renderTransactions(transaction, currency)]} 
        hasHeader={false} 
        clickable={{status: true}}
        handleClick={() => setOpen(true)} 
      />
      <TransactionDetails 
        detailsOpen={open} 
        handleClose={() => setOpen(false)} 
        data={transaction}
        currency={currency}
      />
    </div>
  )
}

export function renderTransactions(transaction, currency) {
  return {
    'Invoice Number': <GridText col={2} content={`${transaction.transactionNumber || transaction.status === 'in_progress' ? 'Invoice' : 'Transaction' }`} />,
    Status: <GridText col={3} content={invoiceStatus[transaction.status]} />,
    'Date Created': <GridText col={3} content={transaction.status === 'in_progress' ? `Issued on ${dateToString(transaction.createdAt)}` : `Paid on ${dateToString(transaction.createdAt)}`} />,
    Amount: <GridText content={`${currency}${transaction.amount}`} />,
    Balance: <GridText content={`Balance of ${currency}${transaction.currentWalletBalance || 0}`} />,
  };
}

UserTransactionsList.propTypes = {
  transaction: PropTypes.shape({
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    balance: PropTypes.number
  }).isRequired,
  currency: PropTypes.string.isRequired
};