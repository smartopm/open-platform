import React from 'react'
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { DetailsDialog } from '../Dialog'
import DetailsField from './DetailField'
import { invoiceStatus } from '../../utils/constants';
import { dateToString } from '../DateContainer';
import { formatMoney } from '../../utils/helpers';

export  default function InvoiceDetails({ data, detailsOpen, handleClose, currencyData }){
  return (
    <>
      <DetailsDialog
        handleClose={handleClose}
        open={detailsOpen}
        title='Invoice Details'
      >
        <DetailsField
          title='Invoice Number'
          value={`#${data?.invoiceNumber}`}
        />
        <DetailsField
          title='Issued Date'
          value={dateToString(data?.createdAt)}
        />
        <DetailsField
          title='Amount'
          value={formatMoney(currencyData, data?.amount)}
        />
        <DetailsField
          title='Status'
          value={data?.status === 'paid' ? `Paid on ${dateToString(data?.updatedAt)}` : invoiceStatus[data?.status]}
        />
        <DetailsField
          title='Plot Number'
          value={data?.landParcel?.parcelNumber}
        />
        {data?.status === 'paid' && (
          <div>
            <Typography variant="h6" align="center" color='primary'>Invoice Payment Details</Typography>
            {data.payments.map((pay) => (
              <div style={{display: 'flex', margin: '15px 23px', borderBottom: '1px solid #9E9E9E', paddingBottom: '5px', color: '#9E9E9E'}} key={pay.id}>
                <Typography style={{marginRight: '20px'}}>
                  {`Paid: ${dateToString(pay.createdAt)}`}
                </Typography>
                <Typography style={{marginRight: '10px'}}>
                  {formatMoney(currencyData, pay.amount)}
                </Typography>
                <Typography style={{marginRight: '10px'}}>
                  {pay.paymentType}
                </Typography>
                <Typography>
                  {pay.user.name}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </DetailsDialog>
    </>
  )
}

InvoiceDetails.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  currencyData: PropTypes.shape({
      currency: PropTypes.string,
      locale: PropTypes.string
  }).isRequired,
  detailsOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};
