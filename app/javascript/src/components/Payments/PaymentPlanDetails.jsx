import React from 'react'
import PropTypes from 'prop-types';
import { DetailsDialog } from '../Dialog'
import DetailsField from './DetailField'
import { dateToString } from '../DateContainer';

export  default function PaymentPlanDetails({ data, detailsOpen, handleClose }){
  return (
    <>
      <DetailsDialog
        handleClose={handleClose}
        open={detailsOpen}
        title='Payment Plan Details'
      >
        <DetailsField
          title='Plot Number'
          value={`#${data?.plotNumber}`}
        />
        <DetailsField
          title='Start Date'
          value={dateToString(data?.startDate)}
        />
        <DetailsField
          title='Valuation'
          value={`#${data?.valuation}`}
        />
      </DetailsDialog>
    </>
  )
}

PaymentPlanDetails.propTypes = {
  data: PropTypes.shape({
    plotNumber: PropTypes.number,
    balance: PropTypes.string,
    startDate: PropTypes.string,
    createdAt: PropTypes.string
  }).isRequired
};

