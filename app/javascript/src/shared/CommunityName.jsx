import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';
import { Typography } from '@material-ui/core';
import ImageAuth from './ImageAuth';
import userProps from './types/user';

// TODO: This component needs to be revisited
export default function CommunityName({ authState, logoStyles }) {
  if (authState.id && authState.community) {
    if (authState.community.logoUrl) {
      return (
        <Link to="/">
          <img
            src={authState.community.logoUrl}
            className={logoStyles.logo ? css(logoStyles.logo) : css(styles.logo)}
            alt="community logo"
          />
        </Link>
      );
    }
    return (
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Typography color="primary">{authState.community.name}</Typography>
      </Link>
    );
  }
  return (
    <Link to="/" style={{ textDecoration: 'none' }}>
      <ImageAuth
        imageLink={authState.user?.community.imageUrl}
        className={logoStyles.logo ? css(logoStyles.logo) : css(styles.logo)}
      />
    </Link>
  );
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
    height: '25px'
  }
});
