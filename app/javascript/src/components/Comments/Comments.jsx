/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import DateContainer from '../DateContainer'

export default function Comments({ data }) {
  const classes = useStyles();
  return (
    <>
      {data?.filter(com => com.discussion.postId).map(comment => (
        <div key={comment.id} className={classes.root}>
          <Typography variant='body1'>
            {comment.user.name}
            {' '}
            commented on post
            {' '}
            <Link to={`/news/post/${comment.discussion.postId}`}>{comment.discussion.postId}</Link>
          </Typography>
          <span 
            data-testid="delete_icon"
            className={classes.itemAction}
          >
            <DateContainer date={comment.createdAt} />
          </span>
        </div>
      ))}
    </>
  )
}

const useStyles = makeStyles({
  root: {
    padding: '10px 30px',
    margin: '15px 30px',
    borderRadius: '3px',
    backgroundColor: '#fff',
    display: 'flex'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  itemAction: {
    marginLeft: 'auto',
    order: 2
  }
});
