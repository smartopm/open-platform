import React from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { DetailsDialog } from '../../../../components/Dialog'
import { dateToString } from '../../../../components/DateContainer';
import { formatMoney } from '../../../../utils/helpers';

export default function PlanDetail({ open, handleModalClose, planData, currencyData }) {
  const classes = useStyles();
  return (
    <>
      <DetailsDialog
        open={open}
        handleClose={handleModalClose}
        title='Plan Details'
        color='default'
      >
        <div className={classes.detailBody}>
          <Grid container spacing={1} data-testid='name'>
            <Grid item xs={6}>
              <Typography color='primary' className={classes.name}>{planData?.user?.name}</Typography> 
            </Grid>
            <Grid item xs={6}>
              {' '} 
            </Grid>
          </Grid>
          <Grid container spacing={1} style={{margin: '20px 0'}} data-testid='detail'>
            <Grid item xs={6}>
              <Typography className={classes.details}>Details</Typography> 
            </Grid>
            <Grid item xs={6} style={{textAlign: 'right'}}>
              <KeyboardArrowDownIcon /> 
            </Grid>
          </Grid>
          <Grid container spacing={1} data-testid='start-date'>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>Start Date</Typography> 
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {dateToString(planData.startDate)} 
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1} data-testid='plan-duration'>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>Plan Duration</Typography> 
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {`${planData.durationInMonth} months`}
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1} data-testid='end-date'>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>End Date</Typography> 
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {dateToString(planData.endDate)}
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1} data-testid='status'>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>Status</Typography> 
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {planData.status}
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1} data-testid='plan-type'>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>Plan Type</Typography> 
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {planData.planType}
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>Amount</Typography> 
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {`${formatMoney(currencyData, planData.monthlyAmount)} monthly`}
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography className={classes.fieldTitle}>Plot</Typography> 
            </Grid>
            <Grid item xs={6} className={classes.fieldContent}>
              {planData?.landParcel?.parcelNumber}
            </Grid>
          </Grid>
        </div>
        <Grid className={classes.totalValue}>
          <Typography>Total Value</Typography>
          <Typography color='primary' style={{fontSize: '25px', fontWeight: 500}}>{formatMoney(currencyData, planData.planValue)}</Typography>
        </Grid>
      </DetailsDialog>
    </>
  )
}

const useStyles = makeStyles(() => ({
  detailBody: {
    width: '520px',
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
 }))

 PlanDetail.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  planData: PropTypes.shape({
    user: PropTypes.shape({
      name: PropTypes.string
    }),
    startDate: PropTypes.string,
    durationInMonth: PropTypes.number,
    status: PropTypes.string,
    planType: PropTypes.string,
    monthlyAmount: PropTypes.number,
    planValue: PropTypes.number,
    endDate: PropTypes.string,
    landParcel: PropTypes.shape({
      parcelNumber: PropTypes.string
    }),
  }).isRequired,
  currencyData: PropTypes.shape({
      currency: PropTypes.string,
      locale: PropTypes.string
  }).isRequired,
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired
};