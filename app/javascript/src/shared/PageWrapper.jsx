import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Breadcrumbs, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import { makeStyles } from '@mui/styles';
import FixedHeader from './FixedHeader';
import PageHeader from './PageHeader';
import Avatar from '../components/Avatar';
import UserDetail from '../modules/Users/Components/UserProfileDetail';

export default function PageWrapper({
  children,
  oneCol,
  pageTitle,
  linkText,
  pageName,
  linkHref,
  showAvatar,
  extraBreadCrumb,
  extraBreadCrumbLink,
  showBreadCrumb,
  avatarObj
}) {
  const matches = useMediaQuery('(max-width:900px)');
  const classes = useStyles();
  return (
    <Grid
      container
      className={`${classes.containerStyles} ${classes.topStyle}`}
      style={matches ? { paddingTop: '15%' } : { paddingTop: '12%' }}
    >
      <Grid
        item
        lg={1}
        md={1}
        sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' } }}
      />
      <Grid item lg={10} md={10} xs={12} sm={12}>
        <FixedHeader>
          <Grid container>
            <Grid item md={12}>
              {showBreadCrumb && (
                <Breadcrumbs aria-label="breadcrumb" data-testid="breadcrumb">
                  {extraBreadCrumb && (
                    <Typography color="primary" variant="caption">
                      <Link className={classes.linkColor} to={extraBreadCrumbLink}>
                        {extraBreadCrumb}
                      </Link>
                    </Typography>
                  )}
                  {linkText && (
                    <Typography color="primary" variant="caption">
                      <Link className={classes.linkColor} to={linkHref}>
                        {linkText}
                      </Link>
                    </Typography>
                  )}
                  <Typography color="text.primary" variant="caption">
                    {pageName}
                  </Typography>
                </Breadcrumbs>
              )}
            </Grid>
            <Grid item md={6}>
              {pageTitle && <PageHeader PageTitle={pageTitle} />}
              {showAvatar && (
                <div style={{ display: 'flex' }}>
                  <Avatar
                    user={avatarObj.data.user}
                    // eslint-disable-next-line react/style-prop-object
                    style="small"
                  />
                  <div style={{ marginLeft: '15px' }}>
                    <UserDetail data={avatarObj.data} userType={avatarObj.userType} />
                  </div>
                </div>
              )}
            </Grid>
          </Grid>
        </FixedHeader>
        {oneCol ? <Container maxWidth="md">{children}</Container> : <div>{children}</div>}
      </Grid>
      <Grid
        item
        lg={1}
        md={1}
        sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' } }}
      />
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  topStyle: {
    paddingBottom: '4%'
  },
  containerStyles: {
    paddingLeft: '16px',
    paddingRight: '16px'
  },
  linkColor: {
    color: theme.palette.primary.main
  }
}));

PageWrapper.defaultProps = {
  oneCol: false
};

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  oneCol: PropTypes.bool,
  pageTitle: PropTypes.string.isRequired
};
