import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import CommentCard from './CommentCard';
import { TaskComment } from '../../../graphql/mutations';
import CommentTextField from '../../../shared/CommentTextField';

export default function CommentField({ data, refetch, taskId, commentsRefetch, forProcess, processesProps }) {
  const [commentCreate] = useMutation(TaskComment);
  const [body, setBody] = useState('');
  const [error, setErrorMessage] = useState('');
  const { t } = useTranslation('common');

  function handleSubmit(event) {
    event.preventDefault();
    commentCreate({
      variables: {
        noteId: taskId,
        body
      }
    })
      .then(() => {
        setBody('');
        refetch();
        commentsRefetch();
      })
      .catch(err => {
        setErrorMessage(err);
      });
  }
  return (
    <>
      <CommentTextField
        value={body}
        setValue={setBody}
        handleSubmit={handleSubmit}
        actionTitle={t('misc.comment')}
        placeholder={t('misc.type_comment')}
        forProcess={forProcess}
        processesProps={processesProps}
      />
      <CommentCard
        comments={data.taskComments}
        refetch={refetch}
        commentsRefetch={commentsRefetch}
      />
      { Boolean(error.length) && (<p className="text-center">{error}</p>)}
    </>
  );
}

CommentField.defaultProps = {
  data: {},
  taskId: '',
  commentsRefetch: () => {},
  forProcess: false,
  processesProps: null
};
CommentField.propTypes = {
  data: PropTypes.shape({
    taskComments: PropTypes.arrayOf(PropTypes.object)
  }),
  refetch: PropTypes.func.isRequired,
  taskId: PropTypes.string,
  commentsRefetch: PropTypes.func,
  forProcess: PropTypes.bool,
  processesProps: PropTypes.shape({
    searchUser: PropTypes.func.isRequired,
    setSearchUser: PropTypes.func.isRequired,
    userData: PropTypes.shape({
      usersLite: PropTypes.array
    })
  })
};
