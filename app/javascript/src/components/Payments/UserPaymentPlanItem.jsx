import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PaymentPlanDetails from './PaymentPlanDetails';

const planHeader = [
  { title: 'Plot Number', col: 4 },
  { title: 'Balance', col: 4 },
  { title: 'Start Date', col: 3 },
  { title: 'Monthly Payments', col: 3 },
  { title: '% of total valuation', col: 4 },
  { title: 'End Date', col: 3 }
];

export default function UserPaymentPlanItem({ plan }) {
  const [open, setOpen] = useState(false);
  return (
    <PaymentPlanDetails
      detailsOpen={open}
      handleClose={() => setOpen(false)}
      data={plan}
    />
  );
}

UserPaymentPlanItem.propTypes = {
  plan: PropTypes.shape({
    plotNumber: PropTypes.number,
    balance: PropTypes.string,
    startDate: PropTypes.string,
    createdAt: PropTypes.string
  }).isRequired
};
