/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext } from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import Avatar from '../../../components/Avatar';
import { Context } from '../../../containers/Provider/AuthStateProvider';

export default function UserAvatar({ imageUrl, customStyle, searchedUser, size, altText, pathname }) {
  const classes = useStyles();
  const history = useHistory()
  const matches = useMediaQuery('(max-width:600px)')
  const authState = useContext(Context)
  return (
    <div className={matches ? (customStyle || classes.avatarMobile) : (customStyle || classes.avatar)} onClick={() => history.push({pathname})} style={{cursor: 'pointer'}}>
      <Avatar data-testid='avatar' alt={altText} imageUrl={imageUrl} user={authState.user} searchedUser={searchedUser} style={size} />
    </div>
  )
}

const useStyles = makeStyles(() => ({
  avatar: {
    cursor: 'pointer',
    position: 'absolute',
    bottom: 27,
    marginBottom: '10px',
    marginRight: '30px',
    right: 20,
    height: 20,
  },
  avatarMobile: {
    cursor: 'pointer',
    position: 'absolute',
    bottom: 27,
    marginRight: '30px',
    right: 20,
    height: 20,
  }
}));

UserAvatar.defaultProps = {
  customStyle: null,
  searchedUser: null,
  size: 'small',
  altText: '',
  pathname: '/user/settings'
};
UserAvatar.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  /* eslint-disable react/forbid-prop-types */
  customStyle: PropTypes.object,
  searchedUser: PropTypes.object,
  size: PropTypes.string,
  altText: PropTypes.string,
  pathname: PropTypes.string
};