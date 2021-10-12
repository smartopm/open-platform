import React from 'react';
import { Button, Grid, Typography, makeStyles, Paper } from '@material-ui/core';
import PropTypes from 'prop-types'

export default function IDCapture({ handleNext }) {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12} className={classes.body}>
        <Typography variant='h6' className={classes.header}>Add a photo of your ID with your phone</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={6}>
            <ul>
              <li><Typography>Use portrait orientation</Typography></li>
              <li><Typography>Turn off your camera flash</Typography></li>
            </ul>
          </Grid>
          <Grid item xs={6}>
            <ul>
              <li><Typography>Use a dark background</Typography></li>
              <li><Typography>Take photo on a flat surface</Typography></li>
            </ul>
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        <ImageArea />
        <ImageArea />
      </Grid>
      <Grid item xs={12} className={classes.body}>
        <Button variant='contained' color='primary' onClick={handleNext}>continue</Button>
      </Grid>
    </Grid>
  );
}

function ImageArea() {
  const classes = useStyles();
  return (
    <Grid item xs={12} className={classes.imageGrid}>
      <Paper elevation={0} className={classes.imageArea} style={{height: '400px'}}>
        {' '}
      </Paper>
    </Grid>
  )
}

const useStyles = makeStyles(() => ({ 
  body: {
    textAlign: 'center'
  },
  header: {
    fontWeight: 'bold'
  },
  imageArea: {
    border: '1px dotted #D0D0D0'
  },
  imageGrid: {
    padding: '20px 30px'
  }
}))

IDCapture.propTypes = {
  /**
   * This if invoked in the Horizontal stepper, it will move to next step
   * This component is a placeholder
   */
  handleNext: PropTypes.func.isRequired
}