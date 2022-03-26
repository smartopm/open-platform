import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import colors from '../../../../themes/nkwashi/colors'
import { formatMoney } from '../../../../utils/helpers';

export default function PaymentSummaryCard({ value, title, handleClick, currencyData, query }){
  const { lightGray } = colors
  const isNotClickable = value === 0
  const backgroundColor = isNotClickable && lightGray
  const classes = useStyles();
  return (
    <div>
      <Card
        elevation={0}
        onClick={() => handleClick(query, value)}
        style={{
          backgroundColor,
          cursor: isNotClickable ? 'not-allowed' : 'pointer',
          border: '1px solid #EBEBEB'
        }}
      >
        <CardContent style={{textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', overflow: 'hidden', height: '140px', textOverflow: 'ellipsis'}}>
          <Typography
            color="textPrimary"
            gutterBottom
            data-testid='card-value'
            className={classes.currency}
          >
            {currencyData?.currency ? formatMoney(currencyData, value) : value}
          </Typography>
          <Typography data-testid='card-title' color="textSecondary" className={classes.title}>
            {title}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  currency: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#141414'
  },
  title: {
    fontSize: '16px',
    fontWeight: 400,
    color: '#575757'
  }
}));

PaymentSummaryCard.defaultProps = {
  currencyData: {
    currency: ''
  }
}

PaymentSummaryCard.propTypes = {
  currencyData: PropTypes.shape({ currency: PropTypes.string, locale: PropTypes.string }),
  value: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired
};