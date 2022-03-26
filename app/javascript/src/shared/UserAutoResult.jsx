import React from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import makeStyles from '@mui/styles/makeStyles';
import UserAvatar from '../modules/Users/Components/UserAvatar';

export default function UserAutoResult({ user, t }) {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:800px)');

  return (
    <Grid container className={classes.avatarContainer} style={{ display: 'flex' }}>
      <Grid item md={2} sm={1} style={{ marginRight: '5px' }}>
        <UserAvatar
          searchedUser={user}
          imageUrl={user.avatarUrl || user.imageUrl}
          customStyle={classes.userAvatar}
        />
      </Grid>
      <Grid item md={3} sm={4} className={matches ? classes.nameGridItemXS : classes.nameGridItem}>
        {user.name}
      </Grid>

      <Grid item md={1} sm={1}>
        <Divider orientation="vertical" flexItem className={classes.verticalDivider} />
      </Grid>

      <Grid item md={3} sm={4} className={matches ? classes.typeGridItemXS : classes.typeGridItem}>
        {t(`common:user_types.${user?.userType}`)}
      </Grid>

      <Grid item md={1} sm={1}>
        <Divider orientation="vertical" flexItem className={classes.verticalDivider} />
      </Grid>
      <Grid item md={1} sm={2} className={matches ? classes.refGridItemXS : classes.gridItem}>
        {user.extRefId || '-'}
      </Grid>
    </Grid>
  );
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

  nameGridItem: {
    paddingTop: '7px',
    width: '40%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  typeGridItem: {
    paddingTop: '7px',
    width: '40%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  nameGridItemXS: {
    paddingTop: '7px',
    marginRight: '10px',
    width: '38%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  typeGridItemXS: {
    paddingTop: '7px',
    marginLeft: '5px',
    marginRight: '5px',
    width: '20%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  refGridItemXS: {
    paddingTop: '7px',
    marginLeft: '15px'
  },
  avatarContainer: {
    padding: '6px',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    borderRadius: '3px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)'
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
