import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '../../../components/Avatar';
import UserDetail from './UserProfileDetail';
import UserLabels from './UserLabels';
import UserLabelTitle from './UserLabelTitle';

export default function UserDetailHeader({ data, userType, currentTab }) {
  const [isLabelOpen, setIsLabelOpen] = useState(false);
  const classes = useStyles();
  return (
    <>
      <Grid container>
        <Grid item lg={12} md={12} sm={8} xs={8} className={classes.breadCrumb} data-testid='breadcrumb'>
          <Breadcrumbs aria-label="user-breadcrumb">
            <Link color="primary" href="/users" className={classes.link}>
              <Typography variant="caption">Users</Typography>
            </Link>
            {currentTab !== 'Contacts' && (
              <Link color="primary" href={`/user/${data.user.id}`} className={classes.link}>
                <Typography variant="caption">User Detail</Typography>
              </Link>
            )}
            <Typography color="textSecondary" variant="caption">
              {currentTab}
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Hidden mdUp>
          <Grid item sm={4} xs={4} className={classes.labelTitle}>
            {['admin'].includes(userType) && (
              <UserLabelTitle isLabelOpen={isLabelOpen} setIsLabelOpen={setIsLabelOpen} />
            )}
          </Grid>
          {isLabelOpen && (
            <Grid item xs={12} sm={12} className={classes.labels}>
              <UserLabels
                userId={data.user.id}
                isLabelOpen={isLabelOpen}
                setIsLabelOpen={setIsLabelOpen}
              />
            </Grid>
          )}
        </Hidden>
        <Grid
          item
          lg={4}
          md={4}
          sm={12}
          xs={12}
        >
          <Grid container data-testid='user-detail'>
            <Grid item lg={3} md={3} sm={3} xs={3}>
              <Avatar
                user={data.user}
                // eslint-disable-next-line react/style-prop-object
                style="semiSmall"
              />
            </Grid>
            <Grid item lg={9} md={9} sm={9} xs={9}>
              <UserDetail data={data} userType={userType} />
            </Grid>
          </Grid>
        </Grid>
        <Hidden smDown>
          <Grid item lg={3} md={3} sm={3} />
          <Grid item lg={5} md={5} sm={5}>
            {['admin'].includes(userType) && (
              <UserLabelTitle isLabelOpen={isLabelOpen} setIsLabelOpen={setIsLabelOpen} />
            )}
          </Grid>
          {isLabelOpen && (
            <Grid container className={classes.labels}>
              <Grid item md={2} lg={2} sm={2} />
              <Grid item md={10} lg={10} sm={10}>
                <UserLabels
                  userId={data.user.id}
                  isLabelOpen={isLabelOpen}
                  setIsLabelOpen={setIsLabelOpen}
                />
              </Grid>
            </Grid>
          )}
        </Hidden>
      </Grid>
    </>
  );
}

UserDetailHeader.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,
  userType: PropTypes.string.isRequired,
  currentTab: PropTypes.string.isRequired
};

const useStyles = makeStyles(() => ({
  breadCrumb: {
    padding: '10px 0'
  },
  link: {
    textDecoration: 'none'
  },
  labelTitle: {
    paddingTop: '10px',
    textAlign: 'right'
  },
  labels: {
    textAlign: 'center'
  }
}));