/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CSVLink } from 'react-csv';
import { Button, Container, Grid, List, Typography } from '@material-ui/core';
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
import PaymentModal from './UserTransactions/PaymentModal';
import { dateToString } from '../../../components/DateContainer';

const csvHeaders = [
  { label: 'Receipt Number', key: 'receiptNumber' },
  { label: 'Payment Status', key: 'status' },
  { label: 'Payment Amount', key: 'userTransaction.amount' },
  { label: 'Payment Date', key: 'createdAt' },
  { label: 'Payment Type', key: 'userTransaction.source' },
  { label: 'Transaction Number', key: 'userTransaction.transactionNumber' },
  { label: 'Plot Type', key: 'paymentPlan.landParcel.parcelType' },
  { label: 'Plot Number', key: 'paymentPlan.landParcel.parcelNumber' },
  { label: 'Client Name', key: 'user.name' },
  { label: 'Phone Number', key: 'user.phoneNumber' },
  { label: 'Email', key: 'user.email' },
  { label: 'External Id', key: 'user.extRefId' }
];

export default function PaymentList({ currencyData }) {
  const { t } = useTranslation(['payment', 'common']);
  const paymentHeaders = [
    { title: 'Client Name', value: t('common:misc.client_name'), col: 1 },
    { title: 'Payment Date', value: t('common:table_headers.payment_date'), col: 1 },
    { title: 'Payment Amount', value: t('table_headers.payment_amount'), col: 1 },
    { title: 'Plot Info', value: t('table_headers.plot_info'), col: 1 },
    { title: 'Payment Type', value: t('common:form_fields.payment_Type'), col: 1 },
    { title: 'PaymentStatus/ReceiptNumber', value: t('table_headers.payment_receipt_status'), col: 2 }
  ];
  const limit = 50;
  const path = useParamsQuery();
  const classes = useStyles();
  const page = path.get('page');
  const type = path.get('type');
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const [listType, setListType] = useState('nongraph');
  const [query, setQuery] = useState('');
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [displayBuilder, setDisplayBuilder] = useState('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const pageNumber = Number(page);
  const { loading, data, error, refetch } = useQuery(PlansPaymentsQuery, {
    variables: { limit, offset: pageNumber, query: debouncedValue || searchQuery },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const [loadAllPayments, { loading: plansLoading, data: plansData, called }] = useLazyQuery(
    PlansPaymentsQuery,
    {
      // TODO: have a separate query with no limits
      variables: { limit: 2000, query: debouncedValue || searchQuery },
      errorPolicy: 'all'
    }
  );

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

  useEffect(() => {
    if (type === 'new') {
      setPaymentModalOpen(true);
    }
  }, [type]);

  function handleDownloadCSV() {
    loadAllPayments();
  }

  function handlePaymentModal() {
    setPaymentModalOpen(false);
    history.push('/payments');
  }

  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  if (statError) {
    return <CenteredContent>{formatError(statError.message)}</CenteredContent>;
  }

  return (
    <div>
      <PaymentModal
        open={paymentModalOpen}
        handleModalClose={handlePaymentModal}
        currencyData={currencyData}
        refetch={refetch}
      />
      <Container maxWidth="xl">
        <Grid container direction="row" spacing={2}>
          <Grid item sm={9} xs={12}>
            <SearchInput
              title={t('common:misc.payments')}
              searchValue={searchValue}
              handleSearch={event => setsearch(event.target.value)}
              handleFilter={toggleFilterMenu}
              handleClear={() => setSearchClear()}
            />
          </Grid>
          <Grid item sm={3} xs={12}>
            <Button variant="outlined" className={classes.exportDataBtn}>
              {listType === 'graph' && paymentStatData?.paymentStatDetails?.length > 0 ? (
                <CSVLink
                  data={paymentStatData?.paymentStatDetails}
                  style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                  headers={csvHeaders}
                  filename={`payment-data-${dateToString(new Date())}.csv`}
                >
                  {t('actions.download_csv')}
                </CSVLink>
              ) : (
                <>
                  {!called ? (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <span role="button" aria-label="download csv" onClick={handleDownloadCSV}>
                      {plansLoading ? <Spinner /> : t('actions.export_data')}
                    </span>
                  ) : (
                    <CSVLink
                      data={plansData?.paymentsList || []}
                      style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                      headers={csvHeaders}
                      filename={`payment-data-${dateToString(new Date())}.csv`}
                    >
                      {plansLoading ? <Spinner /> : t('actions.save_csv')}
                    </CSVLink>
                  )}
                </>
              )}
            </Button>
          </Grid>
        </Grid>
      </Container>
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
          addRuleLabel={t('common:misc.add_filter')}
        />
      </Grid>
      <br />
      <br />
      <PaymentGraph handleClick={setGraphQuery} />
      <Fab
        color="primary"
        variant="extended"
        className={classes.download}
        onClick={() => setPaymentModalOpen(true)}
      >
        {t('common:misc.make_payment')}
      </Fab>

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
            <CenteredContent>{t('errors.no_payment_available')}</CenteredContent>
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
          <Link to={`/user/${payment.user.id}?tab=Plans`} style={{ textDecoration: 'none' }}>
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
            content={`${(payment.paymentPlan?.landParcel.parcelType || '')} ${payment.paymentPlan
              ?.landParcel?.parcelType ? ' - ' : ''} ${payment.paymentPlan?.landParcel.parcelNumber}`}
          />
        </Grid>
      ),
      'Payment Type': (
        <Grid item xs={12} md={2} data-testid="payment_type">
          <Text
            content={
              ['cash'].includes(payment.userTransaction.source)
                ? 'Cash Deposit'
                : paymentType[payment.userTransaction.source]
            }
          />
        </Grid>
      ),
      'PaymentStatus/ReceiptNumber': (
        <Grid item xs={12} md={2} data-testid="receipt_number">
          <Text content={`${titleize(payment.status)} - ${payment.receiptNumber}`} />
        </Grid>
      )
    }
  ];
}

export function TransactionItem({ transaction, currencyData }) {
  const { t } = useTranslation(['payment', 'common']);
  const paymentHeaders = [
    { title: 'Client Name', value: t('common:misc.client_name'), col: 1 },
    { title: 'Payment Date', value: t('common:table_headers.payment_date'), col: 1 },
    { title: 'Payment Amount', value: t('table_headers.payment_amount'), col: 1 },
    { title: 'Plot Info', value: t('table_headers.plot_info'), col: 1 },
    { title: 'Payment Type', value: t('common:form_fields.payment_Type'), col: 1 },
    { title: 'PaymentStatus/ReceiptNumber', value: t('table_headers.payment_receipt_status'), col: 2 }
  ];
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
  },
  exportDataBtn: {
    height: 53
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
