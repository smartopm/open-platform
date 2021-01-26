import React from 'react';
import PropTypes from 'prop-types';
import DataList from '../../shared/list/DataList';
import Text, { GridText } from '../../shared/Text';
import { dateToString } from '../DateContainer';
import CenteredContent from '../CenteredContent';

const transactionHeader = [
  { title: 'Invoice Number', col: 1 },
  { title: 'Status', col: 1 },
  { title: 'Date Created', col: 1 },
  { title: 'Amount', col: 1 },
  { title: 'Balance', col: 1 }
];
export default function UserTransactionsList({ transactions, currency }) {
  if (!transactions.length) {
    return <CenteredContent><Text content="No Transactions Yet" align="justify" /></CenteredContent>
  }
  return <DataList keys={transactionHeader} data={renderTransactions(transactions, currency)} hasHeader={false} />;
}

export function renderTransactions(data, currency) {
  return data.map((transaction, count) => {
    return {
      'Invoice Number': <GridText col={1} content={`#${transaction.transactionNumber || count + 1}`} />,
      Status: <GridText col={3} content={`Updated to ${transaction.status} on ${dateToString(transaction.updatedAt)}`}  />,
      'Date Created': <GridText col={3} content={`Created on ${dateToString(transaction.createdAt)}`} />,
      Amount: <GridText content={`${currency}${transaction.amount}`} />,
      Balance: <GridText content={`Balance of ${currency}${transaction.currentWalletBalance || 0}`} />,
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
