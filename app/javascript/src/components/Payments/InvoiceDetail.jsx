import React from 'react'
import PropTypes from 'prop-types';
import { DetailsDialog } from '../Dialog'
import DetailsField from './DetailField'
import { invoiceStatus } from '../../utils/constants';
import { dateToString } from '../DateContainer';

export  default function InvoiceDetails({ data, detailsOpen, handleClose, currency }){
  return (
    <>
      <DetailsDialog
        handleClose={handleClose}
        open={detailsOpen}
        title='Invoice Details'
      >
        <DetailsField
          title='Issued Date'
          value={dateToString(data?.createdAt)}
        />
        <DetailsField
          title='Amount'
          value={`${currency}${data?.amount}`}
        />
        <DetailsField
          title='Status'
          value={data?.status === 'paid' ? `Paid on ${dateToString(data?.updatedAt)}` : invoiceStatus[data?.status]}
        />
        <DetailsField
          title='Plot Number'
          value={data?.landParcel?.parcelNumber}
        />
      </DetailsDialog>
    </>
  )
}

InvoiceDetails.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  detailsOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
