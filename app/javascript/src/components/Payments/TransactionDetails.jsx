import React from 'react'
import PropTypes from 'prop-types';
import { DetailsDialog } from '../Dialog'
import DetailsField from './DetailField'
import { dateToString } from '../DateContainer';
import { invoiceStatus } from '../../utils/constants'

export  default function TransactionDetails({ data, detailsOpen, handleClose, currency }){
  return (
    <>
      <DetailsDialog
        handleClose={handleClose}
        open={detailsOpen}
        title={data?.status === 'in_progress' ? 'Invoice Details' : 'Transaction Details'}
      >
        <DetailsField
          title='Amount'
          value={`${currency}${data?.amount}`}
        />
        <DetailsField
          title={data?.status === 'in_progress' ? 'Date Issued' : 'Payment Date'}
          value={dateToString(data?.createdAt)}
        />
        <DetailsField
          title='Status'
          value={invoiceStatus[data?.status]}
        />
      </DetailsDialog>
    </>
  )
}

TransactionDetails.propTypes = {
  data: PropTypes.shape({
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    balance: PropTypes.number
  }).isRequired,
  currency: PropTypes.string.isRequired,
  detailsOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};