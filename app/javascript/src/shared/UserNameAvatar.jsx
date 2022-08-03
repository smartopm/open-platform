import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import UserAvatar from '../modules/Users/Components/UserAvatar';

export default function UserNameAvatar({ user, style }) {
  const matches = useMediaQuery('(max-width:600px)');
  return (
    <Link href={`/user/${user.id}`} color='inherit'>
      <Grid
        container
        style={style}
        alignItems={matches ? 'left' : 'center'}
        justifyContent={matches ? 'left' : 'center'}
        spacing={2}
      >
        <Grid item sm={matches ? 1 : 3} data-testid="avatar">
          <UserAvatar
            searchedUser={user}
            imageUrl={user.avatarUrl || user.imageUrl}
            customStyle={{ width: '50px', height: '50px' }}
          />
        </Grid>
        <Grid item sm={matches ? 11 : 9} data-testid="name">
          {user.name}
        </Grid>
      </Grid>
    </Link>
  );
}

UserNameAvatar.defaultProps = {
  style: {}
};

UserNameAvatar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    avatarUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  style: PropTypes.shape()
};
