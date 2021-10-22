/* eslint-disable no-use-before-define */
import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';
import { forceLinkHttps, objectAccessor } from '../utils/helpers';
import ImageAuth from '../shared/ImageAuth';

export function safeAvatarLink({ imageUrl, user }) {
  if (user?.avatarUrl || user?.imageUrl) {
    return forceLinkHttps(user.avatarUrl || user.imageUrl);
  }
  return forceLinkHttps(imageUrl);
}

export default function Avatar({ imageUrl, user, style, searchedUser }) {
  const imageStyles = {
    small: styles.avatarSmall,
    medium: styles.avatarMedium,
    big: styles.avatarBig
  };
  // we have imageUrl and avatarUrl on User and we don't need to re-authenticate these
  // user.imageUrl contains links from Auth Providers ==> Google and Facebook
  if(searchedUser && searchedUser.avatarUrl){
    // non Auth provider user, but has attached image
    return (
      <ImageAuth
        imageLink={safeAvatarLink({ imageUrl: searchedUser.avatarUrl})}
        className={css(objectAccessor(imageStyles, style))}
        alt="avatar for the user"
      />
    );
  }
  if(searchedUser && searchedUser.imageUrl){
    // Auth provider user - Google & Facebook
    return (
      <img
        src={safeAvatarLink({ imageUrl: searchedUser.imageUrl})}
        className={css(objectAccessor(imageStyles, style))}
        alt="avatar for the user"
        data-testid="searched_auth_user_avatar"
      />
    );
  }


  if(searchedUser && !(searchedUser.imageUrl || searchedUser.avatarUrl)){
    // Non Auth provider user, no Image attached. Uses default
    return (
      <img
        src={safeAvatarLink({ imageUrl: '/images/default_avatar.svg' })}
        className={css(objectAccessor(imageStyles, style))}
        alt="avatar for the user"
        data-testid="searched_default_user_avatar"
      />
    );
  }

  if (user && user.avatarUrl) {
    return (
      <ImageAuth
        imageLink={safeAvatarLink({ imageUrl, user })}
        className={css(objectAccessor(imageStyles, style))}
        alt="avatar for the user"
      />
    );
  }
  if (!imageUrl) {
    return (
      <img
        src={safeAvatarLink({ imageUrl: '/images/default_avatar.svg' })}
        className={css(objectAccessor(imageStyles, style))}
        alt="avatar for the user"
        data-testid="searched_default_user_avatar"
      />
    )
  }
  return (
    <img
      src={safeAvatarLink({ user, imageUrl })}
      className={css(objectAccessor(imageStyles, style))}
      alt="avatar for the user"
      data-testid="user_avatar"
    />
  );
}

Avatar.defaultProps = {
  user: {
    avatarUrl: null,
    imageUrl: '/images/default_avatar.svg'
  },
  imageUrl: '/images/default_avatar.svg',
  style: 'small',
  searchedUser: null,
};

Avatar.propTypes = {
  imageUrl: PropTypes.string,
  user: PropTypes.shape({
    imageUrl: PropTypes.string,
    avatarUrl: PropTypes.string
  }),
  style: PropTypes.string,
  searchedUser: PropTypes.shape({
    imageUrl: PropTypes.string,
    avatarUrl: PropTypes.string
  }),
};

const styles = StyleSheet.create({
  avatarSmall: {
    width: '40px',
    height: '40px',
    borderRadius: '20px'
  },
  avatarMedium: {
    width: '80px',
    height: '80px',
    borderRadius: '40px'
  },
  avatarBig: {
    maxWidth: '200px',
    maxHeight: '200px',
    borderRadius: '100px',
  }
});
