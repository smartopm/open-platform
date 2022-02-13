import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';

export default function FixedHeader({ children }) {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item sm={12}>
        <div className={classes.container}>
          {children}
        </div>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles(() => ({
  container: {
    padding: '30px 0 10px 0',
    position: 'fixed',
    zIndex: 1000,
    background: "#FFFFFF",
    width: '78%',
    top: 50,
    borderBottom: '2px solid #F9F9F9'
  }
}))