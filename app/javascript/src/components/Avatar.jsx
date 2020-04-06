import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import PropTypes from 'prop-types'

export const avatarUrl = ({ imageUrl, user }) => {
  if (imageUrl) {
    return imageUrl
  } else if (user && user.avatarUrl) {
    return user.avatarUrl
  } else if (user && user.imageUrl) {
    return user.imageUrl
  } else {
    return '/images/default_avatar.svg'
  }
}

export default function Avatar({ imageUrl, user, style = 'small' }) {
  if (style === 'big') {
    return (
      <div className="d-flex justify-content-center">
        <img
          src={avatarUrl({ imageUrl, user })}
          className={css(styles.avatarBig)}
        />
      </div>
    )
  } else if (style==='small') {
    return (
      <div className="d-flex justify-content-center">
        <img
          src={avatarUrl({ imageUrl, user })}
          className={css(styles.avatarSmall)}
        />
      </div>
    )
  }else if(style==='medium'){
    return (
      <div style={{width: 80}}>
        <img
          src={avatarUrl({ imageUrl, user })}
          className={css(styles.avatarMedium)}
        />
      </div>
    )
  }
}

Avatar.propTypes = {
  imageUrl: PropTypes.string,
  user: PropTypes.object.isRequired,
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
