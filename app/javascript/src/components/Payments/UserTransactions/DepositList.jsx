import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DataList from '../../../shared/list/DataList';
import Text, { GridText } from '../../../shared/Text';
import { dateToString } from '../../DateContainer';
import TransactionDetails from '../TransactionDetails'

const depositHeader = [
  { title: 'Amount', col: 1 },
  { title: 'Type', col: 1 },
  { title: 'Date Created', col: 1 }
];
export default function DepositList({ payment, currency }) {
  const [open, setOpen] = useState(false)
  if (!Object.keys(payment).length) {
    return <Text content="No Payment Available" align="center" />;
  }
  return (
    <div>
      <DataList keys={depositHeader} data={[renderDeposits(payment)]} hasHeader={false} clickable={{status: true}} handleClick={() => setOpen(true)} />
      <TransactionDetails 
        detailsOpen={open} 
        handleClose={() => setOpen(false)} 
        data={payment}
        currency={currency}
        title="Payment"
      />
    </div>
  )
}

export function renderDeposits(pay) {
    return {
      Amount: <GridText content={pay.amount} />,
      Type: <GridText content={pay.paymentType} />,
      'Date Created': <GridText content={`Paid on ${dateToString(pay.createdAt)}`} />
    };
}

DepositList.propTypes = {
  payment: PropTypes.shape({
          paymentType: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
          createdAt: PropTypes.string
    }).isRequired,
    currency: PropTypes.string.isRequired
};
