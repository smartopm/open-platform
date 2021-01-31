import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { TransactionsQuery } from '../../graphql/queries';
import Label from '../../shared/label/Label';
import DataList from '../../shared/list/DataList';
import { paymentStatus, paymentStatusColor } from '../../utils/constants';
import { formatError, propAccessor, useParamsQuery } from '../../utils/helpers';
import CenteredContent from '../CenteredContent';
import { dateToString } from '../DateContainer';
import SearchInput from '../../shared/search/SearchInput';

const paymentHeaders = [
  { title: 'CreatedBy', col: 2 },
  { title: 'Amount', col: 2 },
  { title: 'Balance', col: 1 },
  { title: 'Paid date', col: 1 },
  { title: 'Status', col: 2 }
];

export default function PaymentList({ currency }) {
  const limit = 50;
  const path = useParamsQuery();
  const page = path.get('page');
  const [searchValue, setSearchValue] = useState('');

  const pageNumber = Number(page);
  const { loading, data, error } = useQuery(TransactionsQuery, {
    variables: { limit, offset: pageNumber },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  function handleFilter(){}

  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  if (loading) return 'loading ...';
  return (
    <div>
      <SearchInput 
        title='Transactions' 
        searchValue={searchValue} 
        handleSearch={event => setSearchValue(event.target.value)} 
        handleFilter={handleFilter} 
      />
      <br />
      <br />
      <DataList
        keys={paymentHeaders}
        data={renderPayments(data?.transactions, currency)}
        hasHeader={false}
      />
    </div>
  );
}

export function renderPayments(payments, currency) {
  if (!payments.length) {
    return <CenteredContent>No Payments yet</CenteredContent>;
  }
  return payments?.map(payment => {
    return {
      'CreatedBy': (
        <Grid item xs={2} data-testid="parcel_number">
          {payment.user.name}
        </Grid>
      ),
      Amount: (
        <Grid item xs={2}>
          <span>{`Paid ${currency}${payment.amount || 0}`}</span>
        </Grid>
      ),
      Balance: (
        <Grid item xs={2}>
          <span>{`Balance of ${currency}${payment.currentWalletBalance || 0}`}</span>
        </Grid>
      ),
      'Paid date': (
        <Grid item xs={1}>
          {dateToString(payment.createdAt)}
        </Grid>
      ),
      'Status': (
        <Grid item xs={2} data-testid="payment_status">
          <Label
            title={propAccessor(paymentStatus, payment.status || 'pending')}
            color={propAccessor(paymentStatusColor, payment.status || 'pending')}
          />
        </Grid>
      )
    };
  });
}

PaymentList.propTypes = {
  currency: PropTypes.string.isRequired
};
