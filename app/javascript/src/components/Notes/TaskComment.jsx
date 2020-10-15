/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router-dom'
import {
  Typography
} from '@material-ui/core'
import PropTypes from 'prop-types'
import ChatIcon from '@material-ui/icons/Chat';
import CommentTextField from './CommentField'
import { CommentQuery } from '../../graphql/queries'
import ErrorPage from "../Error"

export default function TaskComment({ authState }) {
  const { taskId } = useParams()
  const { data: commentData, error, refetch } = useQuery(CommentQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })
  const [open, setOpen] = useState(false)
  
  if (error) return <ErrorPage title={error.message} />
  return (
    <>
      <div style={{ display: 'flex', marginBottom: "10px" }}>
        <Typography variant="caption" style={{ color: '#69ABA4', marginRight: "15px" }} gutterBottom>
          {commentData?.task.noteComments.length}
          {' '}
          Comments
        </Typography>
        <Typography variant="caption" style={{ cursor: 'pointer', color: '#69ABA4' }} gutterBottom>
          {open ? (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div onClick={() => setOpen(false)}>
              |
              <span style={{ marginLeft: "10px" }}>Collapse Comments</span>
            </div>
) 
            : (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <div style={{ display: 'flex' }} onClick={() => setOpen(true)}>
                <ChatIcon />  
                {' '}
                <span style={{ marginLeft: "5px" }}>Comment</span>
              </div>
)}
        </Typography>
      </div>
      {open && <CommentTextField data={commentData} refetch={refetch} authState={authState} />}
    </>
  )
}

TaskComment.defaultProps = {
  authState: {}
 }
 TaskComment.propTypes = {
   // eslint-disable-next-line react/forbid-prop-types
   authState: PropTypes.object
 }
