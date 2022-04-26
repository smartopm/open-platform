import React from 'react';
import { Typography, Breadcrumbs, Grid } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';

export default function PageHeader({ linkText, linkHref, pageName, PageTitle }) {
  const matches = useMediaQuery('(max-width:900px)');
  const classes = useStyles();
  return (
    <>
      <Grid
        container
        style={
          matches ? { padding: '0 0 10px 20px', marginTop: '-10px' } : { padding: '0 0 20px 100px' }
        }
      >
        <Grid item md={12} xs={12}>
          <Breadcrumbs aria-label="breadcrumb" data-testid="breadcrumb">
            <Typography color="primary" variant="caption">
              <Link className={classes.linkColor} to={linkHref}>
                {linkText}
              </Link>
            </Typography>
            <Typography color="text.primary" variant="caption">
              {pageName}
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item md={12} xs={12} data-testid="page_title">
          <Typography variant="h4" color="textSecondary">
            {PageTitle}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  linkColor: {
    color: theme.palette.primary.main
  }
}));

PageHeader.propTypes = {
  linkText: PropTypes.string.isRequired,
  linkHref: PropTypes.string.isRequired,
  pageName: PropTypes.string.isRequired,
  PageTitle: PropTypes.string.isRequired
};
