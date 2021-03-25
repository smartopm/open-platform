import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import DataList from '../../../../shared/list/DataList';
import Text, { GridText } from '../../../../shared/Text';
import { dateToString } from '../../../../components/DateContainer';
import Label from '../../../../shared/label/Label';
import InvoiceDetails from '../InvoiceDetail';
import { invoiceStatus } from '../../../../utils/constants';
import { formatMoney, InvoiceStatusColor, propAccessor } from '../../../../utils/helpers';

const invoiceHeader = [
  { title: 'Issue Date', col: 4 },
  { title: 'Description', col: 4 },
  { title: 'Amount', col: 3 },
  { title: 'Payment Date', col: 3 },
  { title: 'Status', col: 4 }
];
export default function UserInvoiceItem({ invoice, currencyData }) {
  const [open, setOpen] = useState(false);
  if (!Object.keys(invoice).length) {
    return <Text content="No Invoice Available" align="center" />;
  }
  return (
    <div>
      <DataList
        keys={invoiceHeader}
        data={[renderInvoices(invoice, currencyData)]}
        hasHeader={false}
        clickable
        handleClick={() => setOpen(true)}
      />
      <InvoiceDetails
        detailsOpen={open}
        handleClose={() => setOpen(false)}
        data={invoice}
        currencyData={currencyData}
      />
    </div>
  );
}

export function renderInvoices(inv, currencyData) {
  return {
    'Issue Date': <GridText content={dateToString(inv.createdAt)} col={12} />,
    'Description': (
      <Grid item xs={12} md={2} data-testid="description">
        <Text content={`Invoice Number #${inv.invoiceNumber}`} />
        <br />
        <Text color='primary' content={`Plot Number #${inv.landParcel.parcelNumber}`} />
      </Grid>
    ),
    Amount: <GridText content={formatMoney(currencyData, inv.amount)} />,
    'Payment Date': (
      <Grid item xs={12} md={2}>
        {inv.status === 'paid' && inv.payments.length
          ? <Text content={dateToString(inv.payments[0]?.createdAt)} /> : '-'}
      </Grid>
    ),
    'Status': (
      <Grid item xs={12} md={2} data-testid="status">
        {new Date(inv.dueDate) < new Date().setHours(0,0,0,0) && inv.status === 'in_progress' ? (
          <Label
            title='Due'
            color='#B63422'
          />
        ) : (
          <Label
            title={propAccessor(invoiceStatus, inv.status)}
            color={propAccessor(InvoiceStatusColor, inv.status)}
          />
        ) }
      </Grid>
    ),
  };
}

UserInvoiceItem.propTypes = {
  invoice: PropTypes.shape({
    invoiceNumber: PropTypes.number,
    status: PropTypes.string,
    amount: PropTypes.number,
    createdAt: PropTypes.string
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};
