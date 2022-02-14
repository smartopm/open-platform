import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

export default function FixedHeader({ children }) {
  const classes = useStyles();
  return (
    <div className="container">
      <Grid container>
        <Grid
          item
          className={classes.container}
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
    paddingRight: '25%',
    '@media (max-width: 600px)': {
      paddingRight: '5%'
    },
    '@media (min-width: 601px) and (max-width: 1400px)': {
      paddingRight: '20%'
    }
  },
  divider: {
    margin: '20px -200px 0 -200px'
  }
}));

FixedHeader.propTypes = {
  children: PropTypes.node.isRequired
};
