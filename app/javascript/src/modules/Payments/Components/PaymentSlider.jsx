import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { formatMoney } from '../../../utils/helpers';

export default function PaymentSlider({ data, currencyData }) {
  const classes = useStyles();
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
  return (
    <div className={classes.flex}>
      <div style={{ width: calcPercentage(data?.totalPayments, data?.planValue) }}>
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
                  <Typography variant="caption">Amount Paid</Typography>
                  <Typography variant="caption" align="center">
                    {formatMoney(currencyData, data?.totalPayments)}
                  </Typography>
                </div>
              ) : (
                <div className={classes.planBodyValue}>
                  <Typography variant="caption">Plan Value</Typography>
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
          <div style={{ width: calcPercentage(data?.owingAmount, data?.planValue) }}>
            <div className={classes.expectedPayment}> </div>
            {data?.owingAmount < data?.planValue ? (
              <div className={classes.bodySecond}>
                <Typography> </Typography>
                <div className={classes.body}>
                  <ArrowDropDownIcon
                    style={{ color: '#EA2626', marginTop: '-10px', marginLeft: '25%' }}
                  />
                  <div className={classes.owing}>
                    <Typography variant="caption">owing</Typography>
                    <Typography variant="caption">
                      {formatMoney(currencyData, data?.owingAmount)}
                    </Typography>
                    <Typography variant="caption">{`${data?.installmentsDue} installments`}</Typography>
                  </div>
                </div>
                <div className={classes.amountDue}>
                  <Typography variant="caption">Amount due</Typography>
                  <Typography variant="caption" align="center">
                    {formatMoney(currencyData, data?.owingAmount)}
                  </Typography>
                </div>
              </div>
            ) : (
              <div className={classes.spaceBetween}>
                <Typography> </Typography>
                <div className={classes.body}>
                  <ArrowDropDownIcon style={{ color: '#EA2626', marginTop: '-10px' }} />
                  <div className={classes.owing}>
                    <Typography variant="caption">owing</Typography>
                    <Typography variant="caption">
                      {formatMoney(currencyData, data?.owingAmount)}
                    </Typography>
                    <Typography variant="caption">{`${data?.installmentsDue} installments`}</Typography>
                  </div>
                </div>
                <div className={classes.body}>
                  <Typography variant="caption">Plan Value</Typography>
                  <Typography variant="caption" align="center">
                    {formatMoney(currencyData, data?.planValue)}
                  </Typography>
                </div>
              </div>
            )}
          </div>
          <SliderBreaker type={data.owingAmount > 0} />
        </>
      )}
      <div style={{ width: calcPercentage(planVal, data?.planValue) }}>
        <div className={classes.planValue}> </div>
        <div className={classes.spaceBetween}>
          <Typography> </Typography>
          {data?.totalPayments < data?.planValue && (
            <div className={classes.body}>
              <Typography variant="caption">Plan Value</Typography>
              <Typography variant="caption" align="center">
                {formatMoney(currencyData, data?.planValue)}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
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
    marginTop: '20px'
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
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    marginLeft: '-10px'
  },
  amountDue: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px'
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  flex: {
    display: 'flex'
  }
}));

PaymentSlider.propTypes = {
  data: PropTypes.shape({
    planType: PropTypes.string,
    planValue: PropTypes.number,
    totalPayments: PropTypes.number,
    owingAmount: PropTypes.number,
    installmentsDue: PropTypes.number,
    landParcel: PropTypes.shape({
      parcelNumber: PropTypes.string
    })
  }).isRequired,
  currencyData: PropTypes.shape({
    currency: PropTypes.string,
    locale: PropTypes.string
  }).isRequired,
}

SliderBreaker.propTypes = {
  type: PropTypes.bool.isRequired
}
