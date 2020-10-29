/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useQuery } from 'react-apollo'
import { useParams } from 'react-router-dom'
import {
  Typography
} from '@material-ui/core'
import PropTypes from 'prop-types'
import CommentTextField from './CommentField'
import { CommentQuery, HistoryQuery } from '../../graphql/queries'
import ErrorPage from "../Error"
import TaskUpdateList from './TaskUpdateList'

export default function TaskComment({ authState }) {
  const { taskId } = useParams()
  const { data: commentData, error, refetch } = useQuery(CommentQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })
  const { data: historyData, error: historyError, refetch: historyRefetch } = useQuery(HistoryQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })
  const [commentOpen, setCommentOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)

  function handleCommentOpen(){
    setCommentOpen(true)
    setUpdateOpen(false)
  }

  function handleUpdateOpen(){
    setUpdateOpen(true)
    setCommentOpen(false)
  } 
  
  if (error || historyError) return <ErrorPage title={error.message} />
  return (
    <>
      {console.log(historyData)}
      {!commentData || !historyData && (
        <div>
          <p>Data not available</p>
        </div>
      )}
      <div style={{ display: 'flex', marginBottom: "10px", color: '#69ABA4' }}>
        {!commentOpen ? (
          <Typography variant="caption" style={{ color: '#69ABA4', marginRight: "15px" }} onClick={handleCommentOpen} gutterBottom>
            {commentData?.taskComments.length}
            {' '}
            Comments
          </Typography>
        ) : (
          <Typography variant="caption" style={{ color: '#69ABA4', marginRight: "15px" }} onClick={() => setCommentOpen(false)} gutterBottom>
            Collapse Comments
          </Typography>
        )}
        {' '}
        |
        {!updateOpen ? (
          <Typography variant="caption" style={{ color: '#69ABA4', marginLeft: "15px" }} onClick={handleUpdateOpen} gutterBottom>
            {historyData?.taskHistories.length}
            {' '}
            Updates
          </Typography>
        ) : (
          <Typography variant="caption" style={{ color: '#69ABA4', marginLeft: "15px" }} gutterBottom onClick={() => setUpdateOpen(false)}>
            Collapse Updates
          </Typography>
        )}
      </div>
      {commentOpen && <CommentTextField data={commentData} refetch={refetch} authState={authState} taskId={taskId} historyRefetch={historyRefetch} />}
      {updateOpen && <TaskUpdateList data={historyData.taskHistories} />}
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
