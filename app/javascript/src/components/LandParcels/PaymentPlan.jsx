import React from 'react';
import PropTypes from 'prop-types';
import Text from '../../shared/Text';

export default function PaymentPlan({ type, percentage }) {
  return <Text content={`Plan: ${type}/${percentage} of latest valuation`} />;
}

PaymentPlan.propTypes = {
  type: PropTypes.string.isRequired,
  percentage: PropTypes.string.isRequired
};
