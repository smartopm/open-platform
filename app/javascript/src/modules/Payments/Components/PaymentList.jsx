/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { Grid, List, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useQuery, useLazyQuery } from 'react-apollo';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useHistory } from 'react-router';
import { PaymentStatsDetails } from '../../../graphql/queries';
import DataList from '../../../shared/list/DataList';
import {
  formatError,
  formatMoney,
  useParamsQuery,
  handleQueryOnChange,
  titleize
} from '../../../utils/helpers';
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
  paymentFilterFields
} from '../../../utils/constants';
import currency from '../../../shared/types/currency';
import Text from '../../../shared/Text';
import PaymentGraph from './PaymentGraph';
import { Spinner } from '../../../shared/Loading';
import QueryBuilder from '../../../components/QueryBuilder';
import { PlansPaymentsQuery } from '../graphql/payment_query';

const paymentHeaders = [
  { title: 'Client Name', col: 1 },
  { title: 'Payment Date', col: 1 },
  { title: 'Payment Amount', col: 1 },
  { title: 'Plot Info', col: 1 },
  { title: 'Payment Type', col: 1 },
  { title: 'PaymentStatus/ReceiptNumber', col: 2 }
];
const csvHeaders = [
  { label: 'Client Name', key: 'user.name' },
  { label: 'Phone Number', key: 'user.phoneNumber' },
  { label: 'Email', key: 'user.email' },
  { label: 'Payment Date', key: 'createdAt' },
  { label: 'Payment Amount', key: 'userTransaction.amount' },
  { label: "Receipt Number", key: "receiptNumber" },
  { label: 'Payment Status', key: 'status' },
  { label: 'Payment Type', key: 'userTransaction.source' },
  { label: 'Plot Number', key: 'paymentPlan.landParcel.parcelNumber' },
];

