import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';

export default function PageWrapper({ children, oneCol }) {
  const matches = useMediaQuery('(max-width:600px)');
  const classes = useStyles();
  return (
    <Grid
      container
      className={`${classes.containerStyles} ${classes.topStyle}`}
      style={matches ? { paddingTop: '10%' } : { paddingTop: '6%' }}
    >
      <Grid
        item
        lg={oneCol ? 3 : 1}
        md={oneCol ? 3 : 1}
        sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' } }}
      />
      <Grid item lg={oneCol ? 6 : 10} md={oneCol ? 6 : 10} xs={12} sm={12}>
        {children}
      </Grid>
      <Grid
        item
        lg={oneCol ? 3 : 1}
        md={oneCol ? 3 : 1}
        sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' } }}
      />
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  topStyle: {
    paddingBottom: '4%'
  },
  containerStyles: {
    paddingLeft: '16px',
    paddingRight: '16px'
  }
}));

PageWrapper.defaultProps = {
  oneCol: false
}

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  oneCol: PropTypes.bool
};
