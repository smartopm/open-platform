import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

export default function FixedHeader({ children, fullWidth }) {
  const classes = useStyles();
  return (
    <>
      {fullWidth ? (
        <Grid container>
          <Grid
            item
            className={classes.fullWidthContainer}
          >
            {children}
          </Grid>
        </Grid>
    ) : (
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
    )}
    </>
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
  },
  fullWidthContainer: {
    position: 'fixed',
    zIndex: 10,
    width: '100%',
    padding: '20px',
    borderBottom: '1px solid #DDDDDD',
    background: '#FFFFFF',
    marginTop: '-30px'
  }
}));

FixedHeader.defaultProps = {
  fullWidth: false
}

FixedHeader.propTypes = {
  children: PropTypes.node.isRequired,
  fullWidth: PropTypes.bool
};
