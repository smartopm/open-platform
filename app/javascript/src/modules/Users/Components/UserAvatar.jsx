import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';

export default function UserAvatar({ imageUrl }) {
  const classes = useStyles();
  const history = useHistory()
  return (
    <div>
      <Avatar onClick={() => history.push({pathname: '/user_actions', state: { imageUrl }})} className={classes.avatar} alt="user_image" src={imageUrl} />
    </div>
  )
}

const useStyles = makeStyles(() => ({
  avatar: {
    cursor: 'pointer'
  }
}));