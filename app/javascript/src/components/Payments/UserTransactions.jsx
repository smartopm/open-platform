/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DataList from '../../shared/list/DataList';
import Text, { GridText } from '../../shared/Text';
import { dateToString } from '../DateContainer';
import CenteredContent from '../CenteredContent';
import { invoiceStatus } from '../../utils/constants'
import TransactionDetails from './TransactionDetails'

const transactionHeader = [
  { title: 'Date Created', col: 1 },
  { title: 'Description', col: 1 },
  { title: 'Status', col: 1 },
  { title: 'Amount', col: 1 },
];
export default function UserTransactionsList({ transaction, currency }) {
  const [open, setOpen] = useState(false)

  if (!Object.keys(transaction).length || Object.keys(transaction).length === 0) {
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
        title='Transaction'
      />
    </div>
  )
}

export function renderTransactions(transaction, currency) {
  return {
    'Date Created': <GridText col={4} content={transaction.status === 'settled' ? `Paid on ${dateToString(transaction.createdAt)}` : `Issued on ${dateToString(transaction.createdAt)}`} />,
    Description: <GridText col={4} content={`${transaction.source === 'wallet' ? 'Invoice settlement' : 'Deposit' }`} />,
    Status: <GridText col={4} content={transaction.__typename === 'WalletTransaction' ? invoiceStatus[transaction.status] : 'In-Progress'} />,
    Amount: <GridText col={4} content={`${currency}${transaction.amount}`} />,
  };
}

UserTransactionsList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  transaction: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired
};