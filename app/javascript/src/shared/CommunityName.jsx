import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { Typography } from '@mui/material';
import ImageAuth from './ImageAuth';
import userProps from './types/user';

export default function CommunityName({ authState, logoStyles }) {
  if (authState && authState.user?.community) {
    const { community } = authState.user;
    if (community.imageUrl) {
      return (
        <Link to="/" style={{ textDecoration: 'none' }} data-testid="community_logo">
          <ImageAuth
            imageLink={community.imageUrl}
            className={logoStyles.logo ? css(logoStyles.logo) : css(styles.logo)}
            alt="community logo"
          />
        </Link>
      );
    }
    return (
      <Link to="/" style={{ textDecoration: 'none' }} data-testid="community_name">
        <Typography color="primary">{community.name}</Typography>
      </Link>
    );
  };
  return null;
}

CommunityName.defaultProps = {
  logoStyles: {
    logo: null
  }
};

CommunityName.propTypes = {
  authState: PropTypes.shape({
    id: PropTypes.string,
    user: userProps,
    community: PropTypes.shape({
      name: PropTypes.string,
      logoUrl: PropTypes.string
    })
  }).isRequired,
  logoStyles: PropTypes.shape({
    logo: PropTypes.shape({})
  })
};

const styles = StyleSheet.create({
  logo: {
    margin: '-10px 0 0 30%',
    width: '25%',
    height: '25%'
  }
});