export default function PaymentList({ currencyData }) {
  const limit = 50;
  const path = useParamsQuery();
  const classes = useStyles();
  const page = path.get('page');
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const [listType, setListType] = useState('nongraph');
  const [query, setQuery] = useState('');
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [displayBuilder, setDisplayBuilder] = useState('none');
  const [searchQuery, setSearchQuery] = useState('');

  const pageNumber = Number(page);
  const { loading, data, error } = useQuery(PlansPaymentsQuery, {
    variables: { limit, offset: pageNumber, query: debouncedValue || searchQuery },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const paymentList = data?.paymentsList;

  function paginate(action) {
    if (action === 'prev') {
      if (pageNumber < limit) return;
      history.push(`/payments?page=${pageNumber - limit}`);
    } else if (action === 'next' && paymentList.length) {
      if (paymentList.length < limit) return;
      history.push(`/payments?page=${pageNumber + limit}`);
    }
  }

  function setGraphQuery(qu) {
    setQuery(qu.trxDate);
    loadPaymentDetail();
    setListType('graph');
  }

  function setsearch(event) {
    setSearchValue(event);
    setListType('nongraph');
  }

  function setSearchClear() {
    setSearchValue('');
    setListType('nongraph');
  }

  const [loadPaymentDetail, { error: statError, data: paymentStatData }] = useLazyQuery(
    PaymentStatsDetails,
    {
      variables: { query },
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network'
    }
  );

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none');
    } else {
      setDisplayBuilder('');
    }
  }

  function queryOnChange(selectedOptions) {
    setSearchQuery(handleQueryOnChange(selectedOptions, paymentFilterFields));
    setListType('nongraph');
  }

  useEffect(() => {
    if (history.location?.state?.from === 'dashboard') {
      setListType('graph');
      setQuery(history.location?.state?.query);
      loadPaymentDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  if (statError) {
    return <CenteredContent>{formatError(statError.message)}</CenteredContent>;
  }

  return (
    <div>
      <SearchInput
        title="Payments"
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
          marginLeft: '-300px',
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
        <Fab color="primary" variant="extended" className={classes.download}>
          <CSVLink
            data={paymentStatData?.paymentStatDetails}
            style={{ color: 'white' }}
            headers={csvHeaders}
            filename={`payment-data-${dateToString(new Date())}.csv`}
          >
            Download CSV
          </CSVLink>
        </Fab>
      )}
      {listType === 'nongraph' && paymentList?.length > 0 && (
        <Fab color="primary" variant="extended" className={classes.download}>
          <CSVLink
            data={paymentList}
            style={{ color: 'white' }}
            headers={csvHeaders}
            filename={`payment-data-${dateToString(new Date())}.csv`}
          >
            Download CSV
          </CSVLink>
        </Fab>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <List>
          {listType === 'graph' && paymentStatData?.paymentStatDetails?.length > 0 ? (
            <div>
              {matches && <ListHeader headers={paymentHeaders} />}
              {paymentStatData.paymentStatDetails.map(payment => (
                <TransactionItem
                  key={payment.id}
                  transaction={payment}
                  currencyData={currencyData}
                />
              ))}
            </div>
          ) : paymentList?.length > 0 ? (
            <div>
              {matches && <ListHeader headers={paymentHeaders} />}
              {paymentList.map(payment => (
                <TransactionItem
                  key={payment.id}
                  transaction={payment}
                  currencyData={currencyData}
                />
              ))}
            </div>
          ) : (
            <CenteredContent>No Payments Available</CenteredContent>
          )}
        </List>
      )}

      <CenteredContent>
        <Paginate
          offSet={pageNumber}
          limit={limit}
          active={pageNumber >= 1}
          handlePageChange={paginate}
          count={data?.paymentsList?.length}
        />
      </CenteredContent>
    </div>
  );
}

export function renderPayment(payment, currencyData) {
  return [
    {
      'Client Name': (
        <Grid item xs={12} md={2} data-testid="created_by">
          <Link to={`/user/${payment.user.id}?tab=Payments`} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex' }}>
              <Avatar src={payment.user.imageUrl} alt="avatar-image" />
              <Typography color="primary" style={{ margin: '7px', fontSize: '12px' }}>
                {payment.user.name}
              </Typography>
            </div>
          </Link>
        </Grid>
      ),
      'Payment Date': (
        <Grid item xs={12} md={2}>
          <Text content={dateToString(payment.createdAt)} />
        </Grid>
      ),
      'Payment Amount': (
        <Grid item xs={12} md={2} data-testid="payment_amount">
          <Text content={formatMoney(currencyData, payment.userTransaction.amount)} />
        </Grid>
      ),
      'Plot Info': (
        <Grid item xs={12} md={2} data-testid="plot_info">
          <Text
            content={`${payment.paymentPlan?.landParcel.parcelType} - ${payment.paymentPlan?.landParcel.parcelNumber}`}
          />
        </Grid>
      ),
      'Payment Type': (
        <Grid item xs={12} md={2} data-testid="payment_type">
          <Text
            content={
              ['cash'].includes(payment.userTransaction.source) ? 'Cash Deposit' : paymentType[payment.userTransaction.source]
            }
          />
        </Grid>
      ),
      'PaymentStatus/ReceiptNumber': (
        <Grid item xs={12} md={2} data-testid="receipt_number">
          <Text
            content={`${titleize(payment.status)} - ${
              payment.receiptNumber
            }`}
          />
        </Grid>
      )
    }
  ];
}

export function TransactionItem({ transaction, currencyData }) {
  return (
    <DataList
      keys={paymentHeaders}
      data={renderPayment(transaction, currencyData)}
      hasHeader={false}
    />
  );
}

const useStyles = makeStyles(() => ({
  download: {
    boxShadow: 'none',
    position: 'fixed',
    bottom: 30,
    right: 57,
    marginLeft: '30%',
    zIndex: '1000'
  }
}));

PaymentList.propTypes = {
  currencyData: PropTypes.shape({ ...currency }).isRequired
};

TransactionItem.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  transaction: PropTypes.object.isRequired,
  currencyData: PropTypes.shape({ ...currency }).isRequired
};
