import React from 'react'
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types'
import DetailHeading from './DetailHeading'
import ListHeader from '../../shared/list/ListHeader';
import Text from '../../shared/Text';
import { dateToString } from '../DateContainer';
import DataList from '../../shared/list/DataList';
import currencyTypes from '../../shared/types/currency';
import { formatMoney } from '../../utils/helpers';

export default function InvoiceStatDetails({ data, currencyData }){
  const invoiceHeaders = [
    { title: 'Client Name', col: 4 },
    { title: 'Invoice Description', col: 4 },
    { title: 'Date Issue/Due Date', col: 4 },
    { title: 'Amount', col: 4 }
  ];
  return (
    <div>
      <DetailHeading title='Outstanding Invoices' />
      <ListHeader headers={invoiceHeaders} />
      <DataList
        keys={invoiceHeaders}
        data={renderInvoices(data, currencyData)}
        hasHeader={false}
      />
    </div>
  )
}

export function renderInvoices(data, currencyData) {
  return data.map(invoice => {
    return {
      'Client Name': (
        <Grid item xs={4} md={2} data-testid="client_name">
          <Link to={`/user/${invoice.user.id}?tab=Payments`} style={{ textDecoration: 'none'}}>
            <div style={{ display: 'flex' }}>
              <Avatar src={invoice.user?.imageUrl} alt="avatar-image" />
              <span style={{ margin: '7px' }}>{invoice.user?.name}</span>
            </div>
          </Link>
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
        <Grid item xs={4} md={2} data-testid="amount">
          <Text content={formatMoney(currencyData, invoice.amount)} />
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
  currencyData: PropTypes.shape({ ...currencyTypes }).isRequired
}