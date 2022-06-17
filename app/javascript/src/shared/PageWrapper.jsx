import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography, Breadcrumbs, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import { makeStyles } from '@mui/styles';
import FixedHeader from './FixedHeader';
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
            <Grid item md={6} lg={6}>
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
              <Grid item md={6} lg={6}>
                <div style={{ display: 'flex', justifyContent: 'right' }}>
                  {rightPanelObj.map(data => (
                    <div style={{ paddingLeft: '15px' }} key={data.key}>
                      {data.mainElement}
                    </div>
                  ))}
                </div>
              </Grid>
            )}
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
