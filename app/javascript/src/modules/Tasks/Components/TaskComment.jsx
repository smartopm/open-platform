/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CommentField from './CommentField';
import { CommentQuery } from '../../../graphql/queries';
import ErrorPage from '../../../components/Error';

export default function TaskComment({ taskId, commentsRefetch, forProcess, taskAssignees, taskDocuments }) {
  const { data: commentData, error, refetch } = useQuery(CommentQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const { t } = useTranslation('common');

  if (error) return <ErrorPage title={error.message} />;
  return (
    <div style={{marginTop: '20px'}} data-testid='comments'>
      {!commentData && (
        <div>
          <p>{t('misc.data_not_available')}</p>
        </div>
      )}
      <CommentField
        data={commentData}
        refetch={refetch}
        taskId={taskId}
        commentsRefetch={commentsRefetch}
        forProcess={forProcess}
        taskAssignees={taskAssignees}
        taskDocuments={taskDocuments}
      />
    </div>
  );
}

TaskComment.defaultProps = {
  taskId: '',
  commentsRefetch: () => {},
  forProcess: false,
  taskAssignees: null,
  taskDocuments: null
};
TaskComment.propTypes = {
  taskId: PropTypes.string,
  commentsRefetch: PropTypes.func,
  forProcess: PropTypes.bool,
  taskAssignees: PropTypes.array,
  taskDocuments: PropTypes.arrayOf(PropTypes.object)
};
