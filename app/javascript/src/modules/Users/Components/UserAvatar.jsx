import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';

export default function UserAvatar({ imageUrl }) {
  const classes = useStyles();
  const history = useHistory()
  return (
    <div>
      <div className={classes.avatar}>
        <Avatar data-testid='avatar' onClick={() => history.push({pathname: '/user_actions', state: { imageUrl }})} alt="user_image" src={imageUrl} />
      </div>
    </div>
  )
}

const useStyles = makeStyles(() => ({
  avatar: {
    cursor: 'pointer',
    position: 'absolute',
    bottom: 30,
    marginBottom: '10px',
    marginRight: '30px',
    right: 20,
    height: 20,
  }
}));

UserAvatar.propTypes = {
  imageUrl: PropTypes.string.isRequired
};