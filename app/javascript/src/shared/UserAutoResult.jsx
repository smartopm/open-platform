import React from 'react'
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import UserAvatar from '../modules/Users/Components/UserAvatar';

export default function UserAutoResult({ user, t }) {
  const classes = useStyles();

  return (
    <Grid container className={classes.avatarContainer}>
      <Grid item sm={6} container direction='row'>
        <Grid item style={{marginRight: '10px'}}>
          <UserAvatar searchedUser={user} imageUrl={user.avatarUrl || user.imageUrl} customStyle={classes.userAvatar} />
        </Grid>
        <Grid item sm={9} className={classes.gridItem}>
          {user.name}
        </Grid>
      </Grid>
      <Grid item sm={1}>
        <Divider orientation="vertical" flexItem className={classes.verticalDivider} />
      </Grid>
      <Grid item sm className={classes.gridItem}>
        {t(`common:user_types.${user?.userType}`)}
      </Grid>
      <Grid item sm={1}>
        <Divider orientation="vertical" flexItem className={classes.verticalDivider} />
      </Grid>
      <Grid item sm className={classes.gridItem}>
        {user.extRefId || '-'}
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles(() => ({
  userAvatar: {
    cursor: 'pointer',
    display: 'inline'
  },
  userName: {
    marginLeft: '10px'
  },
  gridItem: {
    paddingTop: '7px'
  },
  avatarContainer: {
    padding: '6px',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: '3px',
    '&:hover': {
      backgroundColor:'rgba(0, 0, 0, 0.08)'
    }
  },
  verticalDivider: {
    height: '25px',
    marginTop: '10px'
  }
}));

UserAutoResult.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    userType: PropTypes.string,
    extRefId: PropTypes.string
  }).isRequired,
  t: PropTypes.func.isRequired
};