import React from 'react';
import PropTypes from 'prop-types';
import DataList from '../../shared/list/DataList';
import Text, { GridText } from '../../shared/Text';
import { dateToString } from '../DateContainer';
import { invoiceStatus } from '../../utils/constants';

const invoiceHeader = [
  { title: 'Invoice Number', col: 1 },
  { title: 'Status', col: 1 },
  { title: 'Date Created', col: 1 },
  { title: 'Amount', col: 1 },
  { title: 'Balance', col: 1 }
];
export default function UserInvoicesList({ invoices }) {
  if (!invoices.length) {
    return <Text content="No Invoices" align="center" />;
  }
  return <DataList keys={invoiceHeader} data={renderInvoices(invoices)} hasHeader={false} />;
}

export function renderInvoices(data) {
  return data.map((invoice, count) => {
    return {
      'Invoice Number': <GridText col={1} content={`#${invoice.invoiceNumber || count + 1}`} />,
      Status: <GridText col={3} content={`Updated to ${invoiceStatus[invoice.status]} on ${dateToString(invoice.updatedAt)}`}  />,
      'Date Created': <GridText content={`Created on ${dateToString(invoice.createdAt)}`} />,
      Amount: <GridText content={invoice.amount} />,
      Balance: <GridText content={invoice.balance || 'Coming soon ...'} />
    };
  });
}

UserInvoicesList.propTypes = {
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      balance: PropTypes.number
    })
  ).isRequired
};
