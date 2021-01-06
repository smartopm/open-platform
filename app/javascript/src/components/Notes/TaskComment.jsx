/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useQuery } from 'react-apollo'
import {
  Typography
} from '@material-ui/core'
import PropTypes from 'prop-types'
import CommentTextField from './CommentField'
import { CommentQuery } from '../../graphql/queries'
import ErrorPage from "../Error"

export default function TaskComment({ authState, taskId }) {
  const { data: commentData, error, refetch } = useQuery(CommentQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })
  const [commentOpen, setCommentOpen] = useState(false)

  function handleCommentOpen(){
    setCommentOpen(true)
  }
  
  if (error) return <ErrorPage title={error.message} />
  return (
    <>
      {!commentData  && (
        <div>
          <p>Data not available</p>
        </div>
      )}
      <div style={{ display: 'flex', marginBottom: "10px", color: '#69ABA4' }}>
        {/* Todo: refactor code below */}
        {!commentOpen ? (
          <Typography variant="caption" style={{ color: '#69ABA4', marginRight: "15px", cursor: 'pointer' }} onClick={handleCommentOpen} gutterBottom>
            {commentData?.taskComments.length}
            {' '}
            Comments
          </Typography>
        ) : (
          <Typography variant="caption" style={{ color: '#69ABA4', marginRight: "15px", cursor: 'pointer' }} onClick={() => setCommentOpen(false)} gutterBottom>
            Collapse Comments
          </Typography>
        )}
      </div>
      {commentOpen && <CommentTextField data={commentData} refetch={refetch} authState={authState} taskId={taskId} />}
    </>
  )
}

TaskComment.defaultProps = {
  authState: {},
  taskId: '',
 }
 TaskComment.propTypes = {
   // eslint-disable-next-line react/forbid-prop-types
   authState: PropTypes.object,
   taskId: PropTypes.string,
 }  
