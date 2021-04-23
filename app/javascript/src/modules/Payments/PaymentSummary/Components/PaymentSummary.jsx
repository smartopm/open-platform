import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo';
import { Link, useHistory } from 'react-router-dom'
import { Grid, Typography } from '@material-ui/core'
import { InvoiceSummaryQuery, PaymentSummaryQuery } from '../graphql/payment_summary_query'
import { Spinner } from '../../../../shared/Loading';
import PaymentSummaryCard from './PaymentSummaryCard'
import { propAccessor } from '../../../../utils/helpers'

const invoiceCardContent = {
  today: 'Total invoices  1  day past due',
  oneWeek: 'Total invoices 1 week past due',
  oneMonth: 'Total invoices 1 month past due',
  overOneMonth: 'Total invoices over 1 month past'
}

const paymentCardContent = {
  today: 'Total amount in payment today',
  oneWeek: 'Total amount in payment this week',
  oneMonth: 'Total amount in payment this month',
  overOneMonth: 'Total amount in payment this year'
}

export default function PaymentSummary() {
  // const classes = useStyles();
  const [active, setActive] = useState('payment')
  const { loading, data, error } = useQuery(InvoiceSummaryQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const { loading: payLoading, data: payData, error: payError } = useQuery(PaymentSummaryQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const history = useHistory()

  // TODO: @olivier ==> check which options you want to go with 
  function handleClick(query) {
    // Query here also seems to be something else so be sure to double check
    console.log(query)
    history.push({
      pathname: '/payments',
      state: { from: query === 'invoice' ? 'dashboard' : 'home', query },
      search: `?tab=${query === 'invoice' ? 'invoice' : 'payment'}`
    })

    // if (active === 'invoice') {
    //   history.push({
    //     pathname: '/payments',
    //     state: { from: 'dashboard', query },
    //     search: '?tab=invoice'
    //   })
    // } else {
    //   history.push({
    //     pathname: '/payments',
    //     state: { from: 'home', query },
    //     search: '?tab=payment'
    //   })
    // }
  }
  return (
    <div>
      {loading || payLoading ? <Spinner /> : (
        <div>
          <div style={{display: 'flex', marginLeft: '79px', marginTop: '60px'}}>
            <Typography 
              variant='h6' 
              color={active === 'payment' ? 'textPrimary' : 'textSecondary'}
              onClick={() => setActive('payment')}
              style={active === 'payment' ? {fontWeight: 'bold', paddingRight: '20px', borderRight: '2px solid #E4E4E4', cursor: 'pointer'} : {fontWeight: 'none', paddingRight: '20px', borderRight: '2px solid #E4E4E4', cursor: 'pointer'}}
            >
              Payments
            </Typography>
            <Typography 
              variant='h6'
              color={active === 'invoice' ? 'textPrimary' : 'textSecondary'}
              onClick={() => setActive('invoice')}
              style={active === 'invoice' ? {fontWeight: 'bold', paddingLeft: '20px', cursor: 'pointer'} : {fontWeight: 'none', paddingLeft: '20px', cursor: 'pointer'}}
            >
              Invoices
            </Typography>
            <Typography color='primary' style={{marginLeft: 'auto', marginRight: '81px', cursor: 'pointer'}}>
              <Link to='/users'>{active === 'payment' && 'Make New Payment'}</Link>
            </Typography>
          </div>
          {active === 'invoice' ? (
            <Grid container spacing={2} style={{padding: '20px 57px 20px 79px', width: '99%'}}>
              {
                Object.entries(invoiceCardContent).map(([key, val]) => (
                  <Grid item xs={6} sm={3} key={key} onClick={() => handleClick(key)}>
                    <PaymentSummaryCard
                      title={val}
                      value={propAccessor(data?.invoiceSummary, key)}
                    />
                  </Grid>
                ))
              }
            </Grid>
          ) : (
            <Grid container spacing={2} style={{padding: '20px 57px 20px 79px', width: '99%'}}>
              {
                Object.entries(paymentCardContent).map(([key, val]) => (
                  <Grid item xs={6} sm={3} key={key} onClick={() => handleClick(key)}>
                    <PaymentSummaryCard
                      title={val}
                      value={propAccessor(payData?.paymentSummary, key)}
                    />
                  </Grid>
                ))
              }
            </Grid>
          )}
        </div>
      )}
    </div> 
  )
}