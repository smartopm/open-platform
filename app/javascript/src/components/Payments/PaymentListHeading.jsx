import React from 'react'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";

export default function PaymentListHeading(){
  const classes = useStyles();
  return(
    <>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
        className={classes.heading}
      >
        <Typography>Parcel Number</Typography>
        <Typography>Amount/Payment Type</Typography>
        <Typography>Due Date</Typography>
        <Typography>Payment made by</Typography>
        <Typography>Settlement Status</Typography>
        <Typography>Status</Typography>
      </Grid>
    </>
  )
}

const useStyles = makeStyles(() => ({
  heading: {
    backgroundColor: '#FFFFFF',
    padding: '15px 0',
    border: '1px solid #ECECEC'
  }
}));