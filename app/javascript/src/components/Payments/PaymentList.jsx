import { Grid } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo';
import { PaymentsQuery } from '../../graphql/queries';
import Label from '../../shared/label/Label';
import DataList from '../../shared/list/DataList';
import { paymentStatus, paymentStatusColor } from '../../utils/constants';
import { formatError, propAccessor, useParamsQuery } from '../../utils/helpers';
import CenteredContent from '../CenteredContent';
import { dateToString } from '../DateContainer';

const paymentHeaders = [
  { title: 'Payment Type', col: 2 },
  { title: 'Amount', col: 2 },
  { title: 'Paid date', col: 1 },
  { title: 'Payment Status', col: 2 }
];

export default function PaymentList({ currency }) {
  const limit = 50;
  const path = useParamsQuery();
  const page = path.get('page');

  const pageNumber = Number(page);
  const { loading, data, error } = useQuery(PaymentsQuery, {
    variables: { limit, offset: pageNumber },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  if (loading) return 'loading ...';
  return (
    <div>
      <DataList 
        keys={paymentHeaders} 
        data={renderPayments(data?.payments, currency)}
        hasHeader={false}
      />
    </div>
  );
}

export function renderPayments(payments, currency) {
  return payments?.map(payment => {
    return {
      'Payment Type': (
        <Grid item xs={2} data-testid="parcel_number">
          {payment.paymentType}
        </Grid>
      ),
      Amount: (
        <Grid item xs={2}>
          <span>{`${currency}${payment.amount}`}</span>
        </Grid>
      ),
      'Paid date': (
        <Grid item xs={1}>
          {dateToString(payment.createdAt)}
        </Grid>
      ),
      'Payment Status': (
        <Grid item xs={2} data-testid="payment_status">
          <Label
            title={propAccessor(paymentStatus, payment.paymentStatus || 'pending')}
            color={propAccessor(paymentStatusColor, payment.paymentStatus || 'pending')}
          />
        </Grid>
      )
    };
  });
}

PaymentList.propTypes = {
    currency: PropTypes.string.isRequired,
}
