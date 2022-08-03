/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useQuery } from 'react-apollo';
import PropTypes, { shape } from 'prop-types';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { Link, useHistory } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import { PaymentSummaryQuery } from '../graphql/payment_summary_query';
import PaymentSummaryCard from './PaymentSummaryCard';
import { objectAccessor, formatError } from '../../../../utils/helpers';
import CenteredContent from '../../../../shared/CenteredContent';
import { currencies } from '../../../../utils/constants';
import authStateProps from '../../../../shared/types/authState';
import CustomSkeleton from '../../../../shared/CustomSkeleton';

const paymentCardContent = {
  today: 'Total amount paid today',
  oneWeek: 'Total amount paid in the past 7 days',
  oneMonth: 'Total amount paid in the past 30 days',
  overOneMonth: 'Total amount paid in this year'
};

export default function PaymentSummary({ authState, translate }) {
  const matches = useMediaQuery('(max-width:600px)');
  const classes = useStyles();
  const theme = useTheme();

  const currency = currencies[authState.user?.community.currency] || '';
  const currencyData = { currency, locale: authState.user?.community.locale };

  const { loading: payLoading, data: payData, error: payError } = useQuery(PaymentSummaryQuery, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const history = useHistory();

  function handleClick(query, value) {
    if (value === 0) return;
    history.push({
      pathname: '/payments',
      state: { from: 'dashboard', query }
    });
  }

  if (payError) {
    return <CenteredContent>{formatError(payError?.message)}</CenteredContent>;
  }
  return (
    <div>
      {matches ? (
        <div style={{ margin: '20px 0' }}>
          <Typography className={classes.mobile}>{translate('common:misc.payments')}</Typography>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <Grid container alignItems="center">
            <Typography
              className={classes.bold}
              style={{ marginRight: '20px', width: '102px', cursor: 'pointer' }}
            >
              {translate('common:misc.payments')}
            </Typography>
            <Typography
              style={{
                marginLeft: 'auto',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              <Link to="/payments?type=new" style={{ color: theme.palette.primary.main }}>
                {translate('dashboard.make_new_payment')}
              </Link>
            </Typography>
          </Grid>
        </div>
      )}
      {payLoading ? (
        <Grid
          container
          spacing={2}
          style={matches ? { padding: '20px 0' } : { padding: '20px 0' }}
        >
          {Array.from(new Array(4)).map((_arr, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Grid item xs={6} sm={3} key={index}>
              <CustomSkeleton variant="rectangular" width="100%" height="140px" />
            </Grid>
          ))}
        </Grid>
      ) : (
        <div>
          <Grid
            container
            spacing={2}
            style={matches ? { padding: '20px 0' } : { padding: '20px 0' }}
          >
            {// eslint-disable-next-line no-unused-vars
            Object.entries(paymentCardContent).map(([key, _val]) => (
              <Grid item xs={6} sm={3} key={key}>
                <PaymentSummaryCard
                  title={translate(`dashboard.payment.${key}`)}
                  value={objectAccessor(payData?.transactionSummary, key)}
                  currencyData={currencyData}
                  handleClick={handleClick}
                  query={key}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      )}
      {matches && (
        <div
          style={{
            display: 'flex',
            marginLeft: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          <Typography color="primary" style={{ marginRight: '10px', fontWeight: 500 }}>
            <Link to="/payments?type=new">{translate('dashboard.make_new_payment')}</Link>
          </Typography>
          <TrendingFlatIcon color="primary" />
        </div>
      )}
    </div>
  );
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
