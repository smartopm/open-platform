import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import colors from '../../../../themes/nkwashi/colors'
import { formatMoney } from '../../../../utils/helpers';

export default function PaymentSummaryCard({ value, title, handleClick, currencyData, query }){
  const { lightGray } = colors
  const isNotClickable = value === 0
  const backgroundColor = isNotClickable && lightGray
  const matches = useMediaQuery('(max-width:600px)')
  return (
    <div>
      <Card
        onClick={() => handleClick(query, value)}
        style={{
          backgroundColor,
          cursor: isNotClickable ? 'not-allowed' : 'pointer'
        }}
      >
        <CardContent style={{textAlign: 'center', overflow: 'hidden', height: '140px', textOverflow: 'ellipsis'}}>
          <Typography
            color="textPrimary"
            gutterBottom
            variant={matches ? 'h5' : 'h4'}
            data-testid='card-value'
          >
            {currencyData?.currency ? formatMoney(currencyData, value) : value}
          </Typography>
          <Typography data-testid='card-title' color="textSecondary" variant="caption">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

PaymentSummaryCard.defaultProps = {
  currencyData: {
    currency: ''
  }
}

PaymentSummaryCard.propTypes = {
  currencyData: PropTypes.shape({ currency: PropTypes.string, locale: PropTypes.string }),
  value: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired
};