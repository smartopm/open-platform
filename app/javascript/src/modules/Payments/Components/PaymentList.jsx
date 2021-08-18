/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable security/detect-object-injection */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CSVLink } from 'react-csv';
import { Button, Container, Grid, List, Typography, Hidden, IconButton } from '@material-ui/core';
import { MoreHorizOutlined } from '@material-ui/icons';
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
  InvoiceStatusColor,
  propAccessor,
  titleize,
  capitalize
} from '../../../utils/helpers';
import Label from '../../../shared/label/Label';
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
import { PlansPaymentsQuery, SubscriptionPlansQuery } from '../graphql/payment_query';
import PaymentModal from './UserTransactions/PaymentModal';
import { dateToString } from '../../../components/DateContainer';
import { StyledTabs, StyledTab, TabPanel, a11yProps } from '../../../components/Tabs';
import MenuList from '../../../shared/MenuList';
import SubscriptionPlanModal from './SubscriptionPlanModal';
import MessageAlert from '../../../components/MessageAlert';

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
  { label: 'External Id', key: 'user.extRefId' },
  { label: 'Formatted Date', key: 'formattedDate' }
];

export default function PaymentList({ currencyData }) {
  const { t } = useTranslation(['payment', 'common']);
  const limit = 50;
  const path = useParamsQuery();
  const classes = useStyles();
  const page = path.get('page');
  const type = path.get('type');
  const tab = path.get('tab');
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
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorElOpen = Boolean(anchorEl);
  const [message, setMessage] = useState({ isError: false, detail: '' });
  const [alertOpen, setAlertOpen] = useState(false);
  const [subData, setSubData] = useState(null);

  const menuList = [
    {
      content: t('actions.edit_subscription_plan'),
      isAdmin: true,
      color: '',
      handleClick: () => setSubscriptionModalOpen(true)
    }
  ];

  const TAB_VALUES = {
    payments: 0,
    plans: 1
  };

  const paymentHeaders = [
    {
      title: `${matches ? 'Client Info' : 'Client Name'}`,
      value: matches ? t('common:misc.client_info') : t('common:misc.client_name'),
      col: 2
    },
    { title: 'Payment Date', value: t('common:table_headers.payment_date'), col: 1 },
    { title: 'Payment Info', value: t('table_headers.payment_info'), col: 1 },
    {
      title: 'Receipt Number',
      value: t('table_headers.receipt_number'),
      col: 1,
      style: matches ? {} : { textAlign: 'right' }
    },
    { title: 'Status', value: t('table_headers.payment_status'), col: 2 }
  ];

  if (!matches) {
    paymentHeaders[1] = {
      title: 'Plot Info',
      value: t('table_headers.plot_info'),
      col: 1,
      style: { textAlign: 'right' }
    };
    [paymentHeaders[1], paymentHeaders[2]] = [paymentHeaders[2], paymentHeaders[1]];
  }

  const subscriptionPlanHeaders = [
    {
      title: 'Plan Type',
      value: t('table_headers.plan_type'),
      col: 2
    },
    { title: 'Start Date', value: t('common:table_headers.start_date'), col: 2 },
    {
      title: 'End Date',
      value: t('table_headers.end_date'),
      col: 2
    },
    { title: 'Amount', value: t('common:table_headers.amount'), col: 2 },
    { title: 'Status', value: t('common:table_headers.status'), col: 2 },
    { title: 'Menu', value: t('common:table_headers.menu'), col: 1 }
  ];

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

  const [
    loadSubscriptionPlans,
    {
      loading: subscriptionPlansLoading,
      data: subscriptionPlansData,
      refetch: subscriptionPlansRefetch
    }
  ] = useLazyQuery(SubscriptionPlansQuery, {
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

  function csvData(csv) {
    return csv.map(val => ({ ...val, formattedDate: dateToString(val.createdAt, 'MM-DD-YYYY')}))
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

  useEffect(() => {
    if (tab) {
      setTabValue(TAB_VALUES[tab]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, tab]);

  useEffect(() => {
    if (tab === 'plans') {
      loadSubscriptionPlans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDownloadCSV() {
    loadAllPayments();
  }

  function handlePaymentModal() {
    setPaymentModalOpen(false);
    history.push('/payments');
  }

  function handleTabValueChange(_event, newValue) {
    history.push(`?tab=${Object.keys(TAB_VALUES).find(key => TAB_VALUES[key] === newValue)}`);
    setTabValue(newValue);
    if (newValue === 1) loadSubscriptionPlans();
  }

  function handleSubscriptionMenu(event, subscription) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSubData(subscription);
  }

  function handleClose(event) {
    event.stopPropagation();
    setAnchorEl(null);
    setSubData(null);
  }

  const menuData = {
    menuList,
    handleSubscriptionMenu,
    anchorEl,
    open: anchorElOpen,
    handleClose
  };

  if (error) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }

  if (statError) {
    return <CenteredContent>{formatError(statError.message)}</CenteredContent>;
  }

  return (
    <div>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={alertOpen}
        handleClose={() => setAlertOpen(false)}
      />
      <StyledTabs
        value={tabValue}
        onChange={handleTabValueChange}
        aria-label="payment screen tabs"
        centered
      >
        <StyledTab label="Payments" {...a11yProps(0)} />
        <StyledTab label="Plans" {...a11yProps(1)} />
      </StyledTabs>
      <TabPanel value={tabValue} index={0}>
        <>
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
                      data={csvData(paymentStatData?.paymentStatDetails)}
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
                          data={plansData?.paymentsList.length > 0 ? csvData(plansData?.paymentsList) : []}
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
                  {matches && (
                    <div style={{ padding: '0 20px' }}>
                      <ListHeader headers={paymentHeaders} />
                    </div>
                  )}
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
                  {matches && (
                    <div style={{ padding: '0 20px' }}>
                      <ListHeader headers={paymentHeaders} />
                    </div>
                  )}
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
        </>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {subscriptionModalOpen && (
          <SubscriptionPlanModal
            open={subscriptionModalOpen}
            handleModalClose={() => setSubscriptionModalOpen(false)}
            subscriptionPlansRefetch={subscriptionPlansRefetch}
            setMessage={setMessage}
            openAlertMessage={() => setAlertOpen(true)}
            subscriptionData={subData}
          />
        )}
        {subscriptionPlansLoading ? (
          <Spinner />
        ) : subscriptionPlansData?.subscriptionPlans?.length === 0 ? (
          <CenteredContent>{t('errors.no_subscription_available')}</CenteredContent>
        ) : (
          <div>
            {matches && (
              <div style={{ padding: '0 20px' }}>
                <ListHeader headers={subscriptionPlanHeaders} />
              </div>
            )}
            {subscriptionPlansData?.subscriptionPlans?.map(sub => (
              <div style={{ padding: '0 20px' }} key={sub.id}>
                <DataList
                  keys={subscriptionPlanHeaders}
                  data={renderSubscriptionPlans(sub, currencyData, menuData)}
                  hasHeader={false}
                />
              </div>
            ))}
          </div>
        )}
        <Fab
          color="primary"
          variant="extended"
          className={classes.download}
          onClick={() => setSubscriptionModalOpen(true)}
        >
          {t('common:misc.new_plan')}
        </Fab>
      </TabPanel>
    </div>
  );
}

export function renderPayment(payment, currencyData, theme, matches) {
  return [
    {
      [`${matches ? 'Client Info' : 'Client Name'}`]: (
        <Grid item xs={12} md={2} data-testid="created_by">
          <Link
            to={`/user/${payment.user.id}?tab=Plans`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ display: 'flex' }}>
              <Avatar src={payment.user.imageUrl} alt="avatar-image" />
              <Typography style={{ margin: '7px', fontSize: '12px' }}>
                <Text color={matches ? 'primary' : 'inherit'} content={payment.user.name} />
                <Hidden smDown>
                  <br />
                  <Text
                    content={`${payment.paymentPlan?.landParcel.parcelType || ''} ${
                      payment.paymentPlan?.landParcel?.parcelType ? ' - ' : ''
                    } ${payment.paymentPlan?.landParcel.parcelNumber}`}
                  />
                </Hidden>
              </Typography>
            </div>
          </Link>
        </Grid>
      ),
      [`${matches ? 'Payment Date' : 'Plot Info'}`]: (
        <Grid item xs={12} md={2}>
          {matches ? (
            <Text content={dateToString(payment.createdAt)} />
          ) : (
            <Text
              content={`${payment.paymentPlan?.landParcel.parcelType || ''} ${
                payment.paymentPlan?.landParcel?.parcelType ? ' - ' : ''
              } ${payment.paymentPlan?.landParcel.parcelNumber}`}
            />
          )}
        </Grid>
      ),
      'Payment Info': (
        <Grid item xs={12} md={2} data-testid="payment_info">
          {matches ? (
            <Text content={formatMoney(currencyData, payment.amount)} />
          ) : (
            <Text
              content={`Paid ${formatMoney(currencyData, payment.amount)} on ${dateToString(
                payment.createdAt
              )}`}
            />
          )}
          <br />
          <Text
            content={
              ['cash'].includes(payment.userTransaction.source)
                ? 'Cash Deposit'
                : paymentType[payment.userTransaction.source]
            }
          />
        </Grid>
      ),
      'Receipt Number': (
        <Grid item xs={12} md={2} data-testid="receipt_number">
          <Text content={payment.receiptNumber || '-'} />
        </Grid>
      ),
      Status: (
        <Grid
          item
          xs={12}
          md={2}
          data-testid="payment_status"
          style={matches ? {} : { width: '90px' }}
        >
          <Label
            title={titleize(payment.status)}
            color={propAccessor(InvoiceStatusColor, payment?.status)}
          />
        </Grid>
      )
    }
  ];
}

export function renderSubscriptionPlans(subscription, currencyData, menuData) {
  return [
    {
      'Plan Type': (
        <Grid item xs={12} md={2} data-testid="plan_type">
          <Text content={titleize(subscription.planType)} />
        </Grid>
      ),
      'Start Date': (
        <Grid item xs={12} md={2} data-testid="start_date">
          <Text content={dateToString(subscription.startDate)} />
        </Grid>
      ),
      'End Date': (
        <Grid item xs={12} md={2} data-testid="end_date">
          <Text content={dateToString(subscription.endDate)} />
        </Grid>
      ),
      Amount: (
        <Grid item xs={12} md={2} data-testid="amount">
          <Text content={formatMoney(currencyData, subscription.amount)} />
        </Grid>
      ),
      Status: (
        <Grid item xs={12} md={2} data-testid="subscription_status" style={{ width: '90px' }}>
          <Label
            title={capitalize(subscription.status).split("_").join("")}
            color={propAccessor(InvoiceStatusColor, subscription?.status)}
          />
        </Grid>
      ),
      Menu: (
        <Grid item xs={12} md={1} data-testid="menu">
          <IconButton
            aria-controls="sub-menu"
            aria-haspopup="true"
            data-testid="subscription-plan-menu"
            dataid={subscription.id}
            onClick={event => menuData.handleSubscriptionMenu(event, subscription)}
          >
            <MoreHorizOutlined />
          </IconButton>
          <MenuList
            open={menuData.open && menuData?.anchorEl?.getAttribute('dataid') === subscription.id}
            anchorEl={menuData.anchorEl}
            handleClose={menuData.handleClose}
            list={menuData.menuList}
          />
        </Grid>
      )
    }
  ];
}

export function TransactionItem({ transaction, currencyData }) {
  const { t } = useTranslation(['payment', 'common']);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const paymentHeaders = [
    {
      title: `${matches ? 'Client Info' : 'Client Name'}`,
      value: matches ? t('common:misc.client_info') : t('common:misc.client_name'),
      col: 2
    },
    { title: 'Payment Date', value: t('common:table_headers.payment_date'), col: 1 },
    { title: 'Payment Info', value: t('table_headers.payment_info'), col: 1 },
    {
      title: 'Receipt Number',
      value: t('table_headers.receipt_number'),
      col: 1,
      style: matches ? {} : { textAlign: 'right' }
    },
    { title: 'Status', value: t('table_headers.payment_status'), col: 2 }
  ];

  if (!matches) {
    paymentHeaders[1] = {
      title: 'Plot Info',
      value: t('table_headers.plot_info'),
      col: 1,
      style: { textAlign: 'right' }
    };
    [paymentHeaders[1], paymentHeaders[2]] = [paymentHeaders[2], paymentHeaders[1]];
  }

  return (
    <div style={{ padding: '0 20px' }}>
      <DataList
        keys={paymentHeaders}
        data={renderPayment(transaction, currencyData, theme, matches)}
        hasHeader={false}
      />
    </div>
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
