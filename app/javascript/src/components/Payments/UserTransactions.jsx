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
  { title: 'Balance', col: 1 },
];

const payStatus = {
  cash: 'Cash',
  mobile_money: 'Mobile Money',
  pos: 'Point of Sale',
  'cheque/cashier_cheque': 'Cheque or CashierCheque',
  'bank_transfer/eft': 'Bank Transfer - EFT',
  'bank_transfer/cash_deposit': 'Bank Transfer - Cash Deposit',
}
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
        clickable
        handleClick={() => setOpen(true)} 
      />
      <TransactionDetails 
        detailsOpen={open} 
        handleClose={() => setOpen(false)} 
        data={transaction}
        currency={currency}
        title={`${transaction.__typename === 'WalletTransaction'? 'Transaction' : 'Invoice'}`}
      />
    </div>
  )
}

export function renderTransactions(transaction, currency) {
  return {
    'Date Created': <GridText col={4} content={transaction.__typename === 'WalletTransaction' ? `Paid on ${dateToString(transaction.createdAt)}` : `Issued on ${dateToString(transaction.createdAt)}`} />,
    // eslint-disable-next-line no-nested-ternary
    Description: <GridText col={4} content={`${transaction.__typename !== 'WalletTransaction' ? 'Invoice' : transaction.source === 'wallet' ? 'Invoice settlement' : 'Deposit' }`} />,
    Status: <GridText col={4} content={transaction.__typename === 'WalletTransaction' ? `${invoiceStatus[transaction.status]}/${transaction.source === 'wallet' ? 'from-balance' : payStatus[transaction.source]}` : 'In-Progress'} />,
    Amount:  <GridText 
      col={3} 
      content={transaction.__typename === 'WalletTransaction' 
            ? `${currency}${transaction.amount}` 
            : (
              <>
                <Text content={`Amount: ${currency}${transaction.amount}`} />
                <Text content={`Pending Amount: ${currency}${transaction.pendingAmount}`} />
              </>
              )}
    />, 
    Balance: <GridText 
      col={3} 
      content={transaction.__typename === 'WalletTransaction' 
              ? `Bal: ${currency}${transaction.currentWalletBalance}` 
              : (
                  `Bal: ${currency}-${transaction.balance}`
              )}
    />,
  };
}

UserTransactionsList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  transaction: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired
};