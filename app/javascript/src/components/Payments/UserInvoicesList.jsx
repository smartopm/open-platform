import React from 'react';
import PropTypes from 'prop-types';
import DataList from '../List/DataList';
import Text from '../List/Text';
import DateContainer, { dateToString } from '../DateContainer';

const invoiceHeader = [
  { title: 'Invoice Number', col: 2 },
  { title: 'Status', col: 3 },
  { title: 'Date Created', col: 3 },
  { title: 'Amount', col: 2 },
  { title: 'Balance', col: 2 }
];
export default function UserInvoicesList({ invoices }) {
  if (!invoices.length) {
    return <Text content="No Invoices" align="center" />;
  }
  return <DataList keys={invoiceHeader} data={renderInvoices(invoices)} />;
}

export function renderInvoices(data) {
  return data.map((invoice, count) => {
    return {
      'Invoice Number': <Text content={invoice.invoiceNumber || count + 1} />,
      Status: <Text content={`${invoice.status} on ${dateToString(invoice.updatedAt)}`} />,
      'Date Created': <DateContainer date={invoice.createdAt} />,
      Amount: <Text content={invoice.amount} />,
      Balance: <Text content={invoice.balance || 'Coming soon ...'} />
    };
  });
}

UserInvoicesList.propTypes = {
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.instanceOf(Date),
      updatedAt: PropTypes.instanceOf(Date),
      amount: PropTypes.number.isRequired,
      balance: PropTypes.number
    })
  ).isRequired
};
