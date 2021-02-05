import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DataList from '../../shared/list/DataList';
import Text, { GridText } from '../../shared/Text';
import { dateToString } from '../DateContainer';
import { invoiceStatus } from '../../utils/constants';
import InvoiceDetails from './InvoiceDetail';

const invoiceHeader = [
  { title: 'Date Created', col: 1 },
  { title: 'Amount', col: 1 },
  { title: 'Status', col: 1 },
  { title: 'Plot Number', col: 1 },
];
export default function UserInvoiceItem({ invoice, currency }) {
  const [open, setOpen] = useState(false);
  if (!Object.keys(invoice).length) {
    return <Text content="No Invoice Available" align="center" />;
  }
  return (
    <div>
      <DataList
        keys={invoiceHeader}
        data={[renderInvoices(invoice)]}
        hasHeader={false}
        clickable
        handleClick={() => setOpen(true)}
      />
      <InvoiceDetails
        detailsOpen={open}
        handleClose={() => setOpen(false)}
        data={invoice}
        currency={currency}
      />
    </div>
  );
}

export function renderInvoices(inv) {
  return {
    'Date Created': <GridText content={`Issued on ${dateToString(inv.createdAt)}`} />,
    Status: <GridText content={inv.status === 'paid' ? `Paid on ${dateToString(inv.updatedAt)}` : invoiceStatus[inv.status]} />,
    Amount: <GridText content={inv.amount} />,
    'Plot Number': <GridText content={inv.landParcel.parcelNumber} />
  };
}

UserInvoiceItem.propTypes = {
  invoice: PropTypes.shape({
    status: PropTypes.string,
    amount: PropTypes.number,
    createdAt: PropTypes.string
  }).isRequired,
  currency: PropTypes.string.isRequired
};
