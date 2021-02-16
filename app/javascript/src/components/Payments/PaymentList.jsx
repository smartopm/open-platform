import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import { TransactionsQuery } from '../../graphql/queries';
import DataList from '../../shared/list/DataList';
import { formatError, useParamsQuery } from '../../utils/helpers';
import CenteredContent from '../CenteredContent';
import { dateToString } from '../DateContainer';
import SearchInput from '../../shared/search/SearchInput';
import useDebounce from '../../utils/useDebounce';
import { Spinner } from '../../shared/Loading';
import Paginate from '../Paginate';
import ListHeader from '../../shared/list/ListHeader';
import { paymentType } from '../../utils/constants';

const paymentHeaders = [
  { title: 'User', col: 2 },
  { title: 'Deposit Date', col: 1 },
  { title: 'Payment Type', col: 1 },
  { title: 'Amount', col: 2 }
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

  let paymentList
  if (data?.transactions) {
    paymentList = data.transactions.filter((fil) => fil.destination === 'wallet')
  }

  function paginate(action) {
    if (action === 'prev') {
      if (pageNumber < limit) return;
      history.push(`/payments?tab=payment&page=${pageNumber - limit}`);
    } else if (action === 'next') {
      if (data?.transactions.length < limit) return;
      history.push(`/payments?tab=payment&page=${pageNumber + limit}`);
    }
  }

  if (loading) return <Spinner />
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
        handleClear={() => setSearchValue('')}
      />
      <br />
      <br />
      {paymentList.length && paymentList.length > 0 ? (
        <div>
          <ListHeader headers={paymentHeaders} />
          <DataList
            keys={paymentHeaders}
            data={renderPayments(paymentList, currency)}
            hasHeader={false}
          />
        </div>
      ) : (
        <CenteredContent>No Payments Available</CenteredContent>
      )}
      {
          paymentList.length >= limit && (
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
      'User': (
        <Grid item xs={2} md={2} data-testid="created_by">
          <div style={{display: 'flex'}}>
            <Avatar src={payment.user.imageUrl} alt="avatar-image" />
            <span style={{margin: '7px'}}>{payment.user.name}</span>
          </div>
        </Grid>
      ),
      'Deposit Date': (
        <Grid item xs={1} md={2}>
          {dateToString(payment.createdAt)}
        </Grid>
      ),
      'Payment Type': (
        <Grid item xs={4} md={2} data-testid="payment_type">
          <span>
            {
            ['cash'].includes(payment.source)
            ? 'Cash Deposit'
            :  paymentType[payment.source]
          }
          </span>
        </Grid>
      ),
      Amount: (
        <Grid item xs={4} md={2}>
          <span>{`${currency}${payment.amount || 0}`}</span>
        </Grid>
      )
    };
  });
}

PaymentList.propTypes = {
  currency: PropTypes.string.isRequired
};
