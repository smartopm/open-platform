/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-apollo'
import {
  Typography
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import CommentTextField from './CommentField'
import { CommentQuery } from '../../../graphql/queries'
import ErrorPage from "../../../components/Error"
import { useParamsQuery } from '../../../utils/helpers'

export default function TaskComment({ authState, taskId }) {
  const { data: commentData, loading, error, refetch } = useQuery(CommentQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  })
  const path = useParamsQuery();
  const commentTabOpen = path.get('comment');
  const [commentOpen, setCommentOpen] = useState(false)
  const { t } = useTranslation('common')

  useEffect(() => {
    if(!loading && commentTabOpen){
      handleCommentOpen()
    }
  }, [commentTabOpen, loading])

  function handleCommentOpen(){
    setCommentOpen(true)
  }
  
  if (error) return <ErrorPage title={error.message} />
  return (
    <>
      {!commentData  && (
        <div>
          <p>{t('misc.data_not_available')}</p>
        </div>
      )}
      <div style={{ display: 'flex', marginBottom: "10px", color: '#69ABA4' }}>
        {/* Todo: refactor code below */}
        {!commentOpen ? (
          <Typography variant="caption" data-testid='comment' style={{ color: '#69ABA4', marginRight: "15px", cursor: 'pointer' }} onClick={handleCommentOpen} gutterBottom>
            {commentData?.taskComments.length}
            {' '}
            {t('misc.comment_plural')}
          </Typography>
        ) : (
          <Typography variant="caption" data-testid='hide_comment' style={{ color: '#69ABA4', marginRight: "15px", cursor: 'pointer' }} onClick={() => setCommentOpen(false)} gutterBottom>
            {t('misc.collapse_comment')}
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
