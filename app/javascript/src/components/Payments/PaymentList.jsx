import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import { PaymentsQuery } from '../../graphql/queries';
import DataList from '../../shared/list/DataList';
import { formatError, useParamsQuery } from '../../utils/helpers';
import CenteredContent from '../CenteredContent';
import { dateToString } from '../DateContainer';
import SearchInput from '../../shared/search/SearchInput';
import useDebounce from '../../utils/useDebounce';
import { Spinner } from '../../shared/Loading';
import Paginate from '../Paginate';

const paymentHeaders = [
  { title: 'Paid date', col: 1 },
  { title: 'CreatedBy', col: 2 },
  { title: 'PaymentType', col: 1 },
  { title: 'Amount', col: 2 },
  { title: 'chequeNumber', col: 2 }
];

export default function PaymentList({ currency }) {
  const limit = 50;
  const path = useParamsQuery();
  const page = path.get('page');
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const history = useHistory()

  const pageNumber = Number(page);
  const { loading, data, error } = useQuery(PaymentsQuery, {
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
      if (data?.payments.length < limit) return;
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
              data={renderPayments(data?.payments, currency)}
              hasHeader={false}
            />
          )
        }
      {
          data?.payments.length >= limit && (
            <CenteredContent>
              <Paginate
                offSet={pageNumber}
                limit={limit}
                active={pageNumber >= 1}
                handlePageChange={paginate}
                count={data?.payments.length}
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
      'Paid date': (
        <Grid item xs={4} md={2}>
          {dateToString(payment.createdAt)}
        </Grid>
      ),
      'CreatedBy': (
        <Grid item xs={4} md={2} data-testid="created_by">
          {payment.user.name}
        </Grid>
      ),
      PaymentType: (
        <Grid item xs={4} md={2} data-testid="payment_type">
          <span>{payment.paymentType}</span>
        </Grid>
      ),
      Amount: (
        <Grid item xs={4} md={2}>
          <span>{`Paid ${currency}${payment.amount || 0}`}</span>
        </Grid>
      ),
      'chequeNumber': (
        <Grid item xs={4} md={2} data-testid="payment_cheque">
          <span>
            {
          // eslint-disable-next-line no-nested-ternary
          payment.paymentType === 'cash' 
            ? '-'
            : payment.chequeNumber ? `${payment.chequeNumber} - ${payment.bankName}` : '-'
          }
          </span>
        </Grid>
      )
    };
  });
}

PaymentList.propTypes = {
  currency: PropTypes.string.isRequired
};
