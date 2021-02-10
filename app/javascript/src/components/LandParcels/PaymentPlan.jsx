import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import Text from '../../shared/Text';

export default function PaymentPlan({ type, percentage }) {
  const classes = useStyles()
  return (
    <div className={classes.planStyles} data-testid="payment_plan">
      <Text content={`Plan: ${type}/${percentage} of latest valuation`} />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  planStyles: {
    color: theme.palette.primary.main,
    border: `1px ${theme.palette.primary.main} solid`,
    backgroundColor: theme.palette.primary.dew,
    height: 39,
    padding: 6,
    marginTop: 20
  },
}))

PaymentPlan.propTypes = {
  type: PropTypes.string.isRequired,
  percentage: PropTypes.string.isRequired
};
