import React from 'react'
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types'
import DetailHeading from './DetailHeading'
import ListHeader from '../../shared/list/ListHeader';
import Text from '../../shared/Text';
import { dateToString } from '../DateContainer';
import DataList from '../../shared/list/DataList';

export default function PaymentStatDetails({ data, currency}) {
  const paymentHeaders = [
    { title: 'Payment Type', col: 4 },
    { title: 'Date Paid', col: 4 },
    { title: 'Payment made by', col: 4 },
    { title: 'Amount', col: 1, align: true },
  ];
  return (
    <div style={{margin: '10px 125px 0 150px'}}>
      <DetailHeading title='Payments' />
      <ListHeader headers={paymentHeaders} />
      <DataList
        keys={paymentHeaders}
        data={renderPayments(data, currency)}
        hasHeader={false}
      />
    </div>
  )
}

export function renderPayments(data, currency) {
  return data.map(pay => {
    return {
      'Payment Type': (
        <Grid item xs={4} md={2} data-testid="type">
          <Text content={pay.source} />
        </Grid>
      ),
      'Date Paid': (
        <Grid item xs={4} md={2} data-testid="date">
          <Text content={dateToString(pay.createdAt)} />
        </Grid>
      ),
      'Payment made by': (
        <Grid item xs={4} md={2} data-testid="user">
          <Text content={pay.user?.name} />
        </Grid>
      ),
      Amount: (
        <Grid item xs={1} md={1} data-testid="amount" style={{textAlign: 'right'}}>
          <Text content={`${currency}${pay.amount}`} />
        </Grid>
      ),
    };
  });
}

PaymentStatDetails.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    source: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({ 
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
       })
      })).isRequired,
  currency: PropTypes.string.isRequired
}