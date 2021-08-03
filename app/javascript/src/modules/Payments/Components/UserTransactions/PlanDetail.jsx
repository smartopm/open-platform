import React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { DetailsDialog } from '../../../../components/Dialog';
import { dateToString } from '../../../../components/DateContainer';
import { formatMoney } from '../../../../utils/helpers';

export default function PlanDetail({ open, handleModalClose, planData, currencyData }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
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
  return (
    <>
      <DetailsDialog
        open={open}
        handleClose={handleModalClose}
        title={t('misc.plan_details')}
        color="default"
      >
        <div className={matches ? classes.detailBodyMobile : classes.detailBody}>
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
              {planData.frequency}
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1} data-testid="plan-duration">
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>{t('table_headers.plan_duration')}</Typography>
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {`${planData.duration} ${planFrequency[planData?.frequency]}`}
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
              {planData.status}
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1} data-testid="plan-type">
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>{t('table_headers.plan_type')}</Typography>
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {planData.planType}
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
          <Divider className={classes.divider} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>{t('table_headers.co_owners')}</Typography>
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {handleCoOwners() || '-'}
            </Grid>
          </Grid>
        </div>
        <Grid className={classes.totalValue}>
          <Typography>{t('table_headers.total_value')}</Typography>
          <Typography color="primary" style={{ fontSize: '25px', fontWeight: 500 }}>
            {formatMoney(currencyData, planData.planValue)}
          </Typography>
        </Grid>
      </DetailsDialog>
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
  }
}));

PlanDetail.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  planData: PropTypes.shape({
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
      parcelNumber: PropTypes.string
    })
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired
};
