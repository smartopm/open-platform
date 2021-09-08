import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PaymentSlider from './PaymentSlider';
import Label from '../../../shared/label/Label';
import { capitalize } from '../../../utils/helpers';

export default function PlanListItem({ data, currencyData }) {
  const classes = useStyles();

  const colors = {
    cancelled: '#e74540',
    'on track': '#00a98b',
    behind: '#eea92d',
    completed: '#29ec47'
  };

  function planStatus(plan) {
    if (plan.status !== 'active') {
      return plan.status;
    }
    if (plan.owingAmount > 0) {
      return 'behind';
    }
    return 'on track';
  }

  return (
    <>
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12} sm={2} data-testid='landparcel'>
          <Typography className={classes.weight} variant="caption">
            {data?.landParcel?.parcelNumber}
          </Typography>
          {' '}
          -
          {' '}
          <Typography className={classes.weight} variant="caption">
            {data?.planType}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8} data-testid='payment-slider'>
          <PaymentSlider data={data} currencyData={currencyData} />
        </Grid>
        <Grid item xs={12} sm={2} data-testid='label'>
          <Label title={capitalize(planStatus(data) || '')} color={colors[planStatus(data)]} />
        </Grid>
      </Grid>
    </>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: 'white',
    padding: '3%',
    border: '1px solid #ECECEC',
    borderRadius: '4px'
  },
  weight: {
    fontWeight: 500
  }
}));

PlanListItem.propTypes = {
  data: PropTypes.shape({
    planType: PropTypes.string,
    landParcel: PropTypes.shape({
      parcelNumber: PropTypes.string
    })
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
}
