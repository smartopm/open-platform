/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import CommentField from './CommentField';
import { CommentQuery } from '../../../graphql/queries';
import ErrorPage from '../../../components/Error';

export default function TaskComment({ taskId }) {
  const { data: commentData, error, refetch } = useQuery(CommentQuery, {
    variables: { taskId },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });
  const { t } = useTranslation('common');

  if (error) return <ErrorPage title={error.message} />;
  return (
    <div id="anchor-section" style={{marginTop: '20px'}}>
      {!commentData && (
        <div>
          <p>{t('misc.data_not_available')}</p>
        </div>
      )}
      <CommentField
        data={commentData}
        refetch={refetch}
        taskId={taskId}
      />
    </div>
  );
}

TaskComment.defaultProps = {
  taskId: ''
};
TaskComment.propTypes = {
  taskId: PropTypes.string
};
