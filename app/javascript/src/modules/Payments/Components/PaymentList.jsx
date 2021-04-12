/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { CSVLink } from "react-csv";
import { Grid, List } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useQuery, useLazyQuery } from 'react-apollo';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useHistory } from 'react-router';
import { TransactionsQuery, PaymentStatsDetails } from '../../../graphql/queries';
import DataList from '../../../shared/list/DataList';
import { formatError, formatMoney, useParamsQuery, handleQueryOnChange } from '../../../utils/helpers';
import CenteredContent from '../../../components/CenteredContent';
import { dateToString } from '../../../utils/dateutil';
import SearchInput from '../../../shared/search/SearchInput';
import useDebounce from '../../../utils/useDebounce';
import Paginate from '../../../components/Paginate';
import ListHeader from '../../../shared/list/ListHeader';
import {
        paymentType,
        paymentQueryBuilderConfig,
        paymentQueryBuilderInitialValue,
        paymentFilterFields } from '../../../utils/constants';
import TransactionDetails from './TransactionDetails';
import currency from '../../../shared/types/currency';
import Text from '../../../shared/Text';
import PaymentGraph from './PaymentGraph'
import { Spinner } from '../../../shared/Loading';
import QueryBuilder from '../../../components/QueryBuilder'

const paymentHeaders = [
  { title: 'User', col: 2 },
  { title: 'Deposit Date', col: 1},
  { title: 'Payment Type', col: 1 },
  { title: 'Amount', col: 2 }
];

const csvHeaders = [
  { label: "Amount", key: "amount" },
  { label: "Status", key: "status" },
  { label: "Created Date", key: "createdAt" },
  { label: "User Name", key: "user.name" },
  { label: "Phone Number", key: "user.phoneNumber" },
  { label: "Email", key: "user.email" },
  { label: "Transaction Type", key: "source" },
  { label: "Transaction Number", key: "transactionNumber" },
  { label: "External Id", key: "user.extRefId" },
  { label: "Receipt Number", key: "receiptNumber" }
];

