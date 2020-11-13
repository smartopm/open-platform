/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import DateContainer from '../DateContainer'
import { CommentsPostQuery } from '../../graphql/queries'
import Loading from '../Loading'
import ErrorPage from '../Error'

export default function Comments() {
  const { loading, error, data } = useQuery(CommentsPostQuery, {
    variables: { limit, offset }
  })
  const limit = 20
  const [offset, setOffset] = useState(0)
  const classes = useStyles();

  function handleNextPage() {
    setOffset(offset + limit)
  }

  function handlePreviousPage() {
    if (offset < limit) {
      return
    }
    setOffset(offset - limit)
  }
  
  if (loading) return <Loading />

  if (error) {
    return <ErrorPage title={error.message || error} />
  }

  return (
    <>
      {data?.fetchComments.filter(com => com.discussion.postId).map(comment => (
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
      <div className="d-flex justify-content-center">
        <nav aria-label="center Page navigation">
          <ul className="pagination">
            <li className={`page-item ${offset < limit && 'disabled'}`}>
              <a className="page-link" onClick={handlePreviousPage} href="#">
                Previous
              </a>
            </li>
            <li
              className={`page-item ${data.fetchComments.length < limit &&
                  'disabled'}`}
            >
              <a className="page-link" onClick={handleNextPage} href="#">
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
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
