/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, IconButton } from '@material-ui/core';
import { MoreHorizOutlined } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import DataList from '../../../shared/list/DataList';
import {
  formatMoney,
  InvoiceStatusColor,
  propAccessor,
  titleize,
  capitalize
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


export function PlansList({
  matches,
  currencyData,
  communityPlansLoading,
  communityPlans,
  setDisplaySubscriptionPlans
}){
  const { t } = useTranslation(['payment', 'common']);
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const classes = useStyles();

  function paginatePlans(action) {
    if (action === 'prev') {
      if (offset < limit) return;
      setOffset(offset - limit);
    } else if (action === 'next') {
      setOffset(offset + limit);
    }
  }

  return (
    <div>
      {communityPlansLoading ? (
        <Spinner />
    ) : communityPlans?.length === 0 ? (
      <CenteredContent>{t('errors.no_plan_available')}</CenteredContent>
    ) : (
      <>
        <div className={classes.planList}>
          <div>
            <div
              style={matches ? {
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              marginBottom: '10px'
            } : null}
            >
              <Typography className={matches ? classes.plan : classes.planMobile}>
                {t('common:misc.plans')}
              </Typography>
              <div
                style={
                matches
                  ? { display: 'flex', width: '100%', justifyContent: 'flex-end', marginBottom: '5px' }
                  : { display: 'flex', marginBottom: '5px' }
                }
              >
                <div>
                  <ButtonComponent
                    color="default"
                    variant="outlined"
                    buttonText='View All Subscription Plans'
                    handleClick={() => setDisplaySubscriptionPlans(true)}
                    size="small"
                    style={matches ? {} : {fontSize: '10px'}}
                  />
                </div>
              </div>
            </div>
          </div>
          {communityPlans?.slice(offset, limit + offset - 1).map(plan => (
            <div className={classes.body} style={matches ? {} : {marginTop: '30px'}} key={plan.id}>
              <PlanListItem data={plan} currencyData={currencyData} />
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
}){
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
    setSubscriptionModalOpen(false)
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
              style={matches ? {
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              marginBottom: '10px'
            } : null}
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
                    buttonText='New Subscription Plan'
                    handleClick={() => setSubscriptionModalOpen(true)}
                    size="small"
                    style={matches ? {} : {fontSize: '10px'}}
                    data-test-id='new_subscription_plan'
                  />
                </div>
                <div>
                  <ButtonComponent
                    color="default"
                    variant="outlined"
                    buttonText='View All Plans'
                    handleClick={() => setDisplaySubscriptionPlans(false)}
                    size="small"
                    style={matches ? {} : {fontSize: '10px'}}
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
}

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
      status: PropTypes.string,
    })
  ),
  setDisplaySubscriptionPlans: PropTypes.func.isRequired
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
}
