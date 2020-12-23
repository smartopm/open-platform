import React from 'react'
import { Typography, Grid } from '@material-ui/core'
import PropTypes from 'prop-types'

export default function PaymentList({ paymentData }) {
  return (
    <Grid container spacing={10} key={paymentData.id}>
      <Grid item>
        <Typography variant="subtitle1" data-testid="name">
          Payment made by: 
          {' '}
          {paymentData.user.name}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="subtitle1" data-testid="type">
          Payment type: 
          {' '}
          {paymentData.paymentType}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="subtitle1" data-testid="status">
          Payment status: 
          {' '}
          {paymentData.paymentStatus}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="subtitle1" data-testid="amount">
          Amount paid: k
          {paymentData.amount}
        </Typography>
      </Grid>
    </Grid>
  )
}

PaymentList.propTypes = {
  paymentData: PropTypes.shape({
    paymentType: PropTypes.string,
    id: PropTypes.string,
    amount: PropTypes.number,
    paymentStatus: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string
    })
  }).isRequired
}
