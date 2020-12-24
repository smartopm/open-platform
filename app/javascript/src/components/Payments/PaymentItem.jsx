import React from 'react'
import { Typography, Grid } from '@material-ui/core'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function PaymentItem({ paymentData }) {
  return (
    <Grid container spacing={10} key={paymentData.id} style={{ marginLeft: 20 }}>
      <Grid item>
        <Typography variant="subtitle1" data-testid="name">
          Payment made by: 
          {' '}
          <Link to={`/user/${paymentData.user.id}?tab=Payments`}>{paymentData.user.name}</Link>
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

PaymentItem.propTypes = {
  paymentData: PropTypes.shape({
    paymentType: PropTypes.string,
    id: PropTypes.string,
    amount: PropTypes.number,
    paymentStatus: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string
    })
  }).isRequired
}
