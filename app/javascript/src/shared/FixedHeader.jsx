import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

export default function FixedHeader({ children }) {
  const matches = useMediaQuery('(max-width:600px)');
  const classes = useStyles();
  return (
    <div className="container">
      <Grid container>
        <Grid
          item
          className={classes.container}
          // style={matches ? { width: '95%' } : { width: '78%' }}
        >
          {children}
          <Divider className={classes.divider} />
        </Grid>
      </Grid>
    </div>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    paddingTop: '30px',
    position: 'fixed',
    zIndex: 10,
    background: '#FFFFFF',
    top: 50,
    width: '100%',
    paddingRight: '25%'
  },
  divider: {
    margin: '20px -200px 0 -200px'
  }
}));
