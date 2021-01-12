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
        <Typography className={classes.typography}>Parcel Number</Typography>
        <Typography className={classes.typography}>Amount/Payment Type</Typography>
        <Typography className={classes.typography}>Due Date</Typography>
        <Typography className={classes.typography}>Payment made by</Typography>
        <Typography className={classes.typography}>Invoice Status</Typography>
      </Grid>
    </>
  )
}

const useStyles = makeStyles(() => ({
  heading: {
    backgroundColor: '#FFFFFF',
    padding: '15px 0',
    border: '1px solid #ECECEC'
  },
  typography: {
    width: '150px'
  }
}));