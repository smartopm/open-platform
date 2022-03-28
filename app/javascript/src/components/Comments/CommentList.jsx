/* eslint-disable no-use-before-define */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import DateContainer from '../DateContainer'
import CenteredContent from '../CenteredContent'

export default function CommentList({ data }) {
  const classes = useStyles();
  return (
    <>
      {!data || !data.length && <CenteredContent>No comments available</CenteredContent>}
      {data?.map(comment => (
        <div key={comment.id} className={classes.root} data-testid="content">
          <div>
            <Typography variant='body1'>
              {comment.user.name}
              {' '}
              {comment.discussion.postId ? 'commented on post' : 'commented on'}
              {' '}
              {comment.discussion.postId ? (
                <Link to={`/news/post/${comment.discussion.postId}`}>
                  {comment.discussion.postId}
                  :
                </Link>
                )
           : <Link to={`/discussions/${comment.discussion.id}`}>discussion:</Link>}
            </Typography>
            <blockquote className={classes.blockQuote}>
              <i>{comment.content}</i>
            </blockquote>
          </div>
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
  },
  blockQuote: {
    marginLeft: '15px'
  }
});

CommentList.defaultProps = {
  data: []
}

CommentList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
      length: PropTypes.number,
      map: PropTypes.func
  }))
}
