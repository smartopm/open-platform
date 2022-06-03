import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import CommentCard from './CommentCard';
import { TaskComment } from '../../../graphql/mutations';
import CommentTextField from '../../../shared/CommentTextField';

export default function CommentField({
  data,
  refetch,
  taskId,
  commentsRefetch,
  forProcess,
  taskAssignees,
  taskDocuments
}) {
  const [commentCreate] = useMutation(TaskComment);
  const [body, setBody] = useState('');
  const [replyFrom, setReplyFrom] = useState(null);
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const [error, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mentionedDocuments, setMentionedDocuments] = useState([]);
  const { t } = useTranslation('common');

  function handleSubmit(event) {
    event.preventDefault();
    let variables = {
      noteId: taskId,
      taggedDocuments: mentionedDocuments,
      body
    };
    if (replyFrom) {
      variables = {
        ...variables,
        replyRequired: true,
        replyFromId: replyFrom.id
      };
    }
    setLoading(true);
    commentCreate({
      variables
    })
      .then(() => {
        setBody('');
        setMentionedDocuments([]);
        refetch();
        commentsRefetch();
        setReplyFrom(null);
        setAutoCompleteOpen(false);
        setLoading(false);
      })
      .catch(err => {
        setErrorMessage(err);
        setLoading(false);
      });
  }

  const mentionsData = taskDocuments?.map(doc => {
    return { id: doc.id, display: doc.filename };
  });
  return (
    <>
      <CommentTextField
        value={body}
        setValue={setBody}
        handleSubmit={handleSubmit}
        actionTitle={t('misc.comment')}
        placeholder={t('misc.type_comment')}
        forProcess={forProcess}
        selectedUser={replyFrom}
        setSelectedUser={setReplyFrom}
        autoCompleteOpen={autoCompleteOpen}
        setAutoCompleteOpen={setAutoCompleteOpen}
        taskAssignees={taskAssignees}
        loading={loading}
        mentionsData={mentionsData}
        setMentionedDocuments={setMentionedDocuments}
      />
      <CommentCard
        comments={data.taskComments}
        refetch={refetch}
        commentsRefetch={commentsRefetch}
        forAccordionSection
      />
      {Boolean(error.length) && <p className="text-center">{error}</p>}
    </>
  );
}

CommentField.defaultProps = {
  data: {},
  taskId: '',
  commentsRefetch: () => {},
  forProcess: false,
  taskAssignees: null,
  taskDocuments: null
};
CommentField.propTypes = {
  data: PropTypes.shape({
    taskComments: PropTypes.arrayOf(PropTypes.object)
  }),
  refetch: PropTypes.func.isRequired,
  taskId: PropTypes.string,
  commentsRefetch: PropTypes.func,
  forProcess: PropTypes.bool,
  taskAssignees: PropTypes.array,
  taskDocuments: PropTypes.arrayOf(PropTypes.object)
};
