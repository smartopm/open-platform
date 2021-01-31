import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DataList from '../../shared/list/DataList';
import Text, { GridText } from '../../shared/Text';
import { dateToString } from '../DateContainer';
import { invoiceStatus } from '../../utils/constants';
import TransactionDetails from './TransactionDetails'

const invoiceHeader = [
  { title: 'Amount', col: 1 },
  { title: 'Status', col: 1 },
  { title: 'Date Created', col: 1 }
];
export default function InvoiceList({ invoice, currency }) {
  const [open, setOpen] = useState(false)
  if (!Object.keys(invoice).length) {
    return <Text content="No Invoice Available" align="center" />;
  }
  return (
    <div>
      <DataList keys={invoiceHeader} data={[renderInvoices(invoice)]} hasHeader={false} clickable={{status: true}} handleClick={() => setOpen(true)} />
      <TransactionDetails 
        detailsOpen={open} 
        handleClose={() => setOpen(false)} 
        data={invoice}
        currency={currency}
        title="Invoice"
      />
    </div>
    )
}

export function renderInvoices(inv) {
    return {
      Amount: <GridText content={inv.amount} />,
      Status: <GridText content={invoiceStatus[inv.status]} />,
      'Date Created': <GridText content={`Issued on ${dateToString(inv.createdAt)}`} />
    };
}

InvoiceList.propTypes = {
  invoice: PropTypes.shape({
          status: PropTypes.string,
          amount: PropTypes.number,
          createdAt: PropTypes.string
    }).isRequired,
  currency: PropTypes.string.isRequired 
};
