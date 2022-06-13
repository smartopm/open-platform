/* eslint-disable no-nested-ternary */
import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Typography,
  IconButton,
  Fab,
  Button,
  Checkbox,
  Select,
  MenuItem
} from '@mui/material';
import { MoreHorizOutlined } from '@mui/icons-material';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { useMutation, useQuery } from 'react-apollo';
import { CSVLink } from 'react-csv';
import EmailIcon from '@mui/icons-material/Email';
import DataList from '../../../shared/list/DataList';
import useDebounce from '../../../utils/useDebounce';
import {
  formatError,
  formatMoney,
  InvoiceStatusColor,
  titleize,
  capitalize,
  objectAccessor,
  handleQueryOnChange
} from '../../../utils/helpers';
import Label from '../../../shared/label/Label';
import CenteredContent from '../../../shared/CenteredContent';
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
import { CommunityPlansQuery } from '../graphql/payment_query';

export function PlansList({
  matches,
  currencyData,
  setDisplaySubscriptionPlans,
  setMessage,
  setAlertOpen
}) {
  const { t } = useTranslation(['payment', 'common']);
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
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
  const [displayBuilder, setDisplayBuilder] = useState('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [checkbox, setCheckbox] = useState(false);
  const [selectDropdown, setSelectDropdown] = useState('none');

  const menuList = [
    {
      content: t('misc.payment_reminder'),
      isAdmin: true,
      handleClick: () => setConfirmationModalOpen(true)
    }
  ];
  const menuData = {
    menuList,
    handleMenuClick,
    anchorEl,
    open: anchorElOpen,
    userType: authState?.user?.userType,
    handleClose: e => handleMenuClose(e)
  };

  const csvHeaders = [
    { label: 'Parcel Type', key: 'landParcel.parcelType' },
    { label: 'Parcel Number', key: 'landParcel.parcelNumber' },
    { label: 'User Name', key: 'user.name' },
    { label: 'NRC', key: 'user.extRefId' },
    { label: 'User Email', key: 'user.email' },
    { label: 'Phone Number', key: 'user.phoneNumber' },
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
    return csvData?.map(val => ({
      ...val,
      formattedStartDate: dateToString(val.startDate, 'MM-DD-YYYY'),
      formattedEndDate: dateToString(val.endDate, 'MM-DD-YYYY')
    }));
  }

  function handleMenuClose(e) {
    e.stopPropagation();
    setAnchorEl(null);
    setPaymentPlan(null);
  }

  function handleMenuClick(event, plan) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setPaymentPlan(plan);
  }

  function handleAfterMutation() {
    setPaymentPlan(null);
    setMutationLoading(false);
    setAlertOpen(true);
    setConfirmationModalOpen(false);
    setAnchorEl(null);
    clearSelection();
  }

  function sendPaymentReminderMail() {
    let variables;
    if (paymentPlan) {
      variables = [{ userId: paymentPlan?.user.id, paymentPlanId: paymentPlan.id }];
    } else {
      variables = selectedPlans;
    }
    setMutationLoading(true);
    createPaymentRemider({
      variables: { paymentReminderFields: variables }
    })
      .then(() => {
        setMessage({ isError: false, detail: t('misc.email_sent') });
        handleAfterMutation();
      })
      .catch(error => {
        setMessage({ isError: true, detail: formatError(error.message) });
        handleAfterMutation();
      });
  }

  const { loading, data: communityPlansData } = useQuery(CommunityPlansQuery, {
    variables: { query: debouncedValue || searchQuery },
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });

  const communityPlans = communityPlansData?.communityPaymentPlans;

  function paginatePlans(action) {
    if (checkbox && selectDropdown !== 'all_filtered') {
      clearSelection();
    }
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
    clearSelection();
    setSearchQuery(handleQueryOnChange(selectedOptions, planFilterFields));
  }

  function handlePlansSelect(planId, userId) {
    const index = selectedPlans.findIndex(
      obj => obj.paymentPlanId === planId && obj.userId === userId
    );
    if (index !== -1) {
      setSelectedPlans([...selectedPlans.slice(0, index), ...selectedPlans.slice(index + 1)]);
    } else {
      setSelectedPlans([...selectedPlans, { paymentPlanId: planId, userId }]);
    }
  }

  function clearSelection() {
    setCheckbox(false);
    setSelectDropdown('none');
    setSelectedPlans([]);
  }

  function handleSelectOptionAndCheckBox(event) {
    if (!checkbox) {
      setCheckbox(true);
      setSelectedPlans([]);
      if (event.target.value === 'all_filtered') {
        const plans = []
        setSelectDropdown('all_filtered');
        communityPlans.map(plan => plans.push({ paymentPlanId: plan?.id, userId: plan?.user?.id }))
        setSelectedPlans(plans)
      } else {
        setSelectDropdown('all_on_the_page');
        const plans = []
        communityPlans.slice(offset, offset + limit).map(plan => plans.push({ paymentPlanId: plan?.id, userId: plan?.user?.id }))
        setSelectedPlans(plans)
      }
    } else {
      clearSelection();
    }
  }

  function handleSearchClear() {
    setSearchValue('');
    clearSelection()
  }

  return (
    <div>
      {loading && <Spinner />}
      <Fab color="primary" variant="extended" className={classes.download} data-testid="csv-fab">
        <CSVLink
          data={formattedCsvData(communityPlans) || []}
          style={{ color: 'white' }}
          headers={csvHeaders}
          filename={`payment-plans-data-${dateToString(new Date())}.csv`}
        >
          {loading ? <Spinner /> : t('actions.download_csv')}
        </CSVLink>
      </Fab>
      <ActionDialog
        open={confirmationModalOpen}
        type="confirm"
        message={selectedPlans.length > 0 && !paymentPlan ? t('misc.plan_reminder_confirmation', {
          planCount: selectedPlans.length
        }) : t('misc.email_confirmation', {
          parcel_number: paymentPlan?.landParcel?.parcelNumber
        })}
        handleClose={() => setConfirmationModalOpen(false)}
        handleOnSave={sendPaymentReminderMail}
        disableActionBtn={mutationLoading}
      />
      <SearchInput
        title={t('common:misc.plans')}
        searchValue={searchValue}
        handleSearch={event => setSearchValue(event.target.value)}
        handleFilter={toggleFilterMenu}
        handleClear={() => handleSearchClear()}
      />
      <Grid
        container
        justifyContent="flex-end"
        style={{
          width: '100.5%',
          position: 'absolute',
          zIndex: 1,
          marginTop: '-2px',
          marginLeft: matches ? '-350px' : '-50px',
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
      {loading ? (
        <Spinner />
      ) : communityPlans?.length === 0 ? (
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
                      color="primary"
                      variant="outlined"
                      buttonText={t('actions.view_all_subscription_plans')}
                      handleClick={() => setDisplaySubscriptionPlans(true)}
                      size="small"
                      style={matches ? {} : { fontSize: '10px' }}
                    />
                  </div>
                </div>
              </div>
              <Grid container>
                {checkbox && selectedPlans.length > 0 && (
                  <Grid item xs={12} className={matches ? classes.filterCount : ''} data-testid='plan_count'>
                    <Typography variant='body2'>
                      {' '}
                      {t('misc.plan_count', {count: `${selectedPlans.length}`})}
                      {' '}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12} sm={6} className={matches ? classes.checkBox : classes.checkBoxMobile}>
                  <Grid container>
                    <Grid>
                      <Checkbox
                        checked={checkbox}
                        onChange={handleSelectOptionAndCheckBox}
                        name="plan_check_box"
                        inputProps={{ 'data-testid': 'plan_check_box' }}
                        color="primary"
                        style={{ padding: '0px', marginRight: '15px' }}
                      />
                    </Grid>
                    <Grid>
                      <Typography>
                        {' '}
                        {t('common:misc.select')}
                        {' '}
                      </Typography>
                    </Grid>
                    <Grid>
                      <Select
                        labelId="user-action-select"
                        variant="standard"
                        id="user-action-select"
                        value={selectDropdown}
                        onChange={handleSelectOptionAndCheckBox}
                        style={{ height: '23px', marginLeft: '10px' }}
                      >
                        <MenuItem value="all_on_the_page">{t('common:misc.all_this_page')}</MenuItem>
                        <MenuItem disabled={!searchQuery && !searchValue} value="all_filtered">
                          All filtered
                        </MenuItem>
                        <MenuItem value="none">{t('common:misc.none')}</MenuItem>
                      </Select>
                    </Grid>
                    {selectedPlans.length > 0 && (
                    <Button
                      onClick={() => setConfirmationModalOpen(true)}
                      color="primary"
                      startIcon={<EmailIcon fontSize="large" />}
                      style={{ textTransform: 'none' }}
                      data-testid='send_payment_button'
                    >
                      {t('misc.send_payment_reminder')}
                    </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </div>
            {communityPlans?.slice(offset, limit + offset - 1).map(plan => (
              <div
                className={classes.body}
                style={matches ? {} : { marginTop: '30px' }}
                key={plan.id}
              >
                <PlanListItem
                  data={plan}
                  currencyData={currencyData}
                  menuData={menuData}
                  selectedPlans={selectedPlans}
                  handlePlansSelect={handlePlansSelect}
                />
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
                      color="primary"
                      variant="outlined"
                      buttonText={t('actions.view_all_plans')}
                      handleClick={() => setDisplaySubscriptionPlans(false)}
                      size="small"
                      style={matches ? {} : { fontSize: '10px' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {matches && subscriptionPlansData?.subscriptionPlans?.length > 0 && (
              <div style={{ padding: '0 20px' }}>
                <ListHeader headers={subscriptionPlanHeaders} />
              </div>
            )}
            {subscriptionPlansData?.subscriptionPlans?.length === 0 ? (
              <CenteredContent>{t('errors.no_plan_available')}</CenteredContent>
            ): (subscriptionPlansData?.subscriptionPlans?.map(sub => (
              <div style={{ padding: '0 20px' }} key={sub.id}>
                <DataList
                  keys={subscriptionPlanHeaders}
                  data={renderSubscriptionPlans(sub, currencyData, menuData)}
                  hasHeader={false}
                />
              </div>
            )))}
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
            size="large"
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
  },
  checkBox: {
    margin: '0 0 20px 20px'
  },
  checkBoxMobile: {
    margin: '10px 0 -10px 0'
  },
  filterCount: {
    margin: '-10px 0 10px 20px'
  }
}));

PlansList.propTypes = {
  matches: PropTypes.bool.isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  setDisplaySubscriptionPlans: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  setAlertOpen: PropTypes.func.isRequired
};

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
