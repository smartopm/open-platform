import React from 'react';
import { StyleSheet, css } from 'aphrodite';

const avatarURL = ({imageURL, user}) => {
  if (imageURL) {
    return imageURL
  } else if(user && user.avatarUrl) {
    return  user.avatarUrl
  } else if(user && user.imageUrl) {
    return  user.imageUrl
  } else {
    return '/images/default_avatar.svg'
  }
}

export default function StatusBadge({imageURL, user, style='small'}) {
  if (style === 'big') {
    return(
      <div className="d-flex justify-content-center">
        <img src={avatarURL({imageURL, user})} className={css(styles.avatarBig)} />
      </div>
      )
  } else {
    return(
      <div className="d-flex justify-content-center">
        <img src={avatarURL({imageURL, user})} className={css(styles.avatarSmall)} />
      </div>
      )
  }
}

const styles = StyleSheet.create({
  avatarSmall: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
  },
  avatarBig: {
    maxWidth: '200px',
    maxHeight: '200px',
    borderRadius: '8px',
  }
})
