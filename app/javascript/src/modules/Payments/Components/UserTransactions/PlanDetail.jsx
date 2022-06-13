
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import { Divider, Grid, Button, Menu, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CustomizedDialogs } from '../../../../components/Dialog';
import { dateToString } from '../../../../components/DateContainer';
import { formatMoney, formatError, titleize , objectAccessor } from '../../../../utils/helpers';
import { suffixedNumber } from '../../helpers';
import { StyledTabs, StyledTab, TabPanel } from '../../../../components/Tabs';
import SwitchInput from '../../../Forms/components/FormProperties/SwitchInput';


export default function PlanDetail({
  open,
  handleModalClose,
  planData,
  currencyData,
  updatePaymentPlan,
  plansRefetch,
  setMessageAlert,
  setIsSuccessAlert
}) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  const [tabValue, setTabValue] = useState('Plan Details');
  const [editing, setEditing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mutationLoading, setMutationLoading] = useState(false);
  const [paymentDay, setPaymentDay] = useState(planData.paymentDay);
  const [renewable, setRenewable] = useState(planData.renewable);
  const validDays = [...Array(28).keys()];
  const { t } = useTranslation(['payment', 'common']);
  const planFrequency = {
    daily: 'days',
    weekly: 'weeks',
    monthly: 'months',
    quarterly: 'quarters'
  }
  // eslint-disable-next-line consistent-return
  function handleCoOwners() {
    if (planData?.coOwners?.length > 0) {
      return planData.coOwners.map(owner => owner.name).join(', ')
    }
  }

  function handleTabValueChange(_event, newValue) {
    setTabValue(newValue);
  };

  function handleSetDay(day){
    handleMenuClose();
    setPaymentDay(day);
  }

  function handleMenu(event){
    if(editing){
      setAnchorEl(event.currentTarget);
    }
  }

  function handleMenuClose() {
    setAnchorEl(null);
  };

  function handlePlanUpdate(){
    if(!editing){
      setEditing(true);
    }else{
      setMutationLoading(true);
      updatePaymentPlan({
        variables: {
          planId: planData.id,
          paymentDay,
          renewable
        }
      })
        .then(() => {
          setMutationLoading(false);
          setEditing(false);
          handleModalClose();
          setMessageAlert(t('misc.payment_plan_updated'));
          setIsSuccessAlert(true);
          plansRefetch();
        })
        .catch(err => {
          setMutationLoading(false);
          setEditing(false);
          setMessageAlert(formatError(err.message));
          setIsSuccessAlert(false);
          handleModalClose();
        });
    }
  };

  return (
    <>

      <CustomizedDialogs
        open={open}
        handleModal={handleModalClose}
        dialogHeader={tabValue === 'Plan Details' ? t('misc.plan_details') : t('misc.plan_settings')}
        handleBatchFilter={handlePlanUpdate}
        saveAction={editing ? t('common:form_actions.save') : t('actions.edit_plan_settings')}
        actionLoading={mutationLoading}
        disableActionBtn={mutationLoading}
        cancelAction={tabValue === 'Plan Details' ? t('common:form_actions.close') : t('common:form_actions.cancel')}
        displaySaveButton={tabValue === 'Plan Settings'}
      >
        <StyledTabs value={tabValue} onChange={handleTabValueChange} aria-label="payment plan tabs">
          <StyledTab label={t('misc.plan_details')} value="Plan Details" />
          <StyledTab label={t('misc.plan_settings')} value="Plan Settings" />
        </StyledTabs>
        <div className={matches ? classes.detailBodyMobile : classes.detailBody}>
          <TabPanel value={tabValue} index="Plan Details">
            <Grid container spacing={1} style={{ margin: '20px 0' }} data-testid="detail">
              <Grid item xs={6}>
                <Typography className={classes.details}>{t('common:misc.details')}</Typography>
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'right' }}>
                <KeyboardArrowDownIcon />
              </Grid>
            </Grid>
            <Grid container spacing={1} data-testid="start-date">
              <Grid item xs={6}>
                <Typography className={classes.fieldTitle}>{t('common:table_headers.start_date')}</Typography>
              </Grid>
              <Grid item xs={6} className={classes.fieldContent}>
                {dateToString(planData.startDate)}
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container spacing={1} data-testid="frequency">
              <Grid item xs={6}>
                <Typography className={classes.fieldTitle}>{t('table_headers.frequency')}</Typography>
              </Grid>
              <Grid item xs={6} className={classes.fieldContent}>
                {titleize(planData.frequency)}
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container spacing={1} data-testid="plan-duration">
              <Grid item xs={6}>
                <Typography className={classes.fieldTitle}>{t('table_headers.plan_duration')}</Typography>
              </Grid>
              <Grid item xs={6} className={classes.fieldContent}>
                {`${planData.duration} ${objectAccessor(planFrequency, planData?.frequency)}`}
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container spacing={1} data-testid="end-date">
              <Grid item xs={6}>
                <Typography className={classes.fieldTitle}>{t('table_headers.end_date')}</Typography>
              </Grid>
              <Grid item xs={6} className={classes.fieldContent}>
                {dateToString(planData.endDate)}
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container spacing={1} data-testid="status">
              <Grid item xs={6}>
                <Typography className={classes.fieldTitle}>{t('common:table_headers.status')}</Typography>
              </Grid>
              <Grid item xs={6} className={classes.fieldContent}>
                {titleize(planData.status)}
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container spacing={1} data-testid="plan-type">
              <Grid item xs={6}>
                <Typography className={classes.fieldTitle}>{t('table_headers.plan_type')}</Typography>
              </Grid>
              <Grid item xs={6} className={classes.fieldContent}>
                {titleize(planData.planType)}
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography className={classes.fieldTitle}>{t('common:table_headers.amount')}</Typography>
              </Grid>
              <Grid item xs={6} className={classes.fieldContent}>
                {formatMoney(currencyData, planData.installmentAmount)}
                {' '}
                {planData?.frequency}
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography className={classes.fieldTitle}>{t('common:menu.plot')}</Typography>
              </Grid>
              <Grid item xs={6} className={classes.fieldContent}>
                {planData?.landParcel?.parcelNumber}
              </Grid>
            </Grid>
            <Divider />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography className={classes.fieldTitle}>{t('table_headers.co_owners')}</Typography>
              </Grid>
              <Grid item xs={6} className={`${classes.fieldContent} plan-detail-co-owner`}>
                {handleCoOwners() || '-'}
              </Grid>
            </Grid>
            <Grid className={classes.totalValue}>
              <Typography>{t('table_headers.total_value')}</Typography>
              <Typography color="primary" style={{ fontSize: '25px', fontWeight: 500 }}>
                {formatMoney(currencyData, planData.planValue)}
              </Typography>
            </Grid>
          </TabPanel>
          <TabPanel value={tabValue} index="Plan Settings">
            <Grid container spacing={1} data-testid="payment-day">
              <Grid item xs={6}>
                <Typography variant='body1'>{t('misc.payment_day')}</Typography>
              </Grid>
              <Grid className={classes.rightAlign} item xs={6}>
                <Menu
                  id="set-payment-date-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  data-testid="menu-open"
                  PaperProps={{
                  style: {
                    maxHeight: 250
                  }
                }}
                >
                  {validDays.map(day => (
                    <MenuItem
                      key={day}
                      data-testid={`payment-day-${day}`}
                      onClick={() => handleSetDay(day + 1)}
                    >
                      {day + 1}
                    </MenuItem>
                ))}
                </Menu>
                <Button
                  aria-controls="set-payment-date-menu"
                  variant={editing ? 'outlined' : 'text'}
                  aria-haspopup="true"
                  data-testid="menu"
                  onClick={handleMenu}
                >

                  {editing  ? (
                    <span>
                      <EditIcon fontSize="small" style={{ marginBottom: -4 }} />
                      {`   ${suffixedNumber(paymentDay)}`}
                    </span>
                  ) : (
                    suffixedNumber(paymentDay)
                  )}
                </Button>
              </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid container spacing={1} data-testid="renewable-slider">
              <Grid item xs={6}>
                {t('misc.auto_renewal')}
              </Grid>
              <Grid className={classes.rightAlign} item xs={6}>
                {editing && (
                  <div className={classes.slider}>
                    <SwitchInput
                      name="renewable"
                      label=""
                      value={renewable}
                      handleChange={event => {setRenewable(event.target.checked)}}
                    />
                  </div>
                )}
                {!editing && (
                  renewable ? (
                    <Typography variant='body1'>{t('misc.active')}</Typography>
                  ) : (
                    <Typography variant='body1'>{t('misc.inactive')}</Typography>
                  )
                )}
              </Grid>
            </Grid>
            <Grid container spacing={1} data-testid="renewable-text">
              {renewable && (
              <Grid className={classes.renew} item xs={12}>
                <>
                  <Typography className={classes.renewContent}>
                    {t('misc.plan_renewal_text')}
                  </Typography>
                  <Typography className={classes.renewContent}>
                    &nbsp;
                    <b>{dateToString(planData.renewDate, 'YYYY/MM/DD')}</b>
                    &nbsp;
                  </Typography>
                </>
              </Grid>
            )}
            </Grid>
          </TabPanel>
        </div>
      </CustomizedDialogs>
    </>
  );
}

