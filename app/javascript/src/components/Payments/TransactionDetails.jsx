import React from 'react'
import PropTypes from 'prop-types';
import { DetailsDialog } from '../Dialog'
import DetailsField from './DetailField'
import { dateToString } from '../DateContainer';
import { propAccessor } from '../../utils/helpers'

export  default function TransactionDetails({ data, detailsOpen, handleClose, currency, title }){
  const detailsField = {
    source: 'Type',
    amount: 'Amount',
    createdAt: 'Date Created',
    status: 'Status',
    currentWalletBalance: 'Current Wallet Balance',
    balance: 'Balance',
    settled: 'Settled',
    paymentType: 'Payment Type',
    paymentStatus: 'Payment Status',
    pendingAmount: 'Pending Amount'
  };
  return (
    <>
      <DetailsDialog
        handleClose={handleClose}
        open={detailsOpen}
        title={`${title} Details`}
      >
        {
          Object.entries(data).filter(([key]) => ( 
            key !== 'updatedAt' && key !== 'id' && key !== '__typename' && key !== 'destination' && key !== 'paymentStatus')).map(([key, val]) => (
              <DetailsField
                key={key}
                title={propAccessor(detailsField, key)}
                // eslint-disable-next-line no-nested-ternary
                value={key === 'createdAt' ? dateToString(val) : key === ('amount' || 'currentWalletBalance' || 'balance' || 'pendingAmount') ? `${currency}${val}` : val}
              />
          ))
        }
      </DetailsDialog>
    </>
  )
}

TransactionDetails.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  detailsOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired
};
