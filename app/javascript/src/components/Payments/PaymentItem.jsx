import React from 'react'
import {
  ListItem,
  Typography, Grid
} from '@material-ui/core'
import PropTypes from 'prop-types'

export default function PaymentList({ paymentData }){
  return(
    <>
      <ListItem key={paymentData.id}>
        <Grid item xs={10}>
          <Typography 
            variant="subtitle1" 
            data-testid="name"
          >
            Payment made by: 
            {' '}
            {paymentData.user.name}
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography 
            variant="subtitle1" 
            data-testid="type"
          >
            Payment type: 
            {' '}
            {paymentData.paymentType}
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography 
            variant="subtitle1" 
            data-testid="status"
          >
            Payment status: 
            {' '}
            {paymentData.paymentStatus}
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography 
            variant="subtitle1" 
            data-testid="amount"
          >
            Amount paid: 
            {' '}
            k
            {paymentData.amount}
          </Typography>
        </Grid>
      </ListItem>
    </>
  )
}

PaymentList.propTypes = {
  paymentData: PropTypes.shape({
    paymentType: PropTypes.string,
    id: PropTypes.string,
    amount: PropTypes.string,
    paymentStatus: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string
    })
  }).isRequired
}