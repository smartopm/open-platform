import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

export default function FixedHeader({ children }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:900px)');
  return (
    <div data-testid="contained-header">
      <Grid container>
        <Grid
          item
          className={classes.container}
          style={matches ? { paddingRight: '10%' } : { paddingRight: '18%' }}
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
    width: '100%'
    // left: 0
    // paddingRight: '23%',
    // '@media (max-width: 600px)': {
    //   paddingRight: '5%'
    // },
    // '@media (min-width: 601px) and (max-width: 1400px)': {
    //   paddingRight: '20%'
    // },
    // '@media (min-width: 1536px) and (max-width: 5000px)': {
    //   paddingRight: '35%'
    // }
  },
  divider: {
    margin: '20px -1000px 0 -1000px'
  }
  // fullWidthContainer: {
  //   position: 'fixed',
  //   zIndex: 10,
  //   width: '100%',
  //   padding: '30px 20px 20px 20px',
  //   borderBottom: '1px solid #DDDDDD',
  //   background: '#FFFFFF',
  //   marginTop: '-50px',
  //   paddingRight: '25%',
  //   '@media (max-width: 600px)': {
  //     paddingRight: '5%'
  //   },
  //   '@media (min-width: 601px) and (max-width: 1400px)': {
  //     paddingRight: '20%'
  //   },
  //   '@media (min-width: 1536px) and (max-width: 5000px)': {
  //     paddingRight: '35%'
  //   }
  // }
}));

FixedHeader.propTypes = {
  children: PropTypes.node.isRequired
};
