/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DataList from '../../shared/list/DataList';
import Text, { GridText } from '../../shared/Text';
import { dateToString } from '../DateContainer';
import CenteredContent from '../CenteredContent';
import { invoiceStatus } from '../../utils/constants'
import TransactionDetails from './TransactionDetails'
import ButtonComponent from '../../shared/Button'
import PaymentModal from './PaymentModal'

const transactionHeader = [
  { title: 'Invoice Number', col: 1 },
  { title: 'Status', col: 1 },
  { title: 'Date Created', col: 1 },
  { title: 'Amount', col: 1 },
  { title: 'Type', col: 1 },
  { title: 'Balance', col: 1 }
];
export default function UserTransactionsList({ transaction, currency, userId, refetch, depRefetch, invoiceRefetch }) {
  const [open, setOpen] = useState(false)
  const [payOpen, setPayOpen] = useState(false)

  if (!Object.keys(transaction).length || Object.keys(transaction).length === 0) {
    return <CenteredContent><Text content="No Transactions Yet" align="justify" /></CenteredContent>
  }
  return (
    <div>
      <div style={{display: 'flex'}}>
        <DataList 
          keys={transactionHeader} 
          data={[renderTransactions(transaction, currency)]} 
          hasHeader={false} 
          clickable={{status: true}}
          handleClick={() => setOpen(true)} 
        />
        <ButtonComponent color='primary' buttonText='make payment' handleClick={() => setPayOpen(true)} />
      </div>
      <PaymentModal 
        open={payOpen}
        handleModalClose={() => setPayOpen(false)}
        userId={userId}
        currency={currency} 
        refetch={refetch}
        depRefetch={depRefetch}
        invoiceRefetch={invoiceRefetch}
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
    'Invoice Number': <GridText col={2} content={`${transaction.transactionNumber || transaction.__typename === 'WalletTransaction' ? 'Transaction' : 'Invoice' }`} />,
    Status: <GridText col={3} content={invoiceStatus[transaction.status] || 'In-Progress'} />,
    'Date Created': <GridText col={3} content={transaction.status === 'settled' ? `Paid on ${dateToString(transaction.createdAt)}` : `Issued on ${dateToString(transaction.createdAt)}`} />,
    Amount: <GridText content={`${currency}${transaction.amount}`} />,
    Type: <GridText content={transaction.source || null} />,
    Balance: <GridText content={transaction.__typename === 'WalletTransaction' ? `Balance of ${currency}${transaction.currentWalletBalance}`: `Balance of ${currency}${transaction.balance}`} />,
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
  userId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  depRefetch: PropTypes.func.isRequired,
  invoiceRefetch: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired
};