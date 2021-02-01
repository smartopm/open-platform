import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import { TransactionsQuery } from '../../graphql/queries';
import Label from '../../shared/label/Label';
import DataList from '../../shared/list/DataList';
import { paymentStatus, paymentStatusColor } from '../../utils/constants';
import { formatError, propAccessor, useParamsQuery } from '../../utils/helpers';
import CenteredContent from '../CenteredContent';
import { dateToString } from '../DateContainer';
import SearchInput from '../../shared/search/SearchInput';
import useDebounce from '../../utils/useDebounce';
import { Spinner } from '../../shared/Loading';
import Paginate from '../Paginate';

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
  const debouncedValue = useDebounce(searchValue, 500);
  const history = useHistory()

  const pageNumber = Number(page);
  const { loading, data, error } = useQuery(TransactionsQuery, {
    variables: { limit, offset: pageNumber, query: debouncedValue},
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  function handleFilter(){}

  function paginate(action) {
    if (action === 'prev') {
      if (pageNumber < limit) return;
      history.push(`/payments?tab=payment&page=${pageNumber - limit}`);
    } else if (action === 'next') {
      if (data?.transactions.length < limit) return;
      history.push(`/payments?tab=payment&page=${pageNumber + limit}`);
    }
  }

  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  return (
    <div>
      <SearchInput 
        title='Payments' 
        searchValue={searchValue} 
        handleSearch={event => setSearchValue(event.target.value)} 
        handleFilter={handleFilter} 
      />
      <br />
      <br />
      {
          loading 
          ? <Spinner /> 
          : (
            <DataList
              keys={paymentHeaders}
              data={renderPayments(data?.transactions, currency)}
              hasHeader={false}
            />
          )
        }
      {
          data?.transactions.length >= limit && (
            <CenteredContent>
              <Paginate
                offSet={pageNumber}
                limit={limit}
                active={pageNumber >= 1}
                handlePageChange={paginate}
                count={data?.transactions.length}
              />
            </CenteredContent>
          )
        }
    </div>
  );
}

export function renderPayments(payments, currency) {
  return payments?.map(payment => {
    return {
      'CreatedBy': (
        <Grid item xs={4} md={2} data-testid="created_by">
          {payment.user.name}
        </Grid>
      ),
      Amount: (
        <Grid item xs={4} md={2}>
          <span>{`Paid ${currency}${payment.amount || 0}`}</span>
        </Grid>
      ),
      Balance: (
        <Grid item xs={4} md={2}>
          <span>{`Balance of ${currency}${payment.currentWalletBalance || 0}`}</span>
        </Grid>
      ),
      'Paid date': (
        <Grid item xs={4} md={2}>
          {dateToString(payment.createdAt)}
        </Grid>
      ),
      'Status': (
        <Grid item xs={4} md={2} data-testid="payment_status">
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
