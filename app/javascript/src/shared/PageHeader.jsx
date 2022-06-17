import React from 'react';
import { Typography, Grid } from '@mui/material';
import PropTypes from 'prop-types';

export default function PageHeader({ linkText, linkHref, pageName, PageTitle }) {
  return (
    <>
      <Grid container>
        <Grid item md={12} xs={12} data-testid="page_title">
          <Typography variant="h4" color="textSecondary">
            {PageTitle}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

PageHeader.propTypes = {
  linkText: PropTypes.string.isRequired,
  linkHref: PropTypes.string.isRequired,
  pageName: PropTypes.string.isRequired,
  PageTitle: PropTypes.string.isRequired
};
