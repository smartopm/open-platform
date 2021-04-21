import React from 'react'
import { useQuery } from 'react-apollo';
import { Grid } from '@material-ui/core'
import { InvoiceSummaryQuery } from '../graphql/payment_summary_query'
import { Spinner } from '../../../../shared/Loading';
import PaymentSummaryCard from './PaymentSummaryCard'
import { propAccessor } from '../../../../utils/helpers'

const invoiceCardContent = {
  today: 'Total invoices 1 day past due',
  oneWeek: 'Total invoices 1 week past due',
  oneMonth: 'Total invoices 1 month past due',
  overOneMonth: 'Total invoices over 1 month past due'
}

export default function PaymentSummary() {
  // const classes = useStyles();
  const { loading, data, error } = useQuery(InvoiceSummaryQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  return (
    <div>
      {loading ? <Spinner /> : (
        <div>
          {console.log(data)}
          {
            Object.entries(invoiceCardContent).map(([key, val]) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
                <PaymentSummaryCard
                  title={val}
                  value={propAccessor(data?.invoiceSummary, key)}
                />
              </Grid>
            ))
          }
          hello
        </div>
      )}
    </div> 
  )
}