export default function PaymentList({ currencyData }) {
  const limit = 50;
  const path = useParamsQuery();
  const page = path.get('page');
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const [listType, setListType] = useState('nongraph')
  const [query, setQuery] = useState('')
  const history = useHistory()
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [displayBuilder, setDisplayBuilder] = useState('none')
  const [searchQuery, setSearchQuery] = useState('')

  const pageNumber = Number(page);
  const { loading, data, error } = useQuery(TransactionsQuery, {
    variables: { limit, offset: pageNumber, query: debouncedValue || searchQuery},
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const  paymentList = data?.transactions?.filter((fil) => fil.destination === 'wallet' && fil.source !== 'invoice')

  function paginate(action) {
    if (action === 'prev') {
      if (pageNumber < limit) return;
      history.push(`/payments?tab=payment&page=${pageNumber - limit}`);
    } else if (action === 'next') {
      if (data?.transactions.length < limit) return;
      history.push(`/payments?tab=payment&page=${pageNumber + limit}`);
    }
  }

  function setGraphQuery(qu){
    setQuery(qu.trxDate)
    loadPaymentDetail()
    setListType('graph')
  }

  function setsearch(event){
    setSearchValue(event)
    setListType('nongraph')
  }

  function setSearchClear(){
    setSearchValue('')
    setListType('nongraph')
  }

  const [loadPaymentDetail, { error: statError, data: paymentStatData } ] = useLazyQuery(PaymentStatsDetails,{
    variables: { query },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none')
    } else {
      setDisplayBuilder('')
    }
  }

  function queryOnChange(selectedOptions) {
    setSearchQuery(handleQueryOnChange(selectedOptions, paymentFilterFields))
    setListType('nongraph')
  }

  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  if (statError) {
    return <CenteredContent>{formatError(statError.message)}</CenteredContent>;
  }
  return (
    <div>
      <SearchInput
        title='Payments'
        searchValue={searchValue}
        handleSearch={event => setsearch(event.target.value)}
        handleFilter={toggleFilterMenu}
        handleClear={() => setSearchClear()}
      />
      <Grid
        container
        justify="flex-end"
        style={{
              width: '100.5%',
              position: 'absolute',
              zIndex: 1,
              marginTop: '-2px',
              marginLeft: '-50px',
              display: displayBuilder
            }}
      >
        <QueryBuilder
          handleOnChange={queryOnChange}
          builderConfig={paymentQueryBuilderConfig}
          initialQueryValue={paymentQueryBuilderInitialValue}
          addRuleLabel="Add filter"
        />
      </Grid>
      <br />
      <br />
      <PaymentGraph handleClick={setGraphQuery} />
      {listType === 'graph' && paymentStatData?.paymentStatDetails?.length > 0 && (
        <CSVLink data={paymentStatData.paymentStatDetails} headers={csvHeaders} filename="payment-data.csv">Download CSV</CSVLink>
      )}
      {listType === 'nongraph' && paymentList?.length > 0 && (
        <CSVLink data={paymentList} headers={csvHeaders} filename="payment-data.csv">Download CSV</CSVLink>
      )}
      {loading ? (<Spinner />) : (
        <List>
          {listType === 'graph' && paymentStatData?.paymentStatDetails?.length > 0 ? (
            <div>
              {matches && <ListHeader headers={paymentHeaders} />}
              {
            paymentStatData.paymentStatDetails.map(payment => (
              <TransactionItem key={payment.id} transaction={payment} currencyData={currencyData} />
            ))
          }
            </div>
      ) : paymentList?.length > 0 ? (
        <div>
          {matches && <ListHeader headers={paymentHeaders} />}
          {
            paymentList.map(payment => (
              <TransactionItem key={payment.id} transaction={payment} currencyData={currencyData} />
            ))
          }
        </div>
      ) : (
        <CenteredContent>No Payments Available</CenteredContent>
      )}
        </List>
      )}
      {
          paymentList?.length >= limit && (
            <CenteredContent>
              <Paginate
                offSet={pageNumber}
                limit={limit}
                active={pageNumber >= 1}
                handlePageChange={paginate}
                count={data?.transactions?.length}
              />
            </CenteredContent>
          )
        }
    </div>
  );
}

export function renderPayment(payment, currencyData) {
    return [{
      'User': (
        <Grid item xs={12} md={2} data-testid="created_by">
          <Link to={`/user/${payment.user.id}?tab=Payments`} style={{ textDecoration: 'none'}}>
            <div style={{display: 'flex'}}>
              <Avatar src={payment.user.imageUrl} alt="avatar-image" />
              <span style={{margin: '7px', fontSize: '12px'}}>{payment.user.name}</span>
            </div>
          </Link>
        </Grid>
      ),
      'Deposit Date': (
        <Grid item xs={12} md={2}>
          <Text content={dateToString(payment.createdAt)} />
        </Grid>
      ),
      'Payment Type': (
        <Grid item xs={12} md={2} data-testid="payment_type">
          <Text content={
            ['cash'].includes(payment.source)
            ? 'Cash Deposit'
            :  paymentType[payment.source]
            }
          />
        </Grid>
      ),
      Amount: (
        <Grid item xs={12} md={2} data-testid="payment_amount">
          <span style={{fontSize: '12px'}}>{formatMoney(currencyData, payment.amount)}</span>
        </Grid>
      )
    }]
}


export function TransactionItem({transaction, currencyData}){
  const [detailsOpen, setDetailsOpen] = useState(false)
  return (
    <div>
      <TransactionDetails
        detailsOpen={detailsOpen}
        handleClose={() => setDetailsOpen(false)}
        data={transaction}
        currencyData={currencyData}
        // eslint-disable-next-line no-underscore-dangle
        title={`${transaction.__typename === 'WalletTransaction'? 'Transaction' : 'Invoice'}`}
      />
      <DataList
        keys={paymentHeaders}
        data={renderPayment(transaction, currencyData)}
        hasHeader={false}
        clickable
        handleClick={() => setDetailsOpen(true)}
      />
    </div>
  )
}

PaymentList.propTypes = {
  currencyData: PropTypes.shape({ ...currency }).isRequired
};

TransactionItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  transaction: PropTypes.object.isRequired,
  currencyData: PropTypes.shape({ ...currency }).isRequired
}
