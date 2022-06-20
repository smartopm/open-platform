import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Breadcrumbs, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import Avatar from '../components/Avatar';
import UserDetail from '../modules/Users/Components/UserProfileDetail';

export default function PageWrapper({
  children,
  oneCol,
  pageTitle,
  showAvatar,
  breadCrumbObj,
  showBreadCrumb,
  avatarObj,
  rightPanelObj
}) {
  const matches = useMediaQuery('(max-width:900px)');
  const classes = useStyles();
  return (
    <Grid
      container
      className={`${classes.containerStyles} ${classes.topStyle}`}
      style={matches ? { paddingTop: '15%' } : {}}
    >
      <Grid
        item
        lg={1}
        md={1}
        sx={{ display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' } }}
      />
      <Grid item lg={10} md={10} xs={12} sm={12}>
        <AppBar
          position="sticky"
          style={{ background: '#FFFFFF', top: '50px', padding: '30px 0' }}
          elevation={0}
        >
          <Grid container>
            <Grid item md={12} xs={12} sm={12} lg={12}>
              {showBreadCrumb && (
                <Breadcrumbs aria-label="breadcrumb" data-testid="breadcrumb">
                  {breadCrumbObj?.extraBreadCrumb && (
                    <Typography color="primary" variant="caption">
                      <Link className={classes.linkColor} to={breadCrumbObj?.extraBreadCrumbLink}>
                        {breadCrumbObj?.extraBreadCrumb}
                      </Link>
                    </Typography>
                  )}
                  {breadCrumbObj?.linkText && (
                    <Typography color="primary" variant="caption">
                      <Link className={classes.linkColor} to={breadCrumbObj?.linkHref}>
                        {breadCrumbObj?.linkText}
                      </Link>
                    </Typography>
                  )}
                  <Typography color="text.primary" variant="caption">
                    {breadCrumbObj?.pageName}
                  </Typography>
                </Breadcrumbs>
              )}
            </Grid>
            <Grid item md={6} lg={6} sm={8} xs={9}>
              {pageTitle && (
                <Typography variant="h4" color="textSecondary">
                  {pageTitle}
                </Typography>
              )}
              {showAvatar && (
                <div style={{ display: 'flex' }}>
                  <Avatar
                    user={avatarObj?.data.user}
                    // eslint-disable-next-line react/style-prop-object
                    style="small"
                  />
                  <div style={{ marginLeft: '15px' }}>
                    <UserDetail data={avatarObj?.data} />
                  </div>
                </div>
              )}
            </Grid>
            {rightPanelObj && (
              <Grid item md={6} lg={6} xs={3} sm={4}>
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                  {rightPanelObj.map(data => (
                    <div
                      style={matches ? { paddingLeft: '4px' } : { paddingLeft: '15px' }}
                      key={data.key}
                    >
                      {data.mainElement}
                    </div>
                  ))}
                </div>
              </Grid>
            )}
          </Grid>
          <Divider className={classes.divider} />
        </AppBar>
        {oneCol ? (
          <Container maxWidth="md" className={classes.children}>
            {children}
          </Container>
        ) : (
          <div className={classes.children}>{children}</div>
        )}
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
  },
  children: {
    paddingTop: '5%'
  },
  divider: {
    margin: '20px -1000px 0 -1000px'
  }
}));

PageWrapper.defaultProps = {
  oneCol: false,
  showAvatar: false,
  pageTitle: undefined,
  breadCrumbObj: undefined,
  showBreadCrumb: false,
  avatarObj: undefined,
  rightPanelObj: undefined
};

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  oneCol: PropTypes.bool,
  pageTitle: PropTypes.string,
  showAvatar: PropTypes.bool,
  breadCrumbObj: PropTypes.shape({
    extraBreadCrumb: PropTypes.string,
    extraBreadCrumbLink: PropTypes.string,
    linkText: PropTypes.string,
    linkHref: PropTypes.string,
    pageName: PropTypes.string
  }),
  showBreadCrumb: PropTypes.bool,
  avatarObj: PropTypes.shape({
    data: PropTypes.shape({
      user: PropTypes.shape({
        imageUrl: PropTypes.string,
        avatarUrl: PropTypes.string,
        name: PropTypes.string,
        userType: PropTypes.string
      })
    })
  }),
  rightPanelObj: PropTypes.arrayOf({
    key: PropTypes.number,
    mainElement: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
  })
};
