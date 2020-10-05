/* eslint-disable */
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
import Loading from "../Loading"
import ErrorPage from "../Error"

export default function TaskComment({ authState }) {
  const { taskId } = useParams()
  const { data: commentData, error, loading: commentLoad, refetch } = useQuery(CommentQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })
  const [open, setOpen] = useState(false)

  if (commentLoad) return <Loading />
  if (error) return <ErrorPage />
  return (
    <>
      <div style={{ display: 'flex', marginBottom: "10px" }}>
        <Typography variant="caption" style={{ color: '#69ABA4', marginRight: "15px" }} gutterBottom>
            {commentData?.task.noteComments.length} Comments
        </Typography>
        <Typography variant="caption" style={{ cursor: 'pointer', color: '#69ABA4' }} gutterBottom>
          {open ? (<div onClick={() => setOpen(false)}>| <span style={{ marginLeft: "10px" }}>Collapse Comments</span></div>) 
            : (<div style={{ display: 'flex' }} onClick={() => setOpen(true)}><ChatIcon />  <span style={{ marginLeft: "5px" }}>Comment</span></div>)}
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
   authState: PropTypes.object
 }
