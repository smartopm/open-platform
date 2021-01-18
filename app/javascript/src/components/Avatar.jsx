/* eslint-disable no-use-before-define */
import React, { useContext } from 'react'
import { StyleSheet, css } from 'aphrodite'
import PropTypes from 'prop-types'
import { forceLinkHttps, propAccessor } from '../utils/helpers'
import ImageAuth from './ImageAuth'
import { Context } from '../containers/Provider/AuthStateProvider'

export function safeAvatarLink({ imageUrl, user}){
  if (user?.imageUrl || user?.avatarUrl) {
    return forceLinkHttps(user.imageUrl || user.avatarUrl )
  }
  return forceLinkHttps(imageUrl)
}

export default function Avatar({ imageUrl, user, style}) {
  const { token } = useContext(Context)
  const imageStyles = {
    small: styles.avatarSmall,
    medium: styles.avatarMedium,
    big: styles.avatarBig
  }
  // we have imageUrl and avatarUrl on User and we don't need to re-authenticate these
  // user.imageUrl contains links from Auth Providers ==> Google and Facebook 
  if (user && user.imageUrl) {
    return (
      <img
        src={safeAvatarLink({user, imageUrl})}
        className={css(propAccessor(imageStyles, style))}
        alt="avatar for the user"
      />
    )
  }
  return (
    <ImageAuth
      imageLink={safeAvatarLink({ imageUrl, user })}
      token={token}
      className={css(propAccessor(imageStyles, style))}
    />
  )
}

Avatar.defaultProps = {
  user: {
    avatarUrl: '/images/default_avatar.svg',
    imageUrl: '/images/default_avatar.svg'
  },
  imageUrl: '/images/default_avatar.svg',
  style: 'small'
}

Avatar.propTypes = {
  imageUrl: PropTypes.string,
  user: PropTypes.shape({
    imageUrl: PropTypes.string,
    avatarUrl: PropTypes.string
  }),
  style: PropTypes.string
}

const styles = StyleSheet.create({
  avatarSmall: {
    width: '50px',
    height: '50px',
    borderRadius: '8px'
  },
  avatarMedium: {
    width: '80px',
    height: '80px',
    borderRadius: '8px'
  },
  avatarBig: {
    maxWidth: '200px',
    maxHeight: '200px',
    borderRadius: '8px'
  }
})
