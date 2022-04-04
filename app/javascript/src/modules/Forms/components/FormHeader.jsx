import React from 'react';
import { Typography, Breadcrumbs, Link, Grid } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';

export default function FormHeader({ linkText, linkHref, pageName, PageTitle }) {
  const matches = useMediaQuery('(max-width:900px)');
  return (
    <>
      <Grid
        container
        style={matches ? { padding: '0 0 10px 20px', marginTop: '-10px' } : { padding: '0 0 20px 100px' }}
      >
        <Grid item md={12} xs={12}>
          <Breadcrumbs aria-label="breadcrumb" data-testid='breadcrumb'>
            <Typography color="primary" variant="caption">
              <Link underline="hover" color="primary" href={linkHref}>
                {linkText}
              </Link>
            </Typography>
            <Typography color="text.primary" variant="caption">
              {pageName}
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item md={12} xs={12} data-testid='page_title'>
          <Typography variant="h4" color="textSecondary">
            {PageTitle}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

FormHeader.propTypes = {
  linkText: PropTypes.string.isRequired,
  linkHref: PropTypes.string.isRequired,
  pageName: PropTypes.string.isRequired,
  PageTitle: PropTypes.string.isRequired
};
