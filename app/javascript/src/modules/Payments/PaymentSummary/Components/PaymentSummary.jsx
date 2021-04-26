/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import { useQuery } from 'react-apollo';
import { shape } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import Divider from '@material-ui/core/Divider';
import { Link, useHistory } from 'react-router-dom'
import { Grid, Typography } from '@material-ui/core'
import { InvoiceSummaryQuery, PaymentSummaryQuery } from '../graphql/payment_summary_query'
import { Spinner } from '../../../../shared/Loading';
import PaymentSummaryCard from './PaymentSummaryCard'
import { propAccessor, formatError } from '../../../../utils/helpers'
import CenteredContent from '../../../../components/CenteredContent';
import { currencies } from '../../../../utils/constants';
import authStateProps from '../../../../shared/types/authState';

const invoiceCardContent = {
  today: 'Total invoices due today',
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

export default function PaymentSummary({ authState }) {
  const matches = useMediaQuery('(max-width:600px)')
  const classes = useStyles();
  const [active, setActive] = useState('payment')
  const { loading, data, error } = useQuery(InvoiceSummaryQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const currency = currencies[authState.user?.community.currency] || '';
  const currencyData = { currency, locale: authState.user?.community.locale }

  const { loading: payLoading, data: payData, error: payError } = useQuery(PaymentSummaryQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const history = useHistory()

  function handleClick(query, value) {
    if (value === 0) return;
    history.push({
      pathname: '/payments',
      state: { from: 'dashboard', query },
      search: `?tab=${active === 'invoice' ? 'invoice' : 'payment'}`
    });
  }

  if (error || payError) {
    return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  }
  return (
    <div>
      {loading || payLoading ? <Spinner /> : (
        <div>
          {matches ? (
            <div style={{margin: '0 20px', display: 'flex'}}>
              {active === 'payment' ? (
                <Typography variant='h6' style={{fontWeight: 'bold'}} onClick={() => setActive('payment')}>Payments</Typography>
              ) : (
                <Typography variant='h6' style={{fontWeight: 'bold'}} onClick={() => setActive('invoice')}>Invoices</Typography>
              )}
              <div style={{marginLeft: 'auto', display: 'flex', marginTop: '5px'}}>
                <div style={active === 'payment' ? {background: '#141414'} : {background: 'transparent'}} className={classes.circle} onClick={() => setActive('payment')}>
                  {' '}
                </div>
                <div style={active === 'invoice' ? {background: '#141414'} : {background: 'transparent'}} className={classes.circleTwo} onClick={() => setActive('invoice')}>
                  {' '}
                </div>
              </div>
            </div>
          ) : (
            <div style={{marginLeft: '79px', marginTop: '20px'}}>
              <Grid container alignItems="center" className={classes.root}>
                <Typography 
                  variant={active === 'payment' ? 'body1' : 'body2'} 
                  color={active === 'payment' ? 'textPrimary' : 'textSecondary'}
                  onClick={() => setActive('payment')}
                  style={active === 'payment' ? {fontWeight: 'bold', marginRight: '10px', width: '70px', cursor: 'pointer'} : {fontWeight: 'none', marginRight: '10px', width: '70px', cursor: 'pointer'}}
                >
                  Payments
                </Typography>
                <Divider orientation="vertical" flexItem style={{height: '8px', marginTop: '8px'}} />
                <Typography 
                  variant={active === 'invoice' ? 'body1' : 'body2'}
                  color={active === 'invoice' ? 'textPrimary' : 'textSecondary'}
                  onClick={() => setActive('invoice')}
                  style={active === 'invoice' ? {fontWeight: 'bold', marginLeft: '10px', width: '100px', cursor: 'pointer'} : {fontWeight: 'none', marginLeft: '10px', width: '100px', cursor: 'pointer'}}
                >
                  Invoices
                </Typography>
                <Typography color='primary' variant='caption' style={{marginLeft: 'auto', fontWeight: 'bold', marginRight: '81px', cursor: 'pointer'}}>
                  <Link to='/users'>{active === 'payment' && 'Make New Payment'}</Link>
                </Typography>
              </Grid>
            </div>
          )}
          {active === 'invoice' ? (
            <Grid container spacing={2} style={matches ? {padding: '20px'} : {padding: '20px 57px 20px 79px', width: '99%'}}>
              {
                Object.entries(invoiceCardContent).map(([key, val]) => (
                  <Grid item xs={6} sm={3} key={key}>
                    <PaymentSummaryCard
                      title={val}
                      value={propAccessor(data?.invoiceSummary, key)}
                      handleClick={handleClick}
                      query={key}
                    />
                  </Grid>
                ))
              }
            </Grid>
          ) : (
            <Grid container spacing={2} style={matches ? {padding: '20px'} : {padding: '20px 57px 20px 79px', width: '99%'}}>
              {
                Object.entries(paymentCardContent).map(([key, val]) => (
                  <Grid item xs={6} sm={3} key={key}>
                    <PaymentSummaryCard
                      title={val}
                      value={propAccessor(payData?.paymentSummary, key)}
                      currencyData={currencyData}
                      handleClick={handleClick}
                      query={key}
                    />
                  </Grid>
                ))
              }
            </Grid>
          )}
          {matches && active === 'payment' && (
            <div style={{display: 'flex', marginLeft: '20px', cursor: 'pointer'}}>
              <Typography color='primary' style={{marginRight: '10px'}}>
                <Link to='/users'>Make New Payment</Link>
              </Typography>
              <TrendingFlatIcon style={{color: '#66A59A'}} />
            </div>
          )}
        </div>
      )}
    </div> 
  )
}

const useStyles = makeStyles(() => ({
  circle: {
    width: '10px', 
    height: '10px', 
    border: '1px solid black', 
    borderRadius: '50%'
  },
  circleTwo: {
    width: '10px', 
    height: '10px', 
    marginLeft: '8px', 
    border: '1px solid black', 
    borderRadius: '50%'
  }
}));

PaymentSummary.propTypes = {
  authState: shape({ ...authStateProps }).isRequired
};