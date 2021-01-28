/* eslint-disable */
import React, {useEffect} from 'react'
import { useLazyQuery } from 'react-apollo'
import { DetailsDialog } from '../Dialog'
import DetailsField from './DetailField'
import { invoiceQuery } from '../../graphql/queries'

export  default function TransactionDetails({ transObj, detailsOpen, handleClose }){
  const [loadInvoice, { error: invoiceError, loading: invoiceLoading, data: invoiceData } ] = useLazyQuery(invoiceQuery,{
    variables: { id: transObj?.id },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  useEffect(() => {
    if (transObj?.type === 'Invoice') {
      loadInvoice()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (invoiceLoading) return <div>Loading</div>
  return (
    <>
      {console.log(transObj)}
      {invoiceData && (
        <DetailsDialog
          handleClose={() => handleClose}
          open={detailsOpen}
          title={`Details for ${transObj?.type}`}
        >
          {Object.keys(invoiceData?.invoice).filter((i) => !i.createdAt && !i.updatedAt).map((value) => (
            <div key={value.id}>
              {console.log(value)}
              <DetailsField
                title={value}
                value={Object.keys(value)[0]} 
              />
            </div>
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
      )}
    </>
  )
}