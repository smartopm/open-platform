import React from 'react';
import PropTypes from 'prop-types';
import DataList from '../List/DataList';
import Text from '../List/Text';
import DateContainer from '../DateContainer';

const depositHeader = [
  { title: 'Type', col: 2 },
  { title: 'Info', col: 4 },
  { title: 'Date Created', col: 2 },
  { title: 'Amount', col: 2 },
  { title: 'Balance', col: 2 }
];
export default function DepositList({ transactions }) {
  if (!transactions.length) {
    return <Text content="No deposits available yet" align="center" />;
  }
  return <DataList keys={depositHeader} data={renderDeposits(transactions)} />;
}

export function renderDeposits(transactions) {
  return transactions.map(transaction => {
    return {
      Type: <Text content={transaction.type} />,
      Info: <Text content={transaction.info} />,
      'Date Created': <DateContainer data={transaction.created} />,
      Amount: <Text content={transaction.amount} />,
      Balance: <Text content={transaction.balance} />
    };
  });
}

DepositList.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      info: PropTypes.string.isRequired,
      createdAt: PropTypes.instanceOf(Date),
      amount: PropTypes.number.isRequired,
      balance: PropTypes.number
    })
  ).isRequired
};
