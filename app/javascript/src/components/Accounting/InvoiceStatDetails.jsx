import React from 'react'
import Grid from '@material-ui/core/Grid';
import DetailHeading from './DetailHeading'
import ListHeader from '../../shared/list/ListHeader';
import Text from '../../shared/Text';
import { dateToString } from '../DateContainer';

export default function InvoiceStatDetails({ data }){
  const invoiceHeaders = [
    { title: 'Client Name', col: 3 },
    { title: 'Invoice Description', col: 3 },
    { title: 'Date Issue/Date Paid', col: 4 },
    { title: 'Amount', col: 3 },
    { title: 'Due Date', col: 3 },
    { title: 'Status', col: 4 }
  ];
  return (
    <div style={{margin: '10px 125px 0 150px'}}>
      {console.log(data)}
      <DetailHeading title='Invoice' />
      <ListHeader headers={invoiceHeaders} />
    </div>
  )
}

export function renderInvoices(data, currency) {
  return data.map(invoice => {
    return {
      'Client Name': (
        <Grid item xs={2} md={2} data-testid="client_name">
          <Text content={invoice?.user?.name} />
        </Grid>
      ),
      'Invoice Description': (
        <Grid item xs={3} md={2} data-testid="created_by">
          <Text content={`Plot no: ${invoice?.landParcel?.parcelNumber}`} />
        </Grid>
      ),
      'Description': (
        <Grid item xs={4} md={2} data-testid="description">
          <Text content={`Invoice Number #${invoice.invoiceNumber}`} /> 
          <br />
          <Text color='primary' content={`Plot Number #${invoice.landParcel.parcelNumber}`} />
        </Grid>
      ),
      Amount: (
        <Grid item xs={3} md={2} data-testid="invoice_amount">
          <Text content={`${currency}${invoice.amount}`} />
        </Grid>
      ),
      'Payment Date': (
        <Grid item xs={3} md={2}>
          {invoice.status === 'paid' && invoice.payments.length
            ? <Text content={dateToString(invoice.payments[0]?.createdAt)} /> : '-'}
          
        </Grid>
      ),
      'Status': (
        <Grid item xs={4} md={2} data-testid="status">
          {new Date(invoice.dueDate) < new Date().setHours(0,0,0,0) && invoice.status === 'in_progress' ? (
            <Label
              title='Due'
              color='#B63422'
            />
          ) : (
            <Label
              title={propAccessor(invoiceStatus, invoice.status)}
              color={propAccessor(InvoiceStatusColor, invoice.status)}
            />
          ) }
        </Grid>
      )
    };
  });
}