/* eslint-disable no-nested-ternary */
import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, IconButton, Fab } from '@material-ui/core';
import { MoreHorizOutlined } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation } from 'react-apollo';
import { CSVLink } from 'react-csv';
import DataList from '../../../shared/list/DataList';
import {
  formatMoney,
  InvoiceStatusColor,
  titleize,
  capitalize,
  objectAccessor,
  formatError,
  handleQueryOnChange
} from '../../../utils/helpers';
import Label from '../../../shared/label/Label';
import CenteredContent from '../../../components/CenteredContent';
import Paginate from '../../../components/Paginate';
import ListHeader from '../../../shared/list/ListHeader';
import Text from '../../../shared/Text';
import { Spinner } from '../../../shared/Loading';
import { dateToString } from '../../../components/DateContainer';
import MenuList from '../../../shared/MenuList';
import SubscriptionPlanModal from './SubscriptionPlanModal';
import ButtonComponent from '../../../shared/buttons/Button';
import PlanListItem from './PlanListItem';
import { ActionDialog } from '../../../components/Dialog';
import { PaymentReminderMutation } from '../graphql/payment_plan_mutations';
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider';
import SearchInput from '../../../shared/search/SearchInput';
import QueryBuilder from '../../../components/QueryBuilder';
import {
  planQueryBuilderConfig,
  planQueryBuilderInitialValue,
  planFilterFields
} from '../../../utils/constants';

export function PlansList({
  matches,
  currencyData,
  communityPlansLoading,
  communityPlans,
  setDisplaySubscriptionPlans,
  setMessage,
  setAlertOpen
}){
  const { t } = useTranslation(['payment', 'common']);
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const classes = useStyles();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [createPaymentRemider] = useMutation(PaymentReminderMutation);
  const [paymentPlan, setPaymentPlan] = useState(null);
  const [mutationLoading, setMutationLoading] = useState(false);
  const authState = useContext(AuthStateContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorElOpen = Boolean(anchorEl);

  const menuList = [
    {
      content: t('misc.payment_reminder'),
      isAdmin: true,
      handleClick: () => setConfirmationModalOpen(true)
    }
  ]
  const menuData = {
    menuList,
    handleMenuClick,
    anchorEl,
    open: anchorElOpen,
    userType: authState?.user?.userType,
    handleClose: () => handleMenuClose()
  }

  const csvHeaders = [
    { label: 'Parcel Type', key: 'landParcel.parcelType' },
    { label: 'Parcel Number', key: 'landParcel.parcelNumber' },
    { label: 'User Name', key: 'user.name' },
    { label: 'User Email', key: 'user.email' },
    { label: 'Start Date', key: 'formattedStartDate' },
    { label: 'End Date', key: 'formattedEndDate' },
    { label: 'Plan Value', key: 'planValue' },
    { label: 'Installment Amount', key: 'installmentAmount' },
    { label: 'Amount Paid', key: 'totalPayments' },
    { label: 'Expected Payments', key: 'expectedPayments' },
    { label: 'Owing Amount', key: 'owingAmount' },
    { label: 'Installments Due', key: 'installmentsDue' },
    { label: 'Pending Balance', key: 'pendingBalance' },
    { label: 'Status', key: 'planStatus' }
  ];

  function formattedCsvData(csvData) {
    return csvData.map(val =>({
      ...val, formattedStartDate: dateToString(val.startDate, 'MM-DD-YYYY'), formattedEndDate: dateToString(val.endDate, 'MM-DD-YYYY') 
    }))
  }

  function handleMenuClose() {
    setAnchorEl(null);
    setPaymentPlan(null);
  }

  function handleMenuClick(event, plan) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setPaymentPlan(plan);
  }

  function handleAfterMutation() {
    setMutationLoading(false);
    setAlertOpen(true);
    setConfirmationModalOpen(false);
    setAnchorEl(null);
  }

  function sendPaymentReminderMail() {
    setMutationLoading(true);
    createPaymentRemider({
      variables: {userId: paymentPlan?.user.id, paymentPlanId: paymentPlan.id}
    })
    .then(() => {
      setMessage({ isError: false, detail: t('misc.email_sent') });
      handleAfterMutation();
    })
    .catch(error => {
      setMessage({ isError: true, detail: formatError(error.message) });
      handleAfterMutation();
    })
  }
  const [searchValue, setSearchValue] = useState('');
  const [displayBuilder, setDisplayBuilder] = useState('none');
  const [searchQuery, setSearchQuery] = useState('');

  function paginatePlans(action) {
    if (action === 'prev') {
      if (offset < limit) return;
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  function toggleFilterMenu() {
    if (displayBuilder === '') {
      setDisplayBuilder('none');
    } else {
      setDisplayBuilder('');
    }
  }

  function queryOnChange(selectedOptions) {
    setSearchQuery(handleQueryOnChange(selectedOptions, planFilterFields));
  }

  return (
    <div>
      <Fab color="primary" variant="extended" className={classes.download} data-testid="csv-fab">
        <CSVLink
          data={formattedCsvData(communityPlans) || []}
          style={{ color: 'white' }}
          headers={csvHeaders}
          filename={`payment-plans-data-${dateToString(new Date())}.csv`}
        >
          {communityPlansLoading ? <Spinner /> : t('actions.download_csv')}
        </CSVLink>
      </Fab>
      <ActionDialog
        open={confirmationModalOpen}
        type="confirm"
        message={t('misc.email_confirmation', { parcel_number: paymentPlan?.landParcel?.parcelNumber })}
        handleClose={() => setConfirmationModalOpen(false)}
        handleOnSave={sendPaymentReminderMail}
        disableActionBtn={mutationLoading}
      />
      {communityPlansLoading ? (
        <Spinner />
      ) : communityPlans?.length === 0 ? (
        <CenteredContent>{t('errors.no_plan_available')}</CenteredContent>
      ) : (
        <>
          {console.log(searchQuery)}
          <SearchInput
            title={t('common:misc.plans')}
            searchValue={searchValue}
            handleSearch={event => setSearchValue(event.target.value)}
            handleFilter={toggleFilterMenu}
            handleClear={() => setSearchValue('')}
          />
          <Grid
            container
            justify="flex-end"
            style={{
              width: '100.5%',
              position: 'absolute',
              zIndex: 1,
              marginTop: '-2px',
              marginLeft: '0px',
              display: displayBuilder
            }}
          >
            <QueryBuilder
              handleOnChange={queryOnChange}
              builderConfig={planQueryBuilderConfig}
              initialQueryValue={planQueryBuilderInitialValue}
              addRuleLabel={t('common:misc.add_filter')}
            />
          </Grid>
          <div className={classes.planList}>
            <div>
              <div
                style={
                  matches
                    ? {
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                      }
                    : null
                }
              >
                <Typography className={matches ? classes.plan : classes.planMobile}>
                  {t('common:misc.plans')}
                </Typography>
                <div
                  style={
                    matches
                      ? {
                          display: 'flex',
                          width: '100%',
                          justifyContent: 'flex-end',
                          marginBottom: '5px'
                        }
                      : { display: 'flex', marginBottom: '5px' }
                  }
                >
                  <div>
                    <ButtonComponent
                      color="default"
                      variant="outlined"
                      buttonText="View All Subscription Plans"
                      handleClick={() => setDisplaySubscriptionPlans(true)}
                      size="small"
                      style={matches ? {} : { fontSize: '10px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {communityPlans?.slice(offset, limit + offset - 1).map(plan => (
              <div
                className={classes.body}
                style={matches ? {} : { marginTop: '30px' }}
                key={plan.id}
              >
                <PlanListItem data={plan} currencyData={currencyData} menuData={menuData} />
              </div>
            ))}
          </div>
        </>
      )}
      <CenteredContent>
        <Paginate
          offSet={offset}
          limit={limit}
          active={offset >= 1}
          handlePageChange={paginatePlans}
          count={communityPlans?.length}
        />
      </CenteredContent>
    </div>
  );
}

export function SubscriptionPlans({
  matches,
  setMessage,
  setAlertOpen,
  currencyData,
  subscriptionPlansLoading,
  subscriptionPlansData,
  subscriptionPlansRefetch,
  setDisplaySubscriptionPlans
}) {
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [subData, setSubData] = useState(null);
  const { t } = useTranslation(['payment', 'common']);
  const anchorElOpen = Boolean(anchorEl);
  const classes = useStyles();
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
  const menuList = [
    {
      content: t('actions.edit_subscription_plan'),
      isAdmin: true,
      color: '',
      handleClick: () => setSubscriptionModalOpen(true)
    }
  ];

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

  function handleModalClose() {
    setSubscriptionModalOpen(false);
    setAnchorEl(null);
  }

  const menuData = {
    menuList,
    handleSubscriptionMenu,
    anchorEl,
    open: anchorElOpen,
    handleClose
  };
  return (
    <div>
      {subscriptionModalOpen && (
        <SubscriptionPlanModal
          open={subscriptionModalOpen}
          handleModalClose={() => handleModalClose()}
          subscriptionPlansRefetch={subscriptionPlansRefetch}
          setMessage={setMessage}
          openAlertMessage={() => setAlertOpen(true)}
          subscriptionData={subData}
        />
      )}
      {subscriptionPlansLoading ? (
        <Spinner />
      ) : subscriptionPlansData?.subscriptionPlans?.length === 0 ? (
        <CenteredContent>{t('errors.no_plan_available')}</CenteredContent>
      ) : (
        <>
          <div className={classes.planList}>
            <div>
              <div
                style={
                  matches
                    ? {
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                        marginBottom: '10px'
                      }
                    : null
                }
              >
                <Typography className={matches ? classes.plan : classes.planMobile}>
                  {t('misc.subscription_plans')}
                </Typography>
                <div
                  style={
                    matches
                      ? { display: 'flex', width: '80%', justifyContent: 'flex-end' }
                      : { display: 'flex' }
                  }
                >
                  <div style={{ margin: '0 10px 10px 0', fontSize: '10px' }}>
                    <ButtonComponent
                      color="primary"
                      variant="contained"
                      buttonText="New Subscription Plan"
                      handleClick={() => setSubscriptionModalOpen(true)}
                      size="small"
                      style={matches ? {} : { fontSize: '10px' }}
                      data-test-id="new_subscription_plan"
                    />
                  </div>
                  <div>
                    <ButtonComponent
                      color="default"
                      variant="outlined"
                      buttonText="View All Plans"
                      handleClick={() => setDisplaySubscriptionPlans(false)}
                      size="small"
                      style={matches ? {} : { fontSize: '10px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

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
        </>
      )}
    </div>
  );
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
            title={capitalize(subscription.status)
              .split('_')
              .join('')}
            color={objectAccessor(InvoiceStatusColor, subscription?.status)}
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

const useStyles = makeStyles(() => ({
  download: {
    boxShadow: 'none',
    position: 'fixed',
    bottom: 30,
    right: 57,
    marginLeft: '30%',
    zIndex: '1000'
  },
  plan: {
    fontWeight: 500,
    fontSize: '20px',
    color: '#313131',
    marginBottom: '30px'
  },
  planMobile: {
    fontWeight: 500,
    fontSize: '16px',
    color: '#313131',
    marginBottom: '10px'
  },
  planList: {
    backgroundColor: '#FDFDFD',
    padding: '20px',
    borderRadius: '4px',
    border: '1px solid #EEEEEE',
    marginTop: '20px'
  },
  body: {
    padding: '0 2%'
  }
}));

PlansList.defaultProps = {
  communityPlans: []
};

PlansList.propTypes = {
  matches: PropTypes.bool.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  communityPlansLoading: PropTypes.bool.isRequired,
  communityPlans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      status: PropTypes.string
    })
  ),
  setDisplaySubscriptionPlans: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  setAlertOpen: PropTypes.func.isRequired,
}

SubscriptionPlans.propTypes = {
  matches: PropTypes.bool.isRequired,
  setMessage: PropTypes.func.isRequired,
  setAlertOpen: PropTypes.func.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  subscriptionPlansLoading: PropTypes.bool.isRequired,
  subscriptionPlansData: PropTypes.shape({
    subscriptionPlans: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        status: PropTypes.string
      })
    ).isRequired
  }).isRequired,
  subscriptionPlansRefetch: PropTypes.func.isRequired,
  setDisplaySubscriptionPlans: PropTypes.func.isRequired
};
