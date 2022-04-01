import React from 'react';
import { Typography, Breadcrumbs, Link, Grid } from '@mui/material';

export default function FormHeader({ linkText, linkHref, pageName, PageTitle}) {
  return (
    <>
      <Grid container style={{ padding: '0 0 20px 100px' }}>
        <Grid item md={12}>
          <Breadcrumbs aria-label="breadcrumb">
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
        <Grid item md={12}>
          <Typography variant="h4" color="textSecondary">
            {PageTitle}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
