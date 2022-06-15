import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import FixedHeader from './FixedHeader';
import PageHeader from './PageHeader';

export default function PageWrapper({ children, oneCol, PageTitle }) {
  const matches = useMediaQuery('(max-width:900px)');
  const classes = useStyles();
  return (
    <Grid
      container
      className={`${classes.containerStyles} ${classes.topStyle}`}
      style={matches ? { paddingTop: '15%' } : { paddingTop: '12%' }}
    >
      {/* <FixedHeader>
        <Grid container>
          <Grid
            item
            lg={1}
            md={1}
            sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' } }}
            style={{width: '100%'}}
          />
          <Grid item lg={10} md={10} sm={12} xs={12} style={{width: '100%'}}>
            <PageHeader PageTitle={PageTitle} />
          </Grid>
          <Grid
            item
            lg={1}
            md={1}
            sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' } }}
            style={{width: '100%'}}
          />
        </Grid>
      </FixedHeader> */}
      <Grid
        item
        lg={oneCol ? 3 : 1}
        md={oneCol ? 3 : 1}
        sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' } }}
      />
      <Grid item lg={oneCol ? 6 : 10} md={oneCol ? 6 : 10} xs={12} sm={12}>
        <FixedHeader>
          <PageHeader PageTitle={PageTitle} />
        </FixedHeader>
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
};

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  oneCol: PropTypes.bool,
  PageTitle: PropTypes.string.isRequired
};
