/* eslint-disable */
import React from 'react'
import { DetailsDialog } from '../Dialog'
import DetailsField from './DetailField'

export  default function TransactionDetails({ transType, detailsOpen, handleClose }){
  return (
    <>
      <DetailsDialog
        handleClose={() => handleClose}
        open={detailsOpen}
        title={`Details for ${data.title}`} 
      >
        {Object.keys(data).map((key, value, index) => (
          <DetailsField
            title={key}
            key={index}
            value={value} 
          />
        ))}
        {/* <DetailsField
          title='Plot Number'
          value={invoice?.landParcel?.parcelNumber} 
        />
        <DetailsField
          title='Amount'
          value={`${currency}${invoice?.amount}`} 
        />
        <DetailsField
          title='Date Created'
          value={dateToString(invoice?.createdAt)} 
        />
        <DetailsField
          title='Due Date'
          value={dateToString(invoice?.dueDate)} 
        />
        <DetailsField
          title='Status'
          value={`${invoiceStatus[invoice.status]} ${outstandingPay()}`} 
        /> */}
      </DetailsDialog>
    </>
  )
}