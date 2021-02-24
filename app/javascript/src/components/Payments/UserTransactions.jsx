/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Tooltip } from '@material-ui/core';
import DataList from '../../shared/list/DataList';
import Text, { GridText } from '../../shared/Text';
import { dateToString } from '../DateContainer';
import CenteredContent from '../CenteredContent';
import Label from '../../shared/label/Label';
import TransactionDetails from './TransactionDetails'
import { formatMoney } from '../../utils/helpers';

const transactionHeader = [
  { title: 'Date Created', col: 1 },
  { title: 'Description', col: 1 },
  { title: 'Amount', col: 1 },
  { title: 'Balance', col: 1 },
  { title: 'Status', col: 1 }
];

export default function UserTransactionsList({ transaction, currencyData }) {
  const [open, setOpen] = useState(false)

  if (!Object.keys(transaction).length || Object.keys(transaction).length === 0) {
    return <CenteredContent><Text content="No Transactions Yet" align="justify" /></CenteredContent>
  }
  return (
    <div>
      <DataList 
        keys={transactionHeader} 
        data={[renderTransactions(transaction, currencyData)]} 
        hasHeader={false} 
        clickable
        handleClick={() => setOpen(true)} 
      />
      <TransactionDetails 
        detailsOpen={open} 
        handleClose={() => setOpen(false)} 
        data={transaction}
        currencyData={currencyData}
        title={`${transaction.__typename === 'WalletTransaction'? 'Transaction' : 'Invoice'}`}
      />
    </div>
  )
}

export function renderTransactions(transaction, currencyData) {
  return {
    'Date Created': <GridText col={4} content={transaction.__typename === 'WalletTransaction' ? `Deposit date ${dateToString(transaction.createdAt)}` : `Issue date ${dateToString(transaction.createdAt)}`} />,
    // eslint-disable-next-line no-nested-ternary
    Description: <GridText col={4} content={`${transaction.__typename !== 'WalletTransaction' ? `Invoice ${transaction.invoiceNumber}` : transaction.source === 'wallet' ? 'Invoice' : 'Deposit' }`} />,
    Amount: (
      <Grid item xs={3} md={2} data-testid="description">
        {transaction.__typename === 'WalletTransaction' ? (
          <Text content={formatMoney(currencyData, transaction.amount)} /> 
        ) : (
          <Tooltip placement="top" title="Pending Amount">
            <span style={{fontSize: '0.75rem'}}>{formatMoney(currencyData, transaction.pendingAmount)}</span>
          </Tooltip>
        )}
      </Grid>), 
    Balance: <GridText
      statusColor={transaction.__typename !== 'WalletTransaction' && '#D65252'}
      col={3} 
      content={transaction.__typename === 'WalletTransaction' 
              ? formatMoney(currencyData, transaction.currentWalletBalance)
              : (
                  `-${formatMoney(currencyData, transaction.balance)}`
              )}
    />,
    'Status': (
      <Grid item xs={4} md={2} data-testid="status">
        {transaction.__typename === 'WalletTransaction' ? (
          <Label
            title='Paid'
            color='#58B71B'
          />
        ) : (
          <Label
            title='Unpaid'
            color='#EF6F51'
          />
        )}
      </Grid>)
  };
}

UserTransactionsList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  transaction: PropTypes.object.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
};