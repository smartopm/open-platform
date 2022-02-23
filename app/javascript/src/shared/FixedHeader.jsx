import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { Container } from '@mui/material';

export default function FixedHeader({ children, fullWidth }) {
  const classes = useStyles();
  return (
    <>
      {fullWidth ? (
        <Grid container data-testid='fullwidth-header'>
          <Grid
            item
            className={classes.fullWidthContainer}
          >
            {children}
          </Grid>
        </Grid>
    ) : (
      <Container data-testid='contained-header'>
        <Grid container>
          <Grid
            item
            className={classes.container}
          >
            {children}
            <Divider className={classes.divider} />
          </Grid>
        </Grid>
      </Container>
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
    paddingRight: '23%',
    '@media (max-width: 600px)': {
      paddingRight: '5%'
    },
    '@media (min-width: 601px) and (max-width: 1400px)': {
      paddingRight: '20%'
    },
    '@media (min-width: 1536px) and (max-width: 5000px)': {
      paddingRight: '35%'
    }
  },
  divider: {
    margin: '20px -1000px 0 -1000px'
  },
  fullWidthContainer: {
    position: 'fixed',
    zIndex: 10,
    width: '100%',
    padding: '30px 20px 20px 20px',
    borderBottom: '1px solid #DDDDDD',
    background: '#FFFFFF',
    marginTop: '-50px',
    paddingRight: '25%',
    '@media (max-width: 600px)': {
      paddingRight: '5%'
    },
    '@media (min-width: 601px) and (max-width: 1400px)': {
      paddingRight: '20%'
    },
    '@media (min-width: 1536px) and (max-width: 5000px)': {
      paddingRight: '35%'
    }
  }
}));

FixedHeader.defaultProps = {
  fullWidth: false
}

FixedHeader.propTypes = {
  children: PropTypes.node.isRequired,
  fullWidth: PropTypes.bool
};
