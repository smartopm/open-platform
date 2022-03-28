import React from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/styles';
import UserAvatar from '../../Users/Components/UserAvatar';

// TODO: Put in a more shareable directory
export function LinkToUser({ userId, name }) {
  const theme = useTheme();
  return (
    <Typography gutterBottom>
      <Link
        style={{ textDecoration: 'none', fontSize: '12px', color: theme.palette.primary.main }}
        to={`/user/${userId}`}
      >
        {name}
      </Link>
    </Typography>
  );
}

export function LinkToUserAvatar({ user }) {
  return (
    <UserAvatar
      searchedUser={user}
      imageUrl={user.avatarUrl || user.imageUrl}
      customStyle={{ cursor: 'pointer', display: 'inline' }}
      size="xSmall"
      altText=""
      pathname={`/user/${user.id}`}
    />
  );
}

LinkToUser.propTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

LinkToUserAvatar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    avatarUrl: PropTypes.string,
    imageUrl: PropTypes.string
  }).isRequired
};
