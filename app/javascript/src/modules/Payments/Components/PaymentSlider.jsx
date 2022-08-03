import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { formatMoney } from '../../../utils/helpers';
import CenteredContent from '../../../components/CenteredContent';

export default function PaymentSlider({ data, currencyData }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  const { t } = useTranslation('payment');
  const planVal = data?.planValue - (data?.totalPayments + data?.owingAmount);

  function calcPercentage(value, total) {
    const percentage = (value / total) * 100;
    if (percentage > 100) {
      return '100%';
    }
    if (percentage < 0) {
      return '0%';
    }
    return `${percentage}%`;
  }

  function checkOwingPercentage() {
    const val = calcPercentage(data?.owingAmount, data?.planValue);
    const percentage = parseInt(val, 10);

    if (percentage > 0 && percentage < 20) {
      return '40%';
    }
    return val;
  }

  function checkPaidPercentage() {
    const val = calcPercentage(data?.totalPayments, data?.planValue);
    const percentage = parseInt(val, 10);

    if (percentage === 100) {
      return '100%';
    }

    if (percentage > 0 && percentage < 20) {
      return '30%';
    }

    return val;
  }

  function checkValuePercentage() {
    const val = calcPercentage(planVal, data?.planValue);
    const percentage = parseInt(val, 10);

    if (percentage < 20) {
      return true;
    }

    return false;
  }

  return (
    <>
      {data?.owingAmount > 0 && (
        <div>
          {!matches ? (
            <CenteredContent>
              <div className={classes.owing}>
                <Typography variant="caption" style={{ marginRight: '2px' }}>
                  {t('misc.owed')}
                </Typography>
                <Typography variant="caption" style={{ marginRight: '2px' }}>
                  {formatMoney(currencyData, data?.owingAmount)}
                  {','}
                </Typography>
                <Typography variant="caption">
                  {`${data?.installmentsDue} ${t('misc.installments')}`}
                </Typography>
              </div>
            </CenteredContent>
          ) : (
            <Grid>
              <Typography variant="caption" style={{ marginRight: '2px' }}>
                {t('misc.owed')}
              </Typography>
              <Typography variant="caption" style={{ marginRight: '2px' }}>
                {formatMoney(currencyData, data?.owingAmount)}
                {','}
              </Typography>
              <Typography variant="caption" style={{ marginRight: '2px' }}>{t('misc.due')}</Typography>
              <Typography variant="caption" align="center" style={{ marginRight: '2px' }}>
                {formatMoney(currencyData, data?.expectedPayments)}
                {','}
              </Typography>
              <Typography variant="caption">
                {`${data?.installmentsDue} ${t('misc.installments')}`}
              </Typography>
            </Grid>
          )}
        </div>
      )}
      {checkValuePercentage() && data?.totalPayments < data?.planValue && (
        <div className={classes.body} style={{ textAlign: 'right' }}>
          <Typography variant="caption">{t('misc.plan_values')}</Typography>
          <Typography variant="caption">{formatMoney(currencyData, data?.planValue)}</Typography>
        </div>
      )}
      <div className={classes.flex} data-testid="body">
        <div style={{ width: checkPaidPercentage() }}>
          <div className={classes.totalPayment}> </div>
          <div className={classes.sliderDetail}>
            {data?.totalPayments === 0 ? (
              <div className={classes.body}>
                <Typography variant="caption">
                  {formatMoney(currencyData, data?.totalPayments)}
                </Typography>
              </div>
            ) : (
              <div className={classes.bodyFirst}>
                <Typography variant="caption">{formatMoney(currencyData, 0)}</Typography>
                {data?.totalPayments < data?.planValue ? (
                  <div className={classes.amountPaid}>
                    <Typography variant="caption">{t('misc.paid')}</Typography>
                    <Typography variant="caption" align="center">
                      {formatMoney(currencyData, data?.totalPayments)}
                    </Typography>
                  </div>
                ) : (
                  <div className={classes.planBodyValue}>
                    <Typography variant="caption">{t('misc.plan_values')}</Typography>
                    <Typography variant="caption" align="center">
                      {formatMoney(currencyData, data?.planValue)}
                    </Typography>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <SliderBreaker />
        {data?.owingAmount > 0 && (
          <>
            <div style={{ width: checkOwingPercentage() }} data-testid="owing">
              <div className={classes.expectedPayment}> </div>
              {data?.owingAmount < data?.planValue ? (
                !matches && ( 
                  <div className={classes.bodySecond}>
                    <Typography> </Typography>
                    <div
                      className={classes.amountDue}
                      style={
                      checkValuePercentage()
                        ? { marginTop: '10px', marginLeft: '-50px' }
                        : { marginTop: '10px' }
                    }
                    >
                      <Typography variant="caption">{t('misc.due')}</Typography>
                      <Typography variant="caption" align="center">
                        {formatMoney(currencyData, data?.expectedPayments)}
                      </Typography>
                    </div>
                  </div>
                )
              ) : (
                <div className={classes.spaceBetween}>
                  <Typography> </Typography>
                  <div className={classes.body} style={{ marginTop: '10px' }}>
                    <Typography variant="caption">{t('misc.plan_values')}</Typography>
                    <Typography variant="caption" align="center">
                      {formatMoney(currencyData, data?.planValue)}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
            <SliderBreaker type={data?.owingAmount > 0} />
          </>
        )}
        <div style={{ width: calcPercentage(planVal, data?.planValue) }} data-testid="plan-value">
          <div className={classes.planValue}> </div>
          <div className={classes.spaceBetween}>
            <Typography> </Typography>
            {data?.totalPayments < data?.planValue && !checkValuePercentage() && (
              <div className={classes.body} style={{ marginTop: '10px' }}>
                <Typography variant="caption">{t('misc.plan_values')}</Typography>
                <Typography variant="caption" align="center">
                  {formatMoney(currencyData, data?.planValue)}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function SliderBreaker({ type }) {
  const classes = useStyles();
  return (
    <div
      className={classes.sliderBreaker}
      style={type ? { backgroundColor: '#EA2626' } : { backgroundColor: '#66A59A' }}
    >
      {' '}
    </div>
  );
}

const useStyles = makeStyles(() => ({
  totalPayment: {
    backgroundColor: '#66A59A',
    height: '4px',
    marginTop: '8px',
    borderRadius: '2px'
  },
  expectedPayment: {
    backgroundColor: '#EA2626',
    height: '4px',
    marginTop: '8px'
  },
  planValue: {
    backgroundColor: '#E4EFED',
    height: '4px',
    marginTop: '8px'
  },
  sliderBreaker: {
    width: '5px',
    height: '20px',
    borderRadius: '2px'
  },
  sliderDetail: {
    marginTop: '10px'
  },
  body: {
    display: 'flex',
    flexDirection: 'column'
  },
  bodyFirst: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: '-40px'
  },
  amountPaid: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  planBodyValue: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '30px'
  },
  bodySecond: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: '-60px'
  },
  owing: {
    display: 'flex'
  },
  amountDue: {
    display: 'flex',
    flexDirection: 'column'
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  flex: {
    display: 'flex',
    overflow: 'elipses'
  }
}));

PaymentSlider.propTypes = {
  data: PropTypes.shape({
    planType: PropTypes.string,
    planValue: PropTypes.number,
    totalPayments: PropTypes.number,
    owingAmount: PropTypes.number,
    installmentsDue: PropTypes.number,
    expectedPayments: PropTypes.number,
    landParcel: PropTypes.shape({
      parcelNumber: PropTypes.string
    })
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired
};

SliderBreaker.defaultProps = {
  type: false
};

SliderBreaker.propTypes = {
  type: PropTypes.bool
};