const useStyles = makeStyles(() => ({
  detailBody: {
    width: '520px',
    margin: '21px'
  },
  detailBodyMobile: {
    margin: '21px'
  },
  name: {
    fontSize: '20px',
    fontWeight: 500
  },
  details: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#141414'
  },
  fieldTitle: {
    color: '#8B8B8B',
    fontSize: '15px',
    fontWeight: 500
  },
  fieldContent: {
    fontSize: '16px',
    fontWeight: 400,
    color: '#212121',
    textAlign: 'right'
  },
  divider: {
    margin: '20px 0'
  },
  totalValue: {
    marginTop: '30px',
    background: '#F0F0F0',
    padding: '20px'
  },
  rightAlign: {
    textAlign: 'right'
  },
  slider: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  renew: {
    marginTop: '10px'
  },
  renewContent: {
    fontSize: '14px',
    display: 'inline'
  }
}));

PlanDetail.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  planData: PropTypes.shape({
    id: PropTypes.string,
    paymentDay: PropTypes.number,
    renewable: PropTypes.bool,
    renewDate: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string
    }),
    coOwners: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string
      })
    ),
    startDate: PropTypes.string,
    frequency: PropTypes.string,
    duration: PropTypes.number,
    status: PropTypes.string,
    planType: PropTypes.string,
    installmentAmount: PropTypes.number,
    planValue: PropTypes.number,
    endDate: PropTypes.string,
    landParcel: PropTypes.shape({
      parcelNumber: PropTypes.string,
      parcelType: PropTypes.string
    })
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  plansRefetch: PropTypes.func.isRequired,
  setMessageAlert: PropTypes.func.isRequired,
  setIsSuccessAlert: PropTypes.func.isRequired,
  updatePaymentPlan: PropTypes.func.isRequired
};
