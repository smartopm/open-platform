/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import { useQuery } from 'react-apollo';
import PropTypes, { shape } from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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

export default function PaymentSummary({ authState, translate }) {
  const matches = useMediaQuery('(max-width:600px)')
  const classes = useStyles();
  const theme = useTheme()
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
    return <CenteredContent>{formatError(error?.message || payError?.message)}</CenteredContent>;
  }
  return (
    <div>
      {loading || payLoading ? <Spinner /> : (
        <div>
          {matches ? (
            <div style={{margin: '20px 20px 0 20px', display: 'flex'}}>
              {active === 'payment' ? (
                <Typography className={classes.mobile} onClick={() => setActive('payment')}>{translate('common:misc.payments')}</Typography>
              ) : (
                <Typography className={classes.mobile} onClick={() => setActive('invoice')}>{translate('common:misc.invoice', { count: 0 })}</Typography>
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
              <Grid container alignItems="center">
                <Typography 
                  className={active === 'payment' ? classes.bold : classes.notBold}
                  onClick={() => setActive('payment')}
                  style={active === 'payment' ? {marginRight: '20px', width: '102px', cursor: 'pointer'} : {width: '70px', cursor: 'pointer'}}
                >
                  {translate('common:misc.payments')}
                </Typography>
                <Divider className={active === 'invoice' ? classes.divider : null} orientation="vertical" flexItem style={{height: '8px', marginTop: '12px', verticalAlign: 'middle'}} />
                <Typography 
                  className={active === 'invoice' ? classes.bold : classes.notBold}
                  onClick={() => setActive('invoice')}
                  style={active === 'invoice' ? {marginLeft: '20px', width: '102px', cursor: 'pointer'} : {marginLeft: '20px', width: '102px', cursor: 'pointer'}}
                >
                  {translate('common:misc.invoice', { count: 0 })}
                </Typography>
                <Typography style={{marginLeft: 'auto', marginRight: '81px', cursor: 'pointer', fontSize: '16px', fontWeight: 500}}>
                  <Link to='/users' style={{ color: theme.palette.primary.main }}>{active === 'payment' && translate('dashboard.make_new_payment')}</Link>
                </Typography>
              </Grid>
            </div>
          )}
          {active === 'invoice' ? (
            <Grid container spacing={2} style={matches ? {padding: '20px'} : {padding: '20px 57px 20px 79px', width: '99%'}}>
              {
                // eslint-disable-next-line no-unused-vars
                Object.entries(invoiceCardContent).map(([key, _val]) => (
                  <Grid item xs={6} sm={3} key={key}>
                    <PaymentSummaryCard
                      title={translate(`dashboard.invoice.${key}`)}
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
                // eslint-disable-next-line no-unused-vars
                Object.entries(paymentCardContent).map(([key, _val]) => (
                  <Grid item xs={6} sm={3} key={key}>
                    <PaymentSummaryCard
                      title={translate(`dashboard.payment.${key}`)}
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
            <div style={{display: 'flex', marginLeft: '20px', cursor: 'pointer', fontSize: '14px', fontWeight: 500}}>
              <Typography color='primary' style={{marginRight: '10px', fontWeight: 500}}>
                <Link to='/users'>{translate('dashboard.make_new_payment')}</Link>
              </Typography>
              <TrendingFlatIcon color="primary" />
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
  },
  bold: {
    fontSize: '22px',
    fontWeight: 500,
    color: '#141414'
  },
  notBold: {
    fontSize: '18px',
    fontWeight: 500,
    color: '#959595'
  },
  mobile: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#141414'
  },
  divider: {
    marginLeft: '40px'
  }
}));

PaymentSummary.propTypes = {
  authState: shape({ ...authStateProps }).isRequired,
  translate: PropTypes.func.isRequired
};