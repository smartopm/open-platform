import React from 'react'
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types'
import DetailHeading from './DetailHeading'
import ListHeader from '../../shared/list/ListHeader';
import Text from '../../shared/Text';
import { dateToString } from '../DateContainer';
import DataList from '../../shared/list/DataList';

export default function InvoiceStatDetails({ data, currency }){
  const invoiceHeaders = [
    { title: 'Client Name', col: 4 },
    { title: 'Invoice Description', col: 4 },
    { title: 'Date Issue/Due Date', col: 4 },
    { title: 'Amount', col: 4, align: true }
  ];
  return (
    <div style={{margin: '10px 125px 0 150px'}}>
      <DetailHeading title='Invoices' />
      <ListHeader headers={invoiceHeaders} />
      <DataList
        keys={invoiceHeaders}
        data={renderInvoices(data, currency)}
        hasHeader={false}
      />
    </div>
  )
}

export function renderInvoices(data, currency) {
  return data.map(invoice => {
    return {
      'Client Name': (
        <Grid item xs={4} md={2} data-testid="client_name">
          <Text content={invoice?.user?.name} />
        </Grid>
      ),
      'Invoice Description': (
        <Grid item xs={4} md={2} data-testid="description">
          <Text content={`Plot no: ${invoice?.landParcel?.parcelNumber}`} />
        </Grid>
      ),
      'Date Issue/Due Date': (
        <Grid item xs={4} md={2} data-testid="date">
          <Text content={`Date Issue: ${dateToString(invoice.createdAt)}`} /> 
          <br />
          <Text content={`Due Date ${dateToString(invoice.dueDate)}`} />
        </Grid>
      ),
      Amount: (
        <Grid item xs={4} md={1} data-testid="amount" style={{textAlign: 'right'}}>
          <Text content={`${currency}${invoice.amount}`} />
        </Grid>
      )
    };
  });
}

InvoiceStatDetails.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    dueDate: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    landParcel: PropTypes.shape({ parcelNumber: PropTypes.string.isRequired }),
    user: PropTypes.shape({ 
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
       })
  })).isRequired,
  currency: PropTypes.string.isRequired
